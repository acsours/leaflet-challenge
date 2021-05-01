var plates_url="https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

console.log('first test')


// function createPlates(plateData) {
//     // define a function we want to run once for each feature in the features array
//     // pull the coordinates from each features
// }
//create map
var myMap=L.map('map', {
    center: [15.5994, -28.6731],
    zoom: 3
});
//create a tile layer

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
}).addTo(myMap)



// // Set colors based on depth of earthquake
function getColor(depth){
    var color = ''
    if (depth<10) {
        color = '#96ed89'
    }else if (depth<30){
        color = '#b2d100'
    }else if (depth<50){
        color = '#d2ad00'
    }else if (depth<70){
        color = '#e49200'
    }else if (depth<90){
        color = '#f86000'
    }else {
        color = '#ff2d00'
    }
    return color
};

// Create legend

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [-10, 10, 30, 50, 70, 90],
        labels = ['-10-10', '10-30', '30-50', '50-70', '70-90', '+90'];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);



//add urls
var earthquake_url='https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

var plates_url="https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

//load geojson
d3.json(earthquake_url).then(function(data){
    // L.geoJSON(data).addTo(myMap)
  var earthquakeMarkers=[]
    // within the array of features, create a marker based on coordinates, depth, and magnitude
    data['features'].forEach(function(earthquake){
        var coordinates = earthquake['geometry']['coordinates']
        var depth = coordinates[2]
        var mag = earthquake['properties']['mag']
        
        earthquakeMarkers.push(L.circle([coordinates[1], coordinates[0]], {
                                fillOpacity:0.75,
                                color:"white",
                                weight: 1,
                                fillColor: getColor(depth),
                                radius: mag*20000                           
                            }).bindPopup("<h4>Location: " + earthquake['properties']['place']+"</h4><h4> Magnitude: "+mag+"</h4><h4> Depth: "+depth+"</h4>"))//.addTo(myMap)
    });

    d3.json(plates_url).then(function(data){
        // console.log('test')
        // console.log(data.features);
        var plates = L.geoJson(data, {
            'style': {
                'color':'orange',
                'weight': 1.0
            }
        })
    





    // Create base layers
    // we want three layers:
    // Satellite
    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/satellite-v9",
        accessToken: API_KEY
        })
    // greyscale
    var greyscale = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/light-v10",
        accessToken: API_KEY
        })

    // Outdoors
    var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/outdoors-v11",
        accessToken: API_KEY
        })

    // plus two layer groups 
    // earthquakes
    var earthquakeLayer=L.layerGroup(earthquakeMarkers)

    // tectonic plates
    // L.geoJSON(geojsonFeature).addTo(map);



    // // // Create two separate layer groups below. One for city markers, and one for states markers
    // // var cityLayer = L.layerGroup(cityMarkers);

    // // var stateLayer = L.layerGroup(stateMarkers);

    // Create a baseMaps object to contain the streetmap and darkmap
    var baseMaps = {
        'Satellite map': satellite,
        'Greyscale Map': greyscale,
        'Outdoors Map': outdoors
    };
    // // // Create an overlayMaps object here to contain the "tectonic plates" and "earthquake" layers
    var overlayMaps = {
        'Earthquakes': earthquakeLayer,
        'Tectonic Plates': plates
        // 'State Population': stateLayer
    }


    // Create a layer control, containing our baseMaps and overlayMaps, and add them to the map
    L.control.layers(baseMaps,overlayMaps).addTo(myMap);
    }); 
});