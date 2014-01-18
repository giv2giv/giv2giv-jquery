// Donor UI
// Michael Thomas, 2014

// Signal Hook
var DonorUI = {
	start : new signals.Signal() 
};

// Add Listener
DonorUI.start.add(onStart);

// (Re)Start Donor UI
function onStart() {
	WebUI.startLoad();
	// Load Donor Profile
	fetchDonorProfile(function() {
		// Load Payment Accounts
		fetchPaymentAccounts();
		// Load UI
		loadUI();
		WebUI.stopLoad();
	});
}

// Functions
// Fetch Payment Accounts0
function fetchPaymentAccounts(callback) {
	// Get Payment Accounts
	$.ajax({
	  url: 'https://api.giv2giv.org/api/donors/payment_accounts.json',
	  method: 'GET',
	}).done(function(data) {
  	// Clear old data & hide things
		$("#payment-accounts-table").find('tbody:last').html("");
		$("#no-payment-accounts-card").addClass("hide");
		$("#payment-accounts-card").addClass("hide");
  	if(data.length == 0) {
  		// Show "Add Payment Account Card"
  		$("#no-payment-accounts-card").removeClass("hide");
  	} else {
  		// Loop through accounts & create payment accounts table
			$.each(data, function(k, v) {
				// for the love of god man make this prettier!
				var i = v[0];
				var ii = Object.keys(i);
				var iii = i[ii[0]];
				var c = iii.cards[0];
				var cc = c[0];
				var ccc = Object.keys(cc);
				var card = cc[ccc[0]];
				// Create table row & append
				var $row = $("#payment-accounts-table").find('tbody:last').append('<tr></tr>');
				$row.append("<td>"+card.type+"</td>");
				$row.append("<td>"+card.last4+"</td>");
				$row.append("<td>"+card.exp_month+"/"+card.exp_year+"</td>");
				$row.append("<td>Actions Go Here</td>");
			});
			$("#payment-accounts-card").removeClass("hide");
		}
	}).fail(function(data) {
	  log(data);
	  growlError("Opps! An error occured while loading your Payment Accounts.");
	}).always(function() {
  	// Callbacks
		if(typeof callback === "function") {
    	// Call it, since we have confirmed it is callable
      callback();
    }
	});
}

// Fetch Donor Profile
function fetchDonorProfile(callback) {
	$.ajax({
	  url: 'https://api.giv2giv.org/api/donors.json',
	  method: 'GET'
	}).done(function(data) {
  	// fill out profile form
  	$("#donor-profile-email").val(data.donor.email);
  	$("#donor-profile-name").val(data.donor.name);
  	$("#donor-profile-address").val(data.donor.address);
  	$("#donor-profile-city").val(data.donor.city);
  	$("#donor-profile-state").val(data.donor.state);
  	$("#donor-profile-zip").val(data.donor.zip);
  	$("#donor-profile-phone").val(data.donor.phone);
	}).fail(function(data) {
	  log(data);
	  growlError("Opps! An error occured while loading your Donor Profile.");
	}).always(function() {
  	// Callbacks
		if(typeof callback === "function") {
    	// Call it, since we have confirmed it is callable
      callback();
    }
	});
}

// Load UI
function loadUI() {
	// Add account button
	$('#add-account-btn').on("click", function(e) {
		$("#add-payment-frm").submit();
		e.preventDefault();
	});

	$('#add-payment-frm').on("submit", function(e) {
	  var $form = $(this);
	 	// Disable the submit button to prevent repeated clicks
	  $("#add-account-btn").prop('disabled', true);
	  Stripe.card.createToken($form, stripeResponseHandler);
	  e.preventDefault();
	});

	// Update Donor Profile
	$("#donor-profile-frm").on("submit", function(e) {
		// Setup payload
		var donor = {};
		donor['name'] = $("#donor-profile-name").val();
		donor['email'] = $("#donor-profile-email").val();
		donor['address'] = $("#donor-profile-addresss").val();
		donor['city'] = $("#donor-profile-city").val();
		donor['state'] = $("#donor-profile-state").val();
		donor['zip'] = $("#donor-profile-zip").val();
		donor['phone'] = $("#donor-profile-phone").val();
		var payload = JSON.stringify(donor);

		$.ajax({
			url: "https://api.giv2giv.org/api/donors.json",
			type: "PUT",
			data: payload,
			contentType: "application/json",
			dataType:"json",
			done: function (data) {
				log("Success!");
			},
			fail: function(data) {
				var res = JSON.parse(data.responseText);
				log("[error]: " + res.message);
			}
		});
		e.preventDefault();
	});

	// Statement Rendering Handlers
	$("#donor-statement-button").on("click", function(e) {

//    {"donor":{"address":null,"city":null,"country":null,"created_at":"2013-09-24T04:34:59Z","email":"email@domain.com","facebook_id":null,"id":1,"name":"donor name","phone_number":null,"state":null,"updated_at":"2013-09-24T04:34:59Z","zip":null}}

		// Get statement HTML
		var popup = window.open();
		$.get('ui/statement.html', function(data) {
			// Parse HTML into Object
			var $statement = $($.parseHTML(data));
			// Now we need to get our statement data

			// Get donor info
			$.ajax({
			  url: 'https://api.giv2giv.org/api/donors.json',
			  method: 'GET',
			  data: {},
				contentType: "application/json",
				dataType:"json"}).success(function(response) {
					var donor_info = "Donor: <br />" + response.donor.name + "(" + response.donor.email + ")<br />" + response.donor.address + "<br />" + response.donor.city + "<br />" + response.donor.zip
					$statement.find('#statement-donor-info').html(donor_info);
		   	}).fail(function(data) {
		    	// Close Window
		    	popup.close();
		    	growlError('Opps! There was an error loading your Statement.');
		   });

		  // Get donation info
			$.ajax({
			  url: 'https://api.giv2giv.org/api/donors/donations.json',
			  method: 'GET',
			  data: {"start_date" : "2014-01-01", "end_date" : "2014-12-31" },
				contentType: "application/json",
				dataType:"json"}).success(function(response) {		    	 	
		    	$.each(response.donations, function(k, v) {
		    		var $row = $statement.find('tbody:last').append('<tr></tr>');		
						// And now each bit for our row
						var $col = $statement.find('tr:last').append('<td>' + v.donation.created_at + '</td>');
						var $col = $statement.find('tr:last').append('<td>Endowment_id: ' + v.donation.endowment_id + '</td>');
						var $col = $statement.find('tr:last').append('<td>' + v.donation.gross_amount + '</td>');
					});
					$statement.find('#statement-total').html("<span>Total: " + response.total + "</span>");
					timestamp = new Date(response.timestamp * 1000);
					pretty_timestamp = dateFormat(timestamp, "dddd, mmmm dS, yyyy, UTC:h:MM:ss TT Z");
					$statement.find('#statement-date-insert').html(pretty_timestamp);
					// Open in new Window
		    	var html = $('<html>').append($statement).html();
		    	popup.document.write(html);
		    }).fail(function(data) {
		    	// Close Window
		    	popup.close();
		    	growlError('Opps! There was an error loading your Statement.');
		    });
			}).fail(function(data) {
				// Close Window
		    popup.close();
		    growlError('Opps! There was an error loading your Statement.');
			});
		e.preventDefault();
	});

	// Statement Preview (on Date Change)
	// Not in use
	// $('#donor_statement_year').on("change", function(e) {
  	
 //    /*
	//   // Get Donor Statement
	// 	var statement_start_date = new Date($("#donor_statement_year").val(),0,1);
	// 	var statement_end_date = new Date($("#donor_statement_year").val(),11,31);
	// 	var pretty_start_date = statement_start_date.getFullYear() + "-" + statement_start_date.getMonth() + "-" + statement_start_date.getDate();
	// 	var pretty_end_date = statement_end_date.getFullYear() + "-" + statement_end_date.getMonth() + "-" + statement_end_date.getDate();
	// 	*/

 //  	$.ajax({
	// 	  url: 'https://api.giv2giv.org/api/donors/donations.json',
	// 	  method: 'GET',
	// 	  data: {"start_date" : "2014-01-01", "end_date" : "2014-12-31" },
	// 		contentType: "application/json",
	// 		dataType:"json",

	// 	  success: function(response) {
	// 			// need to do response.donations.each
	// 			// response looks like: {"donations":[{"donation":{"created_at":"2013-12-01T01:52:34Z","donor_id":6,"endowment_id":11,"gross_amount":333.0,"id":3,"net_amount":323.043,"payment_account_id":2,"shares_added":"0.00323043","transaction_fees":9.957,"updated_at":"2013-12-01T01:52:34Z"}}],"total":333.0}
	//     		var donations = { date: 'funDate', description: "funDescription", amount: "funAmount" };
	//     		$(".table-striped tbody").children().remove();
	//     		$("#donation-row-template").tmpl(donations).appendTo(".table-striped tbody");

	//     	// console.log(data)

	// 	  },
	// 	  failure: function(response) {
	// 	  	//console.log(data);
	// 	  	window.location.href = "index.html";
	// 	  }
		
	// 	});
	// });
}

// Stripe Response Handler
var stripeResponseHandler = function(status, response) {
	var $form = $('#add-payment-form');

	if (response.error) {
    // Show the errors on the form
    $form.find('.payment-errors').text(response.error.message);
  	$("#add-account-btn").prop('disabled', false);
  	log(response.error);
  } else {
    // token contains id, last4, and card type
    var token = response.id;
    // Insert the token into the form so it gets submitted to the server
    $form.append($('<input type="hidden" name="stripeToken" />').val(token));
    // and add token to g2g
		log(response);
		var payment = {};
		payment['processor'] = "stripe";
		payment['stripeToken'] = response.id;
		var payload = JSON.stringify(payment);

		$.ajax({
			url: "https://api.giv2giv.org/api/donors/payment_accounts.json",
			type: "POST",
			data: payload,
			contentType: "application/json",
			dataType:"json",
			done: function (data) {
				// Success
				// Hide Modal
  			$("#add-payment-modal").modal('hide');
				// Clear Form
				$("#add-payment-form")[0].reset();
  			$("#add-account-btn").prop('disabled', false);
  			// Reload Payment Accounts
  			fetchPaymentAccounts();
			},
			fail: function(data) {
				var res = JSON.parse(data.responseText);
					log("[error]: " + res.message);
			}
		});
	}
};