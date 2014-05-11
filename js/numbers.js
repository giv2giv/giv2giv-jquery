// Numbers UI
// Michael Thomas, 2014

// Signal Hook
var NumbersUI = {
	start : new signals.Signal() 
};

// Add Listener
NumbersUI.start.add(onStart);

// (Re)Start Numbers UI
function onStart() {
	WebUI.startLoad();
	// Load Stats
	fetchStats(function() {
		WebUI.stopLoad();
	});
}

function fetchStats(callback) {
	$.ajax({
		url: server_url + '/api/donors/balance_information.json',
		method: 'GET',
		contentType: "application/json",
		dataType: "json"
	}).done(function(data) {	  	
		var donor_current_balance = '$' + data.donor_current_balance.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
		var donor_total_amount_of_donations = '$' + data.donor_total_amount_of_donations.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
		var donor_total_amount_of_grants = '$' + data.donor_total_amount_of_grants.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
		var current_fund_balance_all_donors = '$' + data.current_fund_balance_all_donors.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
		var total_amount_of_donations = '$' + data.total_amount_of_donations.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
		var total_number_of_donations = '$' + data.total_number_of_donations.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
		var total_amount_of_grants = '$' + data.total_amount_of_grants.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
		

		$("#donor-current-balance").text(donor_current_balance);
		$("#donor-total-amount-of-donations").text(donor_total_amount_of_donations);
		$("#donor-total-amount-of-grants").text(donor_total_amount_of_grants);
		$("#current-fund-balance-all-donors").text(current_fund_balance_all_donors);
		$("#total-amount-of-donations").text(total_amount_of_donations);
		$("#total-amount-of-grants").text(total_amount_of_grants);

	}).fail(function(data) {
			log(data);
			growlError("Opps! An error occured while loading the Numbers.");
	}).always(function() {
		// Callbacks
		if(typeof callback === "function") {
			// Call it, since we have confirmed it is callable
			callback();
		}
	});
}