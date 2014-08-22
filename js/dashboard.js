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
		displayBar(data);
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
		displayPie(data);
	})
	.fail(function(data) {
		log(data);
		growlError('An error occured while loading the dashboard.');
	});
}

function displayBar(data) {
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
function displayPie(subs) {
	var endowmentData = [];

	for (var i = 0; i < subs.length; i++) {
		endowmentData[i] = {};
		endowmentData[i].name = subs[i].name;
		endowmentData[i].y = subs[i].my_balances.my_endowment_balance;
	}

	$('#endowmentPie').highcharts({
		chart: {
			type: 'pie',
			backgroundColor: '#fbfbfb'
		},
		title: { text: 'Endowment Mix' },
		series: [{
			name: '$',
			data: endowmentData
		}],
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
