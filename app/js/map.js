//Open a map container and centre in the Hawke's Bay at zoom 14
var map = L.map('map').setView([-39.504871, 176.903568], 14);
		
		var innundationUrl = 'https://hbrcwebmap.hbrc.govt.nz/arcgis/rest/services/Hazards/HawkesBay_Tsunami_NearSource_InundationExtent/MapServer/0';//url of feature service
		var safeZonesUrl = "https://hbrcwebmap.hbrc.govt.nz/arcgis/rest/services/Hazards/HawkesBay_TsunamiEvacuation__SafeLocations/MapServer/0"
		
		var credits = '<a href="https://hbrcwebmap.hbrc.govt.nz/arcgis/rest/services/Hazards">Data from HBRC</a>'
	
		
		//var hbconsents; 
		var innundationZones;
		var safeZones;
		
		
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
		color: '#FF0000',
		weight:1,
		opacity: 0.8,
		fillColor: '#FF0000',	
		fillOpacity: 0.3
	};
}
	
function getColor(type) {
	return type == "Safe Location" ? '#00FF11' :
			type == "Do Not Cross Stream"  ? '#FF0000' :
						'#FFA500';}
	
function safeStyle(feature) {
	return {
		radius: 10,//can use circleSize(map), but needs to be refreshed on zoom
		stroke: true,
		color: '#E6E6FA',
		weight:1,
		opacity: 0.8,
		fillColor: getColor(feature.properties.LocationType),	
		fillOpacity: 0.8
	};
}
		
	//create the feature layer after the event handlers so that the reset styles function works 
	
innundationZones = L.esri.featureLayer({

	url: innundationUrl,
	//url: 'https://hbrcwebmap.hbrc.govt.nz/arcgis/rest/services/Hazards/HawkesBay_Tsunami_NearSource_InundationExtent/MapServer/0'
	style: innundationStyle

}).addTo(map);  
			
safeZones = L.esri.featureLayer({

	url: safeZonesUrl,
	//url: 'https://hbrcwebmap.hbrc.govt.nz/arcgis/rest/services/Hazards/HawkesBay_Tsunami_NearSource_InundationExtent/MapServer/0'
	
	pointToLayer: function (geojson, latlng) {return L.circleMarker(latlng, 
		{}
		);},
	//where: "LocationType = 'Safe Location'",
	style: safeStyle,
	onEachFeature: onEachFeature
	
	//function(feature, layer) {
		//if (feature.properties && feature.properties.LocationType) {
		//	layer.bindPopup(feature.properties.LocationType, {closeButton: false});
		//}
	//}
	}).addTo(map);  		

//var hbconsents; 
var innundationZones;

//Add attribution for the feature layer
map.attributionControl.addAttribution(credits);

		
//style function
function innundationStyle(feature) {
	return {
		//radius: 10,//can use circleSize(map), but needs to be refreshed on zoom
		stroke: true,
		color: '#FF0000',
		weight:1,
		opacity: 0.8,
		fillColor: '#FF0000',	
		fillOpacity: 0.3
	};
}

	
//create the feature layer after the event handlers so that the reset styles function works 
innundationZones = L.esri.featureLayer({
	url: innundationUrl,
	//url: 'https://hbrcwebmap.hbrc.govt.nz/arcgis/rest/services/Hazards/HawkesBay_Tsunami_NearSource_InundationExtent/MapServer/0'
	style: innundationStyle,
}).addTo(map);  
		
		
//Location control and handler
lc = L.control.locate({
	follow: true,
	icon: 'fa fa-map-marker',
	keepCurrentZoomLevel: false,
	strings: {
		title: "Show me where I am"
	},
	locateOptions: {}
}).addTo(map);
		
	

	//Stop following if the user drags the map
	map.on('startfollowing', function() {
		map.on('dragstart', lc._stopFollowing, lc);
	}).on('stopfollowing', function() {
		map.off('dragstart', lc._stopFollowing, lc);
	});
	
	function infoFeature(e) {
		//console.log(e.target.feature);
		//hbconsents.resetStyle()//{fillColor: '#feb24c'});//reset all features to default colour
		//hbconsents.setFeatureStyle(e.target.feature.id, {fillColor: '#ff0000'});//highlight selected feature
		featureQuery(e.target._latlng);
		}


L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


L.Routing.control({
    waypoints: [
    L.latLng(-39.504871, 176.903568),
    L.latLng(-39.6365764,176.7493582)
  ],
  router: L.Routing.graphHopper('2f1f160d-40d5-4c50-9625-40c20317d3b4'),
  lineOptions: {
      styles: [{color: '#2980b9', opacity: 1, weight: 5}]
   },
}).addTo(map);

var map = L.map('map');
