# Visualizing Data with Leaflet

![1-Logo](Images/1-Logo.png)

The United States Geological Survey (USGS) is responsible for providing scientific data about natural hazards, the health of our ecosystems and environment; and the impacts of climate and land-use change. Their scientists develop new methods and tools to supply timely, relevant, and useful information about the Earth and its processes. As a new hire, you will be helping them out with an exciting new project!

The USGS is interested in building a new set of tools that will allow them visualize their earthquake data. They collect a massive amount of data from all over the world each day, but they lack a meaningful way of displaying it. Their hope is that being able to visualize their data will allow them to better educate the public and other government organizations (and hopefully secure more funding..) on issues facing our planet.

## Visualization

### Level 1: Basic Visualization

![2-Map](Images/2-Map.png)

1. **The Data**

   The USGS provides earthquake data in a number of different formats, updated every 5 minutes. In the [USGS GeoJSON Feed](http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php) under 'All Earthquakes from the Past 7 Days', there is a JSON representation of that data. Use D3 to retrieve this to build the visualization.

![3-Json](Images/3-Json.png)

1. **Import & Visualize the Data**

   Create a map using Leaflet that plots all of the earthquakes from your data set based on their longitude and latitude.

   * The data markers reflect the magnitude of the earthquake in their size and color. Earthquakes with higher magnitudes should appear larger and darker in color.
   * When a marker is clicked, a popup displays additional information about the earthquake.
   *  Legend that will provide context for your map data.
   * Control layers to change between map displays and toggle between layers.

3. **Tectonic Plates**

   The USGS wants you to plot a second data set on your map to illustrate the relationship between tectonic plates and seismic activity. Data on tectonic plates can be found at <https://github.com/fraxen/tectonicplates>.

   *  Add the layer to the control and initialize webpage to toggle.

- - -

### Notes

* We can go to [Mapbox](https://www.mapbox.com/) to sign up for a free API key, where we will use this as our accessToken when building tile layers.

* Alternatively to using the console, [Postman](https://www.postman.com/) is a helpful tool to look at the data. Submit a GET request to the request URL and look at the body response, which Postman prettifies for us.
* Leaflet includes tutorials that we can use to keep up with any changes. Some static maps have been depreciated and there have been a few changes made. There is a quick start tutorial by leaflet to view how tile layers are currently created here https://leafletjs.com/examples/quick-start/. The Mapbox styles that are available to all accounts with a valid access token here https://docs.mapbox.com/api/maps/#mapbox-styles. 

* Look at the latest [D3](https://d3js.org/) for any changes. Currently, [d3.json()](https://github.com/d3/d3-fetch/blob/v1.1.2/README.md#json) function now returns a promise. Rather than using a function within the second parameter, use [.then()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then) instead.
