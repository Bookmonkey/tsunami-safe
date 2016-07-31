var userInformation = {
	totalDistance: '',
	totalTime: '',
	instructions: '',
};
var userLocation = {
	latitude: '',
	longitude: '',
};

var safeZoneData = [];
var allZoneData = [];

map.locate({setView: true, maxZoom: 16});

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


//gets current location and creates new route
function newRouteFromLocation()
{	//updates location
	//map.locate({setView: true, maxZoom: 16});
	//new route
	var route = findQuickestRoute(location);
	createNewRoute(location, route);
	}


function onLocationFound(e){
	var location = {
		lat: e.latitude,
		long: e.longitude
	};
	//uncomment if findAndCreateRoute doesn't work
	//var route = findQuickestRoute(location);
//	createNewRoute(location, route);
}


function routeFound(e){
	console.log(e);
}

function onLocationError(e){
	window.alert("Oops. Looks like you do not have your Location Services on!");
}

// Assigns the time and distance to html element called panel
// The HTML element panel by default is hidden, so we need to show it. By adding a CSS class
function displayUserInformationToDom(){
	var panelTime = document.getElementById('panel-time-element').innerText = userInformation.totalTime;
	var panelDistance = document.getElementById('panel-distance-element').innerText = userInformation.totalDistance;


	document.getElementById('panel').className = "shown";
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
	var control = L.Routing.control({
	    waypoints: [
	    L.latLng(location.lat, location.long),
	    L.latLng(route.lat, route.long)
	  ],
	  router: L.Routing.graphHopper('2f1f160d-40d5-4c50-9625-40c20317d3b4'),
	  
	  lineOptions: {
	      styles: [{color: '#2980b9', opacity: 1, weight: 5}]
	  }
	})
	.on('routesfound', function(e) {
	   	var formatter = new L.Routing.Formatter();

    	userInformation.totalTime = formatter.formatTime(e.routes[0].summary.totalTime);
    	userInformation.totalDistance = formatter.formatDistance(e.routes[0].summary.totalDistance);
    	userInformation.instructions = e.routes[0].instructions;
    	
    	displayUserInformationToDom();
	}).addTo(map);
}

var routingIcon = L.Control.extend({
			options: {position: 'topleft'},
			onAdd: function(map) {
				var container = L.DomUtil.create('div', 'routingIcon');
				container.innerHTML = '<i class="fa fa-car"></i>';
				container.title = "Show Route";
				//container.onclick = newRouteFromLocation();
				return container;
				},
			});
		map.addControl(new routingIcon());

map.on("load", lc.start());

map.on("locationerror", onLocationError);
map.on("locationfound", onLocationFound);
