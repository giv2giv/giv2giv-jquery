$(function() {
	// Set Stripe Key
	Stripe.setPublishableKey('pk_test_d678rStKUyF2lNTZ3MfuOoHy');

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

	// Load Tabs
	$('#donorTabs a').click(function (e) {
	  e.preventDefault();
	  $(this).tab('show');
	});

	// Get Donor Profile
	$.ajax({
	  url: 'https://api.giv2giv.org/api/donors.json',
	  method: 'GET',
	  data: {},
	  success: function(data) {
	  	// put donor name in nav bar
	  	$("#donor_name").html(data.donor.name);
	  	// fill out profile form
	  	$("#donor_profile_email").val(data.donor.email);
	  	$("#donor_profile_name").val(data.donor.name);
	  	$("#donor_profile_address").val(data.donor.address);
	  	$("#donor_profile_city").val(data.donor.city);
	  	$("#donor_profile_state").val(data.donor.state);
	  	$("#donor_profile_zip").val(data.donor.zip);
	  	$("#donor_profile_phone").val(data.donor.phone);
	  },
	  failure: function(data) {
	  	console.log(data);
	  	window.location.href = "index.html";
	  }
	});

	// Get Payment Accounts
	$.ajax({
	  url: 'https://api.giv2giv.org/api/donors/payment_accounts.json',
	  method: 'GET',
	  data: {},
	  success: function(data) {
	  	if(data.length == 0) {
	  		// Show "Add Payment Account Card"
	  		$("#no_payment_accounts_card").removeClass("hide");
	  	}
	  },
	  failure: function(data) {
	  	console.log(data);
	  }
	});

	// Get Donor Statement
	var statement_start_date = new Date($("#donor_statement_year").val(),0,1);
	var statement_end_date = new Date($("#donor_statement_year").val(),11,31);
	var pretty_start_date = statement_start_date.getFullYear() + "-" + statement_start_date.getMonth() + "-" + statement_start_date.getDate();
	var pretty_end_date = statement_end_date.getFullYear() + "-" + statement_end_date.getMonth() + "-" + statement_end_date.getDate();

	$.ajax({
	  url: 'https://api.giv2giv.org/api/donors/donations.json',
	  method: 'GET',
	  data: {"start_date" : "2014-01-01", "end_date" : "2014-12-31" },
		contentType: "application/json",
		dataType:"json",

	  success: function(data) {
			console.log(data)
			// need to do data.donations.each
			// response looks like: {"donations":[{"donation":{"created_at":"2013-12-01T01:52:34Z","donor_id":6,"endowment_id":11,"gross_amount":333.0,"id":3,"net_amount":323.043,"payment_account_id":2,"shares_added":"0.00323043","transaction_fees":9.957,"updated_at":"2013-12-01T01:52:34Z"}}],"total":333.0}

	  },
	  failure: function(data) {
	  	console.log(data);
	  	window.location.href = "index.html";
	  }
	});


	// Update Donor Profile
	$("#donor_profile_form").on("submit", function(e) {
		// Setup payload
		var donor = {};
		donor['name'] = $("#donor_profile_name").val();
		donor['email'] = $("#donor_profile_email").val();
		donor['address'] = $("#donor_profile_addresss").val();
		donor['city'] = $("#donor_profile_city").val();
		donor['state'] = $("#donor_profile_state").val();
		donor['zip'] = $("#donor_profile_zip").val();
		donor['phone'] = $("#donor_profile_phone").val();
		var payload = JSON.stringify(donor);

		$.ajax({
			url: "https://api.giv2giv.org/api/donors.json",
			type: "POST",
			data: payload,
			contentType: "application/json",
			dataType:"json",
			success: function (data) {
				console.log("Success!");
			},
			fail: function(data) {
				var res = JSON.parse(data.responseText);
					console.log("[error]: " + res.message);
			}
		});
		e.preventDefault();
	});




});