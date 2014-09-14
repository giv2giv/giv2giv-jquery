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

	// Find Endowments Button
	$('.find-endowment-btn').off('click');
	$('.find-endowment-btn').on('click', function(e) {
		// Set Hasher
		hasher.setHash('/');
		e.preventDefault();
	});
}


function fetchDonorData() {
	// First ajax call
	$.ajax({
		url: GLOBAL.SERVER_URL + '/api/donors/balance_information.json',
		type: 'GET',
		contentType: 'application/json',
		dataType: 'json'
	}).done(function(data) {
		balanceGraph(data, $('#balanceFuture'), 'My Projected Impact',
			'donor_projected_balance', 'balance');
		balanceGraph(data, $('#balanceHistory'), 'My Balance History',
			'donor_balance_history', 'balance');

		var totalBalance = data.donor_current_balance;

		// Second ajax call
		$.ajax({
			url: GLOBAL.SERVER_URL + '/api/donors/subscriptions.json', //just to launch, this is terrible
			type: 'GET',
			contentType: 'application/json',
			data: {
				group: true
			},
			dataType: 'json'
		})
		.done(function(data) {
			endowmentsPie(data, $('#currentEndowments'), 'Endowments',
				function(ed, subs){
				for (var i = 0; i < subs.length; i++) {
					ed[i] = {};
					ed[i].id = subs[i].slug;
					ed[i].name = subs[i].name;
					ed[i].y = subs[i].my_balances.my_endowment_balance;
				}
			}, totalBalance);

			// add charity data to google map
			var d = [];
			$.each(data, function(index, val) {
				$.each(val.charities, function(index, val) {
					d.push(val);
				});
			});
			MapsUI.start.dispatch(d);

		}).fail(function(data) {
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
