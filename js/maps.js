// Google Maps functionality
// This uses leaflet.js with  Google Maps tile plugin

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

function codeAddress(name, slug, address) {
  
  geocoder.geocode( { 'address': address }, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
    	var location = new L.latLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
    	locations.push(location);
    	//var marker = L.marker(location, {title:name}).addTo(map).bindPopup("<a href=/#charity/"+slug+"><b>"+name+"</b><br>"+address+"</a>");
    	var marker = L.marker(location, {title:name}).addTo(map).bindPopup("<b>"+name+"</b><br>"+address);
  	  oms.addMarker(marker);
    	var bounds = new L.LatLngBounds(locations);
			map.fitBounds(bounds);
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
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
			mapAddress = charities[i].address + ', ';
			mapAddress += charities[i].city + ', ';
			mapAddress += charities[i].state;
			if (typeof charities[i].latitude == null) { 
				var location = new L.latLng(charities[i].latitude, charities[i].longitude);
	    	locations.push(location);
	    	//var marker = L.marker(location, {title:name}).addTo(map).bindPopup("<a href=/#charity/"+charities[i].slug+"><b>"+charities[i].name+"</b><br>"+charities[i].address+"</a>");
	    	var marker = L.marker(location, {title:name}).addTo(map).bindPopup("<b>"+charities[i].name+"</b><br>"+charities[i].address);
	  	  oms.addMarker(marker);
	    	var bounds = new L.LatLngBounds(locations);
				map.fitBounds(bounds);
			}
			else  {
				codeAddress(charities[i].name, charities[i].slug, mapAddress);
			}
		}
		if (charities.length==1)
			map.setZoom(9);
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
