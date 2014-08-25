// Dashboard UI
// Bill Mei, 2014

// Signal Hook
var DashboardUI = {
	start : new signals.Signal() 
};

// Add Listener
DashboardUI.start.add(onStart);

// (Re)Start Dashboard UI
function onStart() {
	fetchDonorData();
}

function fetchDonorData() {
	$.ajax({
		url: server_url + '/api/donors/donations.json',
		type: 'GET',
		contentType: 'application/json',
		dataType: 'json'
	})
	.done(function(data) {
		donationHistory(data);
	})
	.fail(function(data) {
		log(data);
		growlError('An error occured while loading the dashboard.');
	});

	$.ajax({
		url: server_url + '/api/donors/subscriptions.json',
		type: 'GET',
		contentType: 'application/json',
		dataType: 'json'
	})
	.done(function(data) {
		endowmentsPie(data, $('#currentEndowments'), 'My Active Donations', function(ed, subs){
			for (var i = 0; i < subs.length; i++) {
				ed[i] = {};
				ed[i].id = subs[i].endowment_id;
				ed[i].name = subs[i].name;
				ed[i].y = subs[i].my_balances.my_endowment_balance;
			}
		});
	})
	.fail(function(data) {
		log(data);
		growlError('An error occured while loading the dashboard.');
	});

	$.ajax({
		url: server_url + '/api/endowment/my_endowments.json',
		type: 'GET',
		contentType: 'application/json',
		dataType: 'json',
		beforeSend: function(xhr, settings) {
			xhr.setRequestHeader("Authorization", "Token token=" + $.cookie('session'));
		}
	})
	.done(function(data) {
		endowmentsPie(data, $('#pastEndowments'), 'All My Donations', function(ed, subs) {
			var subs2 = subs.endowments;
			for (var i = 0; i < subs2.length; i++) {
				ed[i] = {};
				ed[i].id = subs2[i].id;
				ed[i].name = subs2[i].name;
				ed[i].y = subs2[i].my_balances.my_endowment_balance;
			}
		});
	})
	.fail(function(data) {
		log(data);
		growlError('An error occured while loading the dashboard.');
	});
}

function donationHistory(data) {
	var donationData = [];
	var runningTotal = 0;
	for (var i = 0; i < data.donations.length; i++) {
		runningTotal += parseFloat(data.donations[i].net_amount);
		donationData[i] = {};
		donationData[i].x = new Date(data.donations[i].created_at * 1000);
		donationData[i].y = runningTotal;
	}

	$('#donationHistory').highcharts({
		chart: {
			type: 'line',
			backgroundColor: '#fbfbfb'
		},
		title: { text: 'Cumulative Donation History' },
		xAxis: {
			type: 'datetime',
			title: {
				text: 'Date'
			}
		},
		yAxis: {
			title: {
				text: '($ USD)'
			}
		},
		series: [{
			name: '$',
			data: donationData
		}],
		legend: {
			enabled: false
		},
		tooltip: {
			formatter: function() {
				var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
				var month = months[this.point.x.getMonth() - 1];
				return month + ' ' + this.point.x.getDate() + ', ' + this.point.x.getFullYear() + '<br/>$' + this.point.y.toFixed(2);
			}
		},
		credits: { enabled: false }
	});
}

// @param subs is an array of endowment objects
function endowmentsPie(subs, DOMnode, subs_text, extractData) {
	var endowmentData = [];

	extractData(endowmentData, subs);

	DOMnode.highcharts({
		chart: {
			type: 'pie',
			backgroundColor: '#fbfbfb',
		},
		title: { text: subs_text },
		series: [{
			name: '$',
			data: endowmentData,
		}],
		plotOptions: {
			pie: {
				dataLabels: {
					enabled: false
				},
				showInLegend: true,
				events: {
					click: function(e) {
						crossroads.parse("/endowment/" + e.point.id);
						// TODO: Making the URL update correctly via crossroads
						// TODO: Make the back button work as it should
						history.pushState(null, null, "/endowment/" + e.point.id);
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

Highcharts.setOptions({
	colors: [
		"#2DC940",
		"#2697A1",
		"#FF9639",
		"#FF4339",
		"#009913",
		"#016E78",
		"#C55D00",
		"#C50A00",
		"#97F9A3",
		"#95ECF4",
		"#FFCA9A",
		"#FF9F9A",
		"#00780F",
		"#01565E",
		"#9B4900",
		"#9B0800"
	]
});

