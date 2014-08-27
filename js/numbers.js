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

function fetchStats() {
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
	});
}
