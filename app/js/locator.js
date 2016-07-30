var userLocation = {
	latitude: '',
	longitude: '',
};

var safeZoneData = [];

loadJSON(function(response) {
  // Parse JSON string into object
    safeZoneData = JSON.parse(response);

    console.log(safeZoneData);
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

	findQuickestRoute();

	createNewRoute(e.latitude, e.longitude);
}

function onLocationError(e){
	window.alert("Oops. Looks like you do not have your Location Services on!");
}

function findQuicketRoute(){}

// Creates a new Route 
function createNewRoute(lat, long){
	L.Routing.control({
	    waypoints: [
	    L.latLng(lat, long),
	    L.latLng(-39.4928232,176.911848)
	  ],
	  router: L.Routing.graphHopper('2f1f160d-40d5-4c50-9625-40c20317d3b4'),
	  lineOptions: {
	      styles: [{color: '#2980b9', opacity: 1, weight: 5}]
	   },
	   showAlternatives: true,
	}).addTo(map);
}

console.log(safeZones);

map.on("locationerror", onLocationError);
map.on("locationfound", onLocationFound);