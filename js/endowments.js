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

	// Get my subscribed endowments
	$.ajax({
	  url: 'https://api.giv2giv.org/api/donors/subscriptions.json',
	  method: 'GET',
	  data: {},
	  success: function(data) {
	  	console.log(data);
	  	// did we get anything
	  	if(data.length == 0) {
	  		// Display not found card
	  		$("#my_not_found_card").removeClass('hide');
	  	} else {

	  	}
	  }
	});

	//Search endowments (or "featured")
	$.ajax({
	  url: 'https://api.giv2giv.org/api/endowment.json',
	  method: 'GET',
	  data: {
	    page: '1',
	    per_page: '10'
	  },
	  success: function(data) {
	  	console.log(data);
	  	// did we get anything
	  	if(data.message == "Not found") {
	  		// Display not found card
	  		$("#not_found_card").removeClass('hide');
	  	} else {

	  	}
	  }
	});
});