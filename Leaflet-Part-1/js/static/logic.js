// Create the Earthquake Visualization
// Get the url for all earthquakes in past 7 days
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
// Create our map, giving it the streetmap and earthquakes layers to display on load.
let myMap = L.map("map", {
                    center: [37.09, -95.71],
                    zoom: 5,
                    // layers: [street, earthquakes]
                  });
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

                   
// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
                    // Once we get a response, send the data.features object to the createFeatures function.
                    createFeatures(data.features);
                    console.log(data)
                    });
// Create a function createFeatures for earthquake data

function createFeatures(earthquakeData) {
                  // Define a function that we want to run once for each feature in the features array.
                    // Give each feature a popup that describes the Coordinates and time of the earthquake.
                    function onEachFeature(feature, layer) {
                      layer.bindPopup(`<h3>Location:</h3> ${feature.properties.place}<h3> Magnitude:</h3> ${feature.properties.mag}<h3> Depth:</h3> ${feature.geometry.coordinates[2]}`);
                    }
                     
                  
                     // Create a GeoJSON layer that contains the features array on the earthquakeData object.
                    // Run the onEachFeature function once for each piece of data in the array.
                   let earthquakes = L.geoJSON(earthquakeData, {
                    onEachFeature: onEachFeature,
                    pointToLayer: function (feature, latlng) {    // Use pointToLayer to create custom circle markers for each earthquake
                          let radius = feature.properties.mag; // Apply your logic here
                          let fillColor = getColor(feature.geometry.coordinates[2]);
                    return L.circleMarker(latlng, {
                              radius: radius* 3,  //apply your logic here
                              fillColor: fillColor,
                              color: "	#0000ff",
                              weight: 0.5,
                              opacity: 1,
                              fillOpacity: 0.75,
                          });
                      },
                  }).addTo(myMap);
                  
                    
// Create a Legend
let legend = L.control({ position: "bottomright" });

legend.onAdd = function(myMap) {
  let div = L.DomUtil.create("div", "info legend"),
      depth = [10, 30, 50, 70, 90],
      labels = ['<strong>Depth</strong>'];
      

  for (let i = 0; i < depth.length; i++) {
    div.innerHTML +=
      labels.push(
        '<i style="background:' + getColor(depth[i] + 1) + '"></i> ' +
        depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+')
      );
  }

  div.innerHTML =  labels.join('<br>');
  return div;
};

// Adding the legend to the map
legend.addTo(myMap);

function getColor(depth) {
  return depth > 90 ? '#d73027' :
         depth > 70 ? '#fc8d59' :
         depth > 50 ? '#fee08b' :
         depth > 30 ? '#d9ef8b' :
         depth > 10 ? '#91cf60' :
         '#1a9850'};
}
