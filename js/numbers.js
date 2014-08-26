// Numbers UI

// Signal Hook
var NumbersUI = {
	start : new signals.Signal() 
};

// Add Listener
NumbersUI.start.add(onStart);

// (Re)Start Numbers UI
function onStart() {
		// Load Stats
	fetchStats();
}

function fetchStats(callback) {
	$.ajax({
		url: server_url + '/api/donors/balance_information.json',
		method: 'GET',
		contentType: "application/json",
		dataType: "json"
	}).done(function(data) {	 
		balanceGraph(data, $('#balanceHistory'), 'giv2giv Total Balance History',
			function(balance, data) {
				var history = data.global_balance_history;
				for (var j = 0; j < history.length; j++) {
					balance[j] = {};
					balance[j].x = new Date(history[j].date);
					balance[j].y = history[j].balance;
				}
		});
		balanceGraph(data, $('#balanceFuture'), 'giv2giv Projected Balance',
			function(balance, data) {
				var future = data.global_projected_balance;
				for (var j = 0; j < future.length; j++) {
					balance[j] = {};
					balance[j].x = new Date(future[j].date);
					balance[j].y = future[j].balance;
				}
			});
	}).fail(function(data) {
			log(data);
			growlError("An error occured while loading the Numbers.");
	}).always(function() {
		// Callbacks
		if(typeof callback === "function") {
			callback();
		}
	});
}

function balanceGraph(data, DOMnode, titleText, extractData) {
	var balance = [];

	extractData(balance, data);

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
		series: [{
			name: '$',
			data: balance
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