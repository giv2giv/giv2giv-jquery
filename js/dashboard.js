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
	// First ajax call
	$.ajax({
		url: server_url + '/api/donors/balance_information.json',
		type: 'GET',
		contentType: 'application/json',
		dataType: 'json'
	})
	.done(function(data) {
		console.log(data)
		balanceGraph(data, $('#balanceHistory'), 'My Balance History',
			function(balance, data) {
				var series = {};
				series.name = '$';
				series.balance = [];
				var history = data.donor_balance_history;
				for (var i = 0; i < history.length; i++) {
					series.balance[i] = {};
					series.balance[i].x = new Date(history[i].date);
					series.balance[i].y = history[i].balance;
				}
			return [series];
		});
		balanceGraph(data, $('#balanceFuture'), 'My Projected Balance',
			function(balance, data) {
				var future = data.donor_projected_balance;
				for (var i = 0; i < future.length; i++) {
					balance[i] = {};
					balance[i].x = new Date(future[i].date);
					balance[i].y = future[i].balance;
				}
			});
		balanceGraph(data, $('#grantsFuture'), 'My Projected Grants',
			function(balance, data) {
				var future = data.donor_projected_balance;
				for (var i = 0; i < future.length; i++) {
					balance[i] = {};
					balance[i].x = new Date(future[i].date);
					balance[i].y = future[i].total_grants;
				}
			});
	})
	.fail(function(data) {
		log(data);
		growlError('An error occured while loading the dashboard.');
	});

	// Second ajax call
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

	// Third ajax call
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

function balanceGraph(data, DOMnode, titleText, seriesData) {
	DOMnode.highcharts({
		chart: {
			type: 'line',
			backgroundColor: '#fbfbfb'
		},
		title: { text: titleText },
		xAxis: {
			type: 'datetime',
			title: {
				text: 'Date'
			}
		},
		yAxis: {
			title: {
				text: '($ USD)'
			},
			min: 0
		},
		series: seriesData(data),
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
function endowmentsPie(subs, DOMnode, titleText, extractData) {
	var endowmentData = [];

	extractData(endowmentData, subs);

	DOMnode.highcharts({
		chart: {
			type: 'pie',
			backgroundColor: '#fbfbfb',
		},
		title: { text: titleText },
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
						crossroads.parse("/endowment/" + e.point.id);
						// TODO: Making the URL update correctly via crossroads
						// TODO: Make the back button work as it should
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

