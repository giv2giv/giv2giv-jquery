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
			'donor_balance_history', 'balance');
		balanceGraph(data, $('#balanceFuture'), 'My Projected Balance',
			'donor_projected_balance', 'balance');
		balanceGraph(data, $('#grantsFuture'), 'My Projected Grants',
			'donor_projected_balance', 'total_grants');

		var totalBalance = data.donor_current_balance;

		// Second ajax call
		$.ajax({
			url: server_url + '/api/donors/subscriptions.json',
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
}
