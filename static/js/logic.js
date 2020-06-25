// var API_KEY = "API KEY HERE";

var grades = [0, 1, 2, 3, 4, 5];
var colors = ["#98ee00", "#d4ee00", "#eecc00", "#ee9c00", "#ea822c", "#ea2c2c"];

// Create tileLayer and add to map
var lightmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: 'mapbox/light-v10',
    accessToken: API_KEY
});

var satellitemap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: 'mapbox/satellite-streets-v11',
    accessToken: API_KEY
});

var outdoorsmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: 'mapbox/outdoors-v11',
    accessToken: API_KEY
});

// Create the map
var map = L.map("map", {
    // United States lat, lon
    center: [37.1, -95.7],
    // Initial settings
    zoom: 4,
    layers: [satellitemap]
});

// Create baseMaps/overlays and create control
var tectonicplates = new L.LayerGroup();
var earthquakes = new L.LayerGroup();
var heatmap = new L.LayerGroup();
var markers = L.markerClusterGroup();

var baseMaps = {
    "Satellite": satellitemap,
    "Grayscale": lightmap,
    "Outdoors": outdoorsmap,
};

var overlays = {
    "Tectonic Plates": tectonicplates,
    "Earthquakes": earthquakes,
    "Earthquakes Heatmap": heatmap,
    "Earthquakes Markers": markers
};

options = {
    collapsed: false
};

L.control.layers(baseMaps, overlays, options).addTo(map);

// For other data: 
// https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php 
var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Use D3 to retrieve data from url
d3.json(queryURL).then(function (data) {
    // When creating the geoJson layer, we can style our visualization
    // Colors
    function getColor(magnitude) {
        switch (true) {
            case magnitude > grades[5]:
                return colors[0];
            case magnitude > grades[4]:
                return colors[1];
            case magnitude > grades[3]:
                return colors[2];
            case magnitude > grades[2]:
                return colors[3];
            case magnitude > grades[1]:
                return colors[4];
            // Magnitudes between 0 and 1
            default:
                return colors[5];
        }
    }

    // Radius Size
    function getRadius(magnitude) {
        if (magnitude === 0) {
            return 1;
        }
        return magnitude * 4;
    }

    // Return dictionary we can use as the style in our geoJson
    // Options https://leafletjs.com/examples/geojson/
    function getStyle(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: getColor(feature.properties.mag),
            color: "#000000",
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }

    // Add a geoJson layer
    L.geoJson(data, {
        // pointToLayer https://leafletjs.com/examples/geojson/
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        // style attribute takes in our function, not invoked
        style: getStyle,
        // Create a popup for each marker
        onEachFeature: function (feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
        }
        // Add to the earthquakes layer group
    }).addTo(earthquakes);

    // Add to map
    earthquakes.addTo(map);


    // Create legend
    // Custom Legend Control https://leafletjs.com/examples/choropleth/
    var legend = L.control({
        position: "bottomright"
    });
    // Add the details
    legend.onAdd = function () {
        var div = L.DomUtil.create("div", "info legend");

        // Append labels to the legend
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML += "<i style='background: " + colors[i] + "'></i>" +
                // Use ternary operator ?, 
                // grades[i+1] at last grades.length will return false and result in the false operator ":"
                grades[i] + (grades[i + 1]
                    ? "-" + grades[i + 1] + "<br>"
                    : "+");
        }
        return div;
    };
    legend.addTo(map);

    // Tectonic plate geoJson data https://github.com/fraxen/tectonicplates
    d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function (plateData) {
        // geoJson
        var myStyle = {
            "color": "orange",
            "weight": "1",
            "opacity": 1
        };
        L.geoJson(plateData, {
            style: myStyle
        }).addTo(tectonicplates);
        //Add layer to map
        tectonicplates.addTo(map);
    });

    // Heatmap https://github.com/Leaflet/Leaflet.heat
    // Markers/Clusters https://github.com/Leaflet/Leaflet.markercluster
    var heatArray = [];
    for (var i = 0; i < data.features.length; i++) {
        var currentData = data.features[i];
        var location = currentData.geometry;
        var properties = currentData.properties;

        if (location) {
            // Heatmap
            heatArray.push([location.coordinates[1], location.coordinates[0]]);
            // Clusters
            markers.addLayer(L.marker([location.coordinates[1], location.coordinates[0]])).bindPopup(properties.title + "<br>");
        }
    }

    var heat = L.heatLayer(heatArray, {
        radius: 40,
        blur: 0,
        gradient: {
            0.1: 'blue',
            0.15: 'lime',
            0.20: 'orange',
            0.25: 'red',
        }
    }).addTo(heatmap);


})