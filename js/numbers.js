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
			'global_balance_history', 'balance');
		balanceGraph(data, $('#balanceFuture'), 'giv2giv Projected Balance',
			'global_projected_balance', 'balance');

		var current_fund_balance_all_donors = '$' + data.current_fund_balance_all_donors.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
		var total_amount_of_donations = '$' + data.total_amount_of_donations.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
		var total_number_of_donations = data.total_number_of_donations;
		var total_amount_of_grants = '$' + data.total_amount_of_grants.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
		var total_amount_of_pending_grants = '$' + data.total_amount_of_pending_grants.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');

		$("#current-fund-balance-all-donors").text(current_fund_balance_all_donors);
		$("#total-amount-of-donations").text(total_amount_of_donations);
		$("#total-number-of-donations").text(total_number_of_donations);
		$("#total-amount-of-grants").text(total_amount_of_grants);
		$("#total-amount-of-pending-grants").text(total_amount_of_pending_grants);
		
	}).fail(function(data) {
			log(data);
			growlError("An error occured while loading the Numbers.");
	});
}
