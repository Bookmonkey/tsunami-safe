var safeZones = [];
//Open a map container and centre in Napier at zoom 14
var map = L.map('map').setView([-39.504871, 176.903568], 14);

loadJSON(function(response) {
  // Parse JSON string of safeZones and hazards into object
    safeZones = JSON.parse(response);

    addSafeZones(safeZones);
 });

// Bring in the layers from Hawke's Bay Regional Council.
		
var innundationUrl = 'https://hbrcwebmap.hbrc.govt.nz/arcgis/rest/services/Hazards/HawkesBay_Tsunami_NearSource_InundationExtent/MapServer/0';//url of feature service
var safeZonesUrl = "https://hbrcwebmap.hbrc.govt.nz/arcgis/rest/services/Hazards/HawkesBay_TsunamiEvacuation__SafeLocations/MapServer/0"

var credits = '<a href="https://hbrcwebmap.hbrc.govt.nz/arcgis/rest/services/Hazards">Data from HBRC</a>'


var innundationZones;


//Add attribution for the feature layer
map.attributionControl.addAttribution(credits);



//create a loading icon ready to display when content is loading
var loading = L.control();

loading.onAdd = function (map) {
	this._div = L.DomUtil.create('div', 'loadicon');
	this._div.innerHTML = '<i class="fa fa-spinner fa-2x fa-spin"></i>';
	return this._div;
};
	
//Feature layer listner function
function onEachFeature(feature, layer) {
	layer.on({
		mouseover: layer.bindPopup(feature.properties.LocationType, {closeButton: false}),
		//mouseout: resetHighlight,
		click: layer.bindPopup(feature.properties.LocationType, {closeButton: false})
		});
	}

//style functions
function innundationStyle(feature) {
	return {
		//radius: 10,//can use circleSize(map), but needs to be refreshed on zoom
		stroke: true,
		color: '#d7191c',
		weight:1,
		opacity: 0.8,
		fillColor: '#d7191c',	
		fillOpacity: 0.3
	};
}
	
function getColor(type) {
	return type == "Safe Location" ? '#4dac26' :
			type == "Do Not Cross Stream"  ? '#d7191c' :
			type == "Hazard" ? '#d7191c' :
						'#fdae61';}
	
function safeStyle(feature) {
	return {
		radius: 10,//can use circleSize(map), but needs to be refreshed on zoom
		stroke: true,
		color: '#f7f7f7',
		weight:1,
		opacity: 0.8,
		fillColor: getColor(feature.properties.LocationType),	
		fillOpacity: 0.8
	};
}
		
	//create the feature layers  
	
innundationZones = L.esri.featureLayer({

	url: innundationUrl,
	style: innundationStyle

}).addTo(map);  

// HBRC safe Zones are currently only for Mahanga			
safeZonesMahanga = L.esri.featureLayer({

	url: safeZonesUrl,	
	pointToLayer: function (geojson, latlng) {return L.circleMarker(latlng, 
		{}
		);},
	style: safeStyle,
	onEachFeature: onEachFeature
	
	}).addTo(map); 



//Add attribution for the feature layer
//map.attributionControl.addAttribution(credits);

		
	

//Stop following if the user drags the map
map.on('startfollowing', function() {
	map.on('dragstart', lc._stopFollowing, lc);
}).on('stopfollowing', function() {
	map.off('dragstart', lc._stopFollowing, lc);
});
	

//Bring in the Open Street Map basemap
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);



function addSafeZones(data){
 	L.geoJson(data, {
	pointToLayer: function (feature, latlng) {return L.circleMarker(latlng, safeStyle(feature));},
	onEachFeature: onEachFeature
	}).bringToFront()
	.addTo(map);
}
