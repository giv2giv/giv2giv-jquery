// Donor UI
// Michael Thomas, 2014

// Signal Hook
var NumbersUI = {
	start : new signals.Signal() 
};

// Add Listener
NumbersUI.start.add(onStart);

// (Re)Start Donor UI
function onStart() {
	WebUI.startLoad();
	// Load Donor Profile
	fetchStats(function() {
		WebUI.stopLoad();
	});
}

function fetchStats(callback) {
	$.ajax({
	  url: 'https://api.giv2giv.org/api/donors/balance_information.json',
	  method: 'GET',
	  data: {},
	  success: function(data) {	  	
	  	var donor_current_balance = '$' + data.donor_current_balance.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
	  	var donor_total_donations = '$' + data.donor_total_donations.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
	  	var giv2giv_current_balance = '$' + data.giv2giv_current_balance.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
	  	var giv2giv_total_donations = '$' + data.giv2giv_total_donations.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
	  	var giv2giv_total_grants = '$' + data.giv2giv_total_grants.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
	  	var donor_total_grants = '$' + data.donor_total_grants.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');

	  	$("#donor-current-balance").text(donor_current_balance);
	  	$("#donor-total-donations").text(donor_total_donations);
	  	$("#donor-total-grants").text(donor_total_grants);
	  	$("#giv2giv-current-balance").text(giv2giv_current_balance);
	  	$("#giv2giv-total-donations").text(giv2giv_total_donations);
	  	$("#giv2giv-total-grants").text(giv2giv_total_grants);

	  	// Callbacks
			if(typeof callback === "function") {
	    	// Call it, since we have confirmed it is callable
	      callback();
	    }
	  }
	});
}