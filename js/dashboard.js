// Dashboard UI

// Signal Hook
var DashboardUI = {
	start : new signals.Signal() 
};

// Add Listener
DashboardUI.start.add(onStart);

// (Re)Start Dashboard UI
function onStart() {
	fetchDonorData();
	$('.create-endowment-btn').on('click', function(e) {
		e.preventDefault();
		hasher.setHash('/');
		EndowmentsUI.newModal.dispatch();
	});
	// Load Google maps JavaScript - done in app.html.
	initialize();
}

function initialize() {
// Check if user allows geo-location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      makeMap(position.coords.latitude, position.coords.longitude, 'Your GPS Location');
    });
  }
}

function makeMap(lat,lng,text) {
	var point = new google.maps.LatLng(lat, lng);
  var map_canvas = document.getElementById('map_canvas');

  var mapOptions = {
    center: point,
    zoom: 4,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  window.map = new google.maps.Map(map_canvas, mapOptions);
  window.geocoder = new google.maps.Geocoder(); 
}


function fetchDonorData() {
	// First ajax call
	$.ajax({
		url: GLOBAL.SERVER_URL + '/api/donors/balance_information.json',
		type: 'GET',
		contentType: 'application/json',
		dataType: 'json'
	})
	.done(function(data) {
		balanceGraph(data, $('#balanceFuture'), 'My Projected Impact',
			'donor_projected_balance', 'balance');
		balanceGraph(data, $('#balanceHistory'), 'My Balance History',
			'donor_balance_history', 'balance');

		var totalBalance = data.donor_current_balance;

		// Second ajax call
		$.ajax({
			url: GLOBAL.SERVER_URL + '/api/donors/subscriptions.json',
			type: 'GET',
			contentType: 'application/json',
			dataType: 'json'
		})
		.done(function(data) {
			endowmentsPie(data, $('#currentEndowments'), 'Endowments',
				function(ed, subs){
				for (var i = 0; i < subs.length; i++) {
					ed[i] = {};
					ed[i].id = subs[i].endowment_id;
					ed[i].name = subs[i].name;
					ed[i].y = subs[i].my_balances.my_endowment_balance;
				}
			}, totalBalance);

			// add charity data to google map
			
			window.latlngbounds = new google.maps.LatLngBounds();
			$.each(data, function(k, v) {
				$.each(v.charities, function (array_id, charityArray) {
					$.each(charityArray, function (charityKey, charity) {
						geocoder.geocode({'address': charity.address + " " + charity.city + " " + charity.state}, function (res1, status) {
      				if (status == google.maps.GeocoderStatus.OK) {
      					latlngbounds.extend(res1[0].geometry.location);
								// Set bounds of map to hold markers
								map.setCenter(latlngbounds.getCenter());
								map.fitBounds(latlngbounds);
		            new google.maps.Marker({
		              position: res1[0].geometry.location,
		              map: map,
		              title: charity.name
		            });
							}
						});
					});
				});
			});
		})
		.fail(function(data) {
			log(data);
			growlError('An error occured while loading the dashboard.');
		});

	}).fail(function(data) {
		log(data);
		growlError('An error occured while loading the dashboard.');
	});
}

// @param subs is an array of endowment objects
function endowmentsPie(subs, DOMnode, titleText, extractData, totalBalance) {
	var endowmentData = [];
	if (subs.length === 0) {
		DOMnode.html(
			'<h3>' + titleText + '</h3>' +
			'<p>You haven\'t subscribed to any endowments yet.</p>' +
			'<p><a href="/" class="btn btn-primary find-endowment-btn">Find an Endowment</a></p>');
	} else {
		extractData(endowmentData, subs);

		DOMnode.highcharts({
			chart: {
				type: 'pie',
				backgroundColor: '#fbfbfb',
			},
			title: { text: titleText },
			subtitle: { text: 'Total Balance: ' + totalBalance.toFixed(2) },
			series: [{
				name: '$',
				data: endowmentData,
				cursor: 'pointer'
			}],
			plotOptions: {
				pie: {
					dataLabels: {
						enabled: false
					},
					showInLegend: true,
					events: {
						click: function(e) {
							hasher.setHash('endowment/' + e.point.id);
						}
					}
				}
			},
			tooltip: {
				formatter: function() {
					return this.point.name + '<br/>$' + this.point.y.toFixed(2);
				}
			},
			credits: { enabled: false }
		});
	}
}
