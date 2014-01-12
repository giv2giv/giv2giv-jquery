$(function() {
	// Check Login
	if($.cookie('session')) {
		$.ajaxSetup({
 			beforeSend: function(xhr, settings) {
	 			xhr.setRequestHeader("Authorization", "Token token=" + $.cookie('session'));
			}
		});
	} else {
		window.location.href = "index.html";
	}

	// Get Donor Name
	$.ajax({
	  url: 'https://api.giv2giv.org/api/donors.json',
	  method: 'GET',
	  data: {},
	  success: function(data) {
	  	// put donor name in nav bar
	  	$("#donor_name").html(data.donor.name);
	  },
	  failure: function(data) {
	  	console.log(data);
	  	window.location.href = "index.html";
	  }
	});
	
	$.ajax({
	  url: 'https://api.giv2giv.org/api/donors/balance_information.json',
	  method: 'GET',
	  data: {},
	  success: function(data) {
	  	console.log(data)
	  	
	  	var donor_current_balance = '$' + data.donor_current_balance.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
	  	var donor_total_donations = '$' + data.donor_total_donations.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
	  	var giv2giv_current_balance = '$' + data.giv2giv_current_balance.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
	  	var giv2giv_total_donations = '$' + data.giv2giv_total_donations.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
	  	var giv2giv_total_grants = '$' + data.giv2giv_total_grants.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
	  	var donor_total_grants = '$' + data.donor_total_grants.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');

	  	$("#donor_current_balance").text(donor_current_balance);
	  	$("#donor_total_donations").text(donor_total_donations);
	  	$("#donor_total_grants").text(donor_total_grants);
	  	$("#giv2giv_current_balance").text(giv2giv_current_balance);
	  	$("#giv2giv_total_donations").text(giv2giv_total_donations);
	  	$("#giv2giv_total_grants").text(giv2giv_total_grants);
	  }
	});
});