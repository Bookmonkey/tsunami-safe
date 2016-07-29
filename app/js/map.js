	//Open a map container and centre in the Hawke's Bay at zoom 14
		var map = L.map('map').setView([-39.504871, 176.903568], 14);

	//Bring in the basemap

	
	//Esri basemap and transportation overlay
		L.esri.basemapLayer('Imagery').addTo(map);
		L.esri.basemapLayer('ImageryTransportation').addTo(map);

		
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
	
	
	function safeStyle(feature) {
			return {
				radius: 10,//can use circleSize(map), but needs to be refreshed on zoom
				stroke: true,
				color: '#00FF11',
				weight:1,
				opacity: 0.8,
				fillColor: '#00FF11',	
				fillOpacity: 0.8
				};
			}
		
	//create the feature layer after the event handlers so that the reset styles function works 
	
	innundationZones = L.esri.featureLayer({
	
			url: innundationUrl,
			//url: 'https://hbrcwebmap.hbrc.govt.nz/arcgis/rest/services/Hazards/HawkesBay_Tsunami_NearSource_InundationExtent/MapServer/0'
			style: innundationStyle,
			}).addTo(map);  
			
	safeZones = L.esri.featureLayer({
	
			url: safeZonesUrl,
			//url: 'https://hbrcwebmap.hbrc.govt.nz/arcgis/rest/services/Hazards/HawkesBay_Tsunami_NearSource_InundationExtent/MapServer/0'
			pointToLayer: function (geojson, latlng) {return L.circleMarker(latlng, 
				{}
				);},
			style: safeStyle,
			}).addTo(map);  		
	
		
		
	//Location control and handler
	lc = L.control.locate({
		follow: true,
		icon: 'fa fa-map-marker',
		keepCurrentZoomLevel: false,
		strings: {
			title: "Show me where I am"
			},
		locateOptions: {
			}
		}).addTo(map);
		var res = {};
		
	


	//Stop following if the user drags the map
	map.on('startfollowing', function() {
		map.on('dragstart', lc._stopFollowing, lc);
	}).on('stopfollowing', function() {
		map.off('dragstart', lc._stopFollowing, lc);
	});
