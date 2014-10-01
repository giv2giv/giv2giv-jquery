// Google Maps functionality

// Signal Hook
var MapsUI = {
	start : new signals.Signal() 
};

// Nampspacing needs love all around
var map;
var oms;
var locations = [];

// Leaflet Icon Path
L.Icon.Default.imagePath = "../css/images/";

// Listeners
MapsUI.start.add(onStart);

function codeAddress(name, address) {
  geocoder.geocode( { 'address': address }, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
    	var location = new L.latLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
    	locations.push(location);
    	var marker = L.marker(location, {title:name}).addTo(map).bindPopup("<b>"+name+"</b><br>"+address);
  	  oms.addMarker(marker);  // <-- here
    	var bounds = new L.LatLngBounds(locations);
			map.fitBounds(bounds);
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
	console.log(location);
  });
}


// Initialize
function onStart(charities) {

	geocoder = new google.maps.Geocoder();

	map = new L.Map('map', {center: new L.LatLng(38.44, -78.87), zoom: 9});
	var googleLayer = new L.Google('ROADMAP');
	map.addLayer(googleLayer);
	oms = new OverlappingMarkerSpiderfier(map);


	if (charities.length > 0) {
		for (var i = 0; i < charities.length; i++) {
			mapAddress = charities[i].charity.address + ', ';
			mapAddress += charities[i].charity.city + ', ';
			mapAddress += charities[i].charity.state;
			console.log(mapAddress);
			codeAddress(charities[i].charity.name, mapAddress);
		}
	}

/*
		//$('#impact-link').html('<img src="' + mapURL + '" alt="" id="impact-map" />');

	} else {
		$('#impact-link').html(
			'<p>You haven\'t subscribed to any endowments yet.</p>' +
			'<p><a href="/" class="btn btn-primary find-endowment-btn">Find an Endowment</a></p>');
	}
*/
	
	// Check if user allows geo-location
	// if (navigator.geolocation) {
	// 	navigator.geolocation.getCurrentPosition(function(position) {
	// 		makeMap(position.coords.latitude, position.coords.longitude, 'Your GPS Location');
	// 	});
	// }
}
