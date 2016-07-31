var safeZones = [];
//Open a map container and centre in Napier at zoom 14
var map = L.map('map').setView([-39.504871, 176.903568], 14);

map.setMaxBounds([
    [-40.455503, 176.550088],
    [-38.938249, 178.088174]
]);




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
	
//Safe Zone layer listner function
function onEachFeature(feature, layer) {
	layer.on({
		
		click: layer.bindPopup('<b>' + feature.properties.LocationType + '</b><br>' + feature.properties.Location +'</b><br>' + feature.properties.Information, {closeButton: false})
		});
	}
	
//Innundation layer listner function
function infoFeature(feature, layer) {
	layer.on({
		
		click: layer.bindPopup('<b>Warning</b><br>Risk of Tsunami innundation.<br>Move to higher ground.', {closeButton: false})
		});
	}

//style functions
function innundationStyle(feature) {
	return {
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
	//Innundation zones
innundationZones = L.esri.featureLayer({

	url: innundationUrl,
	style: innundationStyle,
	onEachFeature: infoFeature

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

//Bring in the Open Street Map basemap
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//Add Napier safe zones from a json file

function addSafeZones(data){
 	L.geoJson(data, {
	pointToLayer: function (feature, latlng) {return L.circleMarker(latlng, safeStyle(feature));},
	onEachFeature: onEachFeature
	}).bringToFront()
	.addTo(map);
}

//Add button to call help page
var infoIcon = L.Control.extend({
			options: {position: 'topright'},
			onAdd: function(map) {
				var helpContainer = L.DomUtil.create('div', 'infoIcon');
				helpContainer.innerHTML = '<a href="helpPage.html" target="_blank"><i>?</i></a>';
				helpContainer.title = "Show Help";
				return helpContainer;
				},
			});
		map.addControl(new infoIcon());



