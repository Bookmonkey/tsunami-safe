var userLocation = {
	latitude: '',
	longitude: '',
};

var safeZoneData = [];
var allZoneData = [];

loadJSON(function(response) {
  // Parse JSON string into object
    safeZoneData = JSON.parse(response);
    //filter the data so only direct to Safe Locations
	//safeZoneData = allZoneData.filter(function(i) {
    //  return i.properties.LocationType === "Hazard";
    //  });
    //console.log(allZoneData);
    //console.log(safeZoneData);
 });

//Location control and handler
lc = L.control.locate({
	follow: true,
	icon: 'fa fa-map-marker',
	keepCurrentZoomLevel: false,
	strings: {
		title: "Show me where I am"
	},
	locateOptions: {}
})
.addTo(map);

lc.start();


function onLocationFound(e){
	var location = {
		lat: e.latitude,
		long: e.longitude
	};
	var route = findQuickestRoute(location);


	createNewRoute(location, route);
}

function onLocationError(e){
	window.alert("Oops. Looks like you do not have your Location Services on!");
}

// Gets a value of 
function pythagoras(location){
	var array = [];
	for(var i = 0; i < safeZoneData.length; i++){
		var coords = safeZoneData[i].geometry.coordinates;
		var a = location.lat - coords[1];
		var b = location.long - coords[0];
		var c = Math.sqrt( a*a + b*b );

		array.push({
			point: c,
			lat: coords[1],
			long: coords[0]
		});
	}
	return array;
}

// Return the object with the lowest point in the points array
function findQuickestRoute(location){
	var points = pythagoras(location);

	var index = 0;
	var route = points[0].point;
	for (var i = 1; i < points.length; i++) {
		if (points[i].point < route) {
			route = points[i];
			index = i;
		}
	}
	return route;
}
// Creates a new Route 
function createNewRoute(location, route){
	L.Routing.control({
	    waypoints: [
	    L.latLng(location.lat, location.long),
	    L.latLng(route.lat, route.long)
	  ],
	  router: L.Routing.graphHopper('2f1f160d-40d5-4c50-9625-40c20317d3b4'),
	  lineOptions: {
	      styles: [{color: '#2980b9', opacity: 1, weight: 5}]
	   },
	   showAlternatives: true,
	}).addTo(map);
}

map.on("locationerror", onLocationError);
map.on("locationfound", onLocationFound);
