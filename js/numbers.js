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

		var current_fund_balance_all_donors = '$' + data.current_fund_balance_all_donors.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
		var total_amount_of_donations = '$' + data.total_amount_of_donations.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
		var total_amount_of_grants = '$' + data.total_amount_of_grants.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');

		$("#current-fund-balance-all-donors").text(current_fund_balance_all_donors);
		$("#total-amount-of-donations").text(total_amount_of_donations);
		$("#total-amount-of-grants").text(total_amount_of_grants);
		
	}).fail(function(data) {
			log(data);
			growlError("An error occured while loading the Numbers.");
	});
}
