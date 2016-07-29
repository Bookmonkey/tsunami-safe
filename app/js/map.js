	//Open a map container and centre in the Hawke's Bay at zoom 14
		var map = L.map('map').setView([-39.504871, 176.903568], 14);

	//Bring in the basemap

	
	//Esri basemap and transportation overlay
		L.esri.basemapLayer('Imagery').addTo(map);
		L.esri.basemapLayer('ImageryTransportation').addTo(map);

		//var currentQuery = "Status IN ('Current','S124 Expired/Exercised') and Type='Water Permit'";//SQL statement to limit results
		var featureUrl = 'https://hbrcwebmap.hbrc.govt.nz/arcgis/rest/services/Hazards/HawkesBay_Tsunami_EvacuationZones/MapServer/0/';//url of feature service
		var credits = '<a href="https://hbrcwebmap.hbrc.govt.nz/arcgis/rest/services/Hazards/HawkesBay_Tsunami_EvacuationZones/MapServer">Data from HBRC</a>'
	//Overlay with an ESRI feature layer showing water take consents, radius 10 for mobile screens so easier to hit with big fingers.
		//layer variable defined here, but populated with the esri layer after the listners so that the 
		//styling functions and reset style works (see Leaflet tutorials for info).
		
		//var hbconsents; 
		var evacZones;
		
		
		//Add attribution for the feature layer
		map.attributionControl.addAttribution(credits);

	
		
		//create a loading icon ready to display when content is loading
		var loading = L.control();
		
		loading.onAdd = function (map) {
			this._div = L.DomUtil.create('div', 'loadicon');
			this._div.innerHTML = '<i class="fa fa-spinner fa-2x fa-spin"></i>';
			return this._div;
			};
		
		//Create the help panel and add to the map
		//var help = L.control.sidebar('help', {
		//  position: 'left'
		//  });
			
		//map.addControl(help);
		
		
		
		// create an empty layer group to store the results and add it to the map
		//var results = L.layerGroup().addTo(map);
		//var searchMark = L.featureGroup().addTo(map);

		
			
	//Feature layer listner function
	//function onEachFeature(feature, layer) {
	//  layer.on({
			//mouseover: highlightFeature,
			//mouseout: resetHighlight,
	//    click: infoFeature
	//    });
	//  }
	
	
		
	//create the feature layer after the event handlers so that the reset styles function works 
	
	evacZones = L.esri.featureLayer({
	//evacZones = L.esri.TiledMapLayer({  
			
			//url: featureUrl//,
			url: 'https://hbrcwebmap.hbrc.govt.nz/arcgis/rest/services/Hazards/HawkesBay_Tsunami_NearSource_InundationExtent/MapServer/0'
			
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