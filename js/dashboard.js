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
	dashboardSelectors();
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
		balanceGraph(data, $('#balanceHistory'), 'My Balance History',
			function(balance, data) {
				var history = data.donor_balance_history;
				for (var i = 0; i < history.length; i++) {
					balance[i] = {};
					balance[i].x = new Date(history[i].date);
					balance[i].y = history[i].balance;
				}
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
		endowmentsPie(data, $('#currentEndowments'), 'Endowments', function(ed, subs){
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
						hasher.setHash("endowment/" + e.point.id);
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

function dashboardSelectors() {
	$('.find-endowment-btn').on('click', function() {
		crossroads.parse("/");
		hasher.setHash("");
	});
}
