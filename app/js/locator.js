var userLocation = {
	latitude: '',
	longitude: '',
}

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


function onLocationFound(e){
	createNewRoute(e.latitude, e.longitude);
}

// Creates a new Route 
function createNewRoute(lat, long){
	L.Routing.control({
	    waypoints: [
	    L.latLng(lat, long),
	    L.latLng(-39.4789755,176.7282936)
	  ],
	  router: L.Routing.graphHopper('2f1f160d-40d5-4c50-9625-40c20317d3b4'),
	  lineOptions: {
	      styles: [{color: '#2980b9', opacity: 1, weight: 5}]
	   },
	   showAlternatives: true,
	}).addTo(map);
}

map.on("locationfound", onLocationFound);