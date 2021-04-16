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
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap)

//add url
earthquake_url='https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'
//load geojson
d3.json(earthquake_url).then(function(data){
    // L.geoJSON(data).addTo(myMap)

// we want to craft some input to return an array of an array for heat layers
    var heatArray = []
    data['features'].forEach(function(earthquake){
        var coordinates = earthquake['geometry']['coordinates']
        heatArray.push([coordinates[1], coordinates[0], coordinates[2]])
    })
    // console.log(heatArray)
    L.heatLayer(heatArray).addTo(myMap)
    // ******* does 1 **********
    // // console.log(data['features'][0]['geometry']['coordinates'])
    // var one_earthquake = data['features'][0]
    // // console.log(one_earthquake)
    // var coordinates = one_earthquake['geometry']['coordinates']
    // console.log(coordinates)
    // // put a marker on the map at the lat long of this earthquake
    // L.circle([coordinates[1],coordinates[0]], {
    //     fillOpacity: 0.75,
    //     color: "blue", 
    //     fillColor: 'red',
    //     radius: 100000
    //   }).bindPopup("<h3>" + one_earthquake['properties']['place']+"</h3>").addTo(myMap)
    // *************************
});