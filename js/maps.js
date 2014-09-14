// Google Maps functionality

// Signal Hook
var MapsUI = {
	start : new signals.Signal() 
};

// Listeners
MapsUI.start.add(onStart);

// Initialize
function onStart(charities) {
	if (charities.length > 0) {
		var mapURL = GLOBAL.GMAPS_API_URL + '?size=500x400';
		for (var i = 0; i < charities.length; i++) {
			mapURL += '&markers=';
			mapURL += charities[i].charity.address + ', ';
			mapURL += charities[i].charity.city + ', ';
			mapURL += charities[i].charity.state;
		}
		if (charities.length === 1) {
			mapURL += '&zoom=' + GLOBAL.GMAPS_DEFAULT_ZOOM;
		}
		mapURL += '&key=' + GLOBAL.GMAPS_API_KEY;
		mapURL = encodeURI(mapURL);

		$('#impact-link').html('<img src="' + mapURL + '" alt="" id="impact-map" />');

	} else {
		$('#impact-link').html(
			'<p>You haven\'t subscribed to any endowments yet.</p>' +
			'<p><a href="/" class="btn btn-primary find-endowment-btn">Find an Endowment</a></p>');
	}

	
	// Check if user allows geo-location
	// if (navigator.geolocation) {
	// 	navigator.geolocation.getCurrentPosition(function(position) {
	// 		makeMap(position.coords.latitude, position.coords.longitude, 'Your GPS Location');
	// 	});
	// }
}
