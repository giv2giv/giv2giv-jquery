// Donor UI

// Signal Hook
var DonorUI = {
	start : new signals.Signal() 
};

// Add Listener
DonorUI.start.add(onStart);

// (Re)Start Donor UI
function onStart() {

	// Set token for verify_knox account
	$("#knox_payments_script").attr("response_url", GLOBAL.SERVER_URL+"/api/donors/payment_accounts/verify_knox.json?token="+$.cookie("session"));
	
	// Load Donor Profile
	fetchDonorProfile(function() {
		// Load Payment Accounts
		fetchPaymentAccounts(function() {
			// Load UI
			loadUI();
		});
	});
}

// Functions
// Fetch Payment Accounts0
function fetchPaymentAccounts(callback) {
	// Get Payment Accounts
	$.ajax({
		url: GLOBAL.SERVER_URL + '/api/donors/payment_accounts.json',
		method: 'GET',
		contentType: "application/json",
		dataType: "json"
	}).done(function(data) {
		log(data);
		// Clear old data & hide things
		$("#payment-accounts-table").find('tbody:last').html("");
		$("#no-payment-accounts-card").addClass("hide");
		$("#payment-accounts-card").addClass("hide");
		if(data.length === 0) {
			// Show "Add Payment Account Card"
			$("#no-payment-accounts-card").removeClass("hide");
		} else {
			// Loop through accounts & create payment accounts table
			$.each(data, function(k, payment_account) {

				var $row = $("#payment-accounts-table").find('tbody:last').append('<tr></tr>');
				if (payment_account.processor=='stripe') {
					$row.append("<td>"+payment_account.card_info.type+"</td>");
					$row.append("<td>"+payment_account.card_info.last4+"</td>");
					$row.append("<td>"+payment_account.card_info.exp_month+"/"+payment_account.card_info.exp_year+"</td>");
					// Actions
					// var actions = "<button data-id='' class='btn btn-primary'>Edit</button>";
					var actions = "<button data-id='"+payment_account.id+"' data-last-four='"+payment_account.card_info.last4+"' class='btn btn-danger remove-account-btn'>Remove</button>";
				}
				else if (payment_account.processor=='knox') {
					$row.append("<td colspan=3>Bank Account connected via Knox Payments.</td>");
					var actions = "<button data-id='"+payment_account.id+"' data-last-four='Bank-Account' class='btn btn-danger remove-account-btn'>Remove</button>";
				}
				$row.append("<td>"+actions+"</td>");

			});

			$("#payment-accounts-card").removeClass("hide");
			// Remove Account Button
			$('.remove-account-btn').on("click", function(e) {
				// Clear old Modal Data
				$("#remove-payment-modal #remove-card-last-four").html("");
				$("#remove-payment-modal #confirm-payment-removal").attr("data-id", "");
				// Set new Data
				$("#remove-payment-modal #remove-card-last-four").html($(this).attr("data-last-four"));
				$("#remove-payment-modal #confirm-payment-removal").attr("data-id", $(this).attr("data-id"));
				// Show Modal
				$("#remove-payment-modal").modal("show");
			});
		}
	}).fail(function(data) {
		growlError("An error occured while loading your Payment Accounts.");
	}).always(function() {
		// Callbacks
		if(typeof callback === "function") {
			
			callback();
		}
	});
}

// Fetch Donor Profile
function fetchDonorProfile(callback) {
	$.ajax({
		url: GLOBAL.SERVER_URL + '/api/donors.json',
		method: 'GET',
		dataType: "json",
		contentType: "application/json"
	}).done(function(data) {
		// fill out profile form
		log(data);
		$("#donor-profile-email").val(data.donor.email);
		$("#donor-profile-name").val(data.donor.name);
		$("#donor-profile-address").val(data.donor.address);
		$("#donor-profile-city").val(data.donor.city);
		$("#donor-profile-state").val(data.donor.state);
		$("#donor-profile-zip").val(data.donor.zip);
		$("#donor-profile-phone").val(data.donor.phone_number);
		$("#donor-profile-contact").prop('checked', data.donor.subscribed)
	}).fail(function(data) {
		log(data);
		growlError("An error occured while loading your Donor Profile.");
	}).always(function() {
		// Callbacks
		if(typeof callback === "function") {
			
			callback();
		}
	});
}

// Load UI
function loadUI() {
	// Formatters
	$('#donor-profile-phone').formatter({
		'pattern': '({{999}}) {{999}}-{{9999}}',
		'persistent': true
	});

	$('#donor-profile-zip').formatter({
		'pattern': '{{99999}}-{{9999}}',
		'persistent': true
	});

	// Credit Card Formatting
	$('#add-card-number').payment('formatCardNumber');

	// Card Type
	$('#add-card-number').on('keyup', function(e) {
		var type = $.payment.cardType($(this).val());
		if(type === "visa") {
			$("#card-type").attr("src", "/images/credit_cards/visa.png");
		} else if(type === "mastercard") {
			$("#card-type").attr("src", "/images/credit_cards/mastercard.png");
		} else if(type === "discover") {
			$("#card-type").attr("src", "/images/credit_cards/discover.png");
		} else if(type === "amex") {
			$("#card-type").attr("src", "/images/credit_cards/amex.png");
		} else if(type === "dinersclub") {
			$("#card-type").attr("src", "/images/credit_cards/diner_club.png");
		} else if(type === "maestro") {
			$("#card-type").attr("src", "/images/credit_cards/maestro.png");
		} else if(type === "laser") {
			$("#card-type").attr("src", "/images/credit_cards/laser.png");
		} else if(type === "unionpay") {
			$("#card-type").attr("src", "/images/credit_cards/union_pay.png");
		} else {
			// Nothing
			$("#card-type").attr("src", "");
		}
	});

	// Confirm Remove Account Button
	$("#confirm-payment-removal").on("click", function(e) {
		$btn = $(this).button('loading');
		$.ajax({
			url: GLOBAL.SERVER_URL + '/api/donors/payment_accounts/'+$(this).attr("data-id")+'.json',
			method: 'DELETE',
			contentType: "application/json",
			dataType:"json"
		}).done(function(data) {
			growlSuccess("Successfully removed payment account.");
			$("#remove-payment-modal").modal("hide");
			$btn.button('reset');
			fetchPaymentAccounts();
		}).fail(function(data) {
			log(data);
			$btn.button('reset');
			growlError("An error occured while removing this payment account.");
			$("#remove-payment-modal").modal("hide");
		});
		e.preventDefault();
	});

	// Edit Account Button
	// Add account button
	$('#add-account-btn').on("click", function(e) {
		$(this).button('loading');
		$("#add-payment-form").submit();
		e.preventDefault();
	});

	$('#add-payment-form').on("submit", function(e) {
		var $form = $(this);
		// Disable the submit button to prevent repeated clicks
		$("#add-account-btn").prop('disabled', true);
		Stripe.card.createToken($form, stripeResponseHandler);
		e.preventDefault();
	});

	// Update Donor Profile
	$("#donor-profile-form").on("submit", function(e) {
		$btn = $("#update-donor-btn");
		$btn.button('loading');
		// Setup payload
		var donor = {};
		donor.name = $("#donor-profile-name").val();
		donor.email = $("#donor-profile-email").val();
		donor.password = $("#donor-profile-password").val();
		donor.address = $("#donor-profile-address").val();
		donor.city = $("#donor-profile-city").val();
		donor.state = $("#donor-profile-state").val();
		donor.zip = $("#donor-profile-zip").val();
		donor.phone_number = $("#donor-profile-phone").val();
		var payload = JSON.stringify(donor);

		$.ajax({
			url: GLOBAL.SERVER_URL + "/api/donors.json",
			type: "PUT",
			data: payload,
			contentType: "application/json",
			dataType:"json"
		}).done(function (data) {
			growlSuccess("Success! Profile updated.");
			$btn.button('reset');
		}).fail(function(data) {
			growlError("An error occurred while updating your Donor Profile.");
			var res = JSON.parse(data.responseText);
			log("[error]: " + res.message);
			$btn.button('reset');
		});
		e.preventDefault();
	});


	$('#donor-profile-contact').change(function (e) {
		e.preventDefault();

		contact_me = $("#donor-profile-contact").prop("checked");
		if (contact_me) {
			endpoint='subscribe.json'
		}
		else {
			endpoint='unsubscribe.json'	
		}

		$.ajax({
			url: GLOBAL.SERVER_URL + "/api/donors/" + endpoint,
			type: "POST",
//			data: payload,
			contentType: "application/json",
			dataType:"json"
		}).done(function (data) {
			growlSuccess(data.message);
		}).fail(function(data) {
			growlError("An error occurred while updating your Donor Profile.");
			var res = JSON.parse(data.responseText);
			log("[error]: " + res.message);
		});
	});


	// Statement Rendering Handlers
	$("#donor-statement-button").on("click", function(e) {

//    {"donor":{"address":null,"city":null,"country":null,"created_at":"2013-09-24T04:34:59Z","email":"email@domain.com","facebook_id":null,"id":1,"name":"donor name","phone_number":null,"state":null,"updated_at":"2013-09-24T04:34:59Z","zip":null}}

		// Get statement HTML
		var popup = window.open();
		$.get('ui/statement.html', function(data) {
			// Parse HTML into Object
			var $statement = $($.parseHTML(data));
			// stamp we need to get our statement data

			// Get donor info
			$.ajax({
				url: GLOBAL.SERVER_URL + '/api/donors.json',
				method: 'GET',
				contentType: "application/json",
				dataType:"json"}).success(function(response) {
					var donor_info = "Donor: <br />" + response.donor.name + "(" + response.donor.email + ")<br />" + response.donor.address + "<br />" + response.donor.city + "<br />" + response.donor.zip;
					$statement.find('#statement-donor-info').html(donor_info);
				}).fail(function(data) {
					// Close Window
					popup.close();
					growlError('There was an error loading your Statement.');
			 });

			// Get donation info
			$.ajax({
				url: GLOBAL.SERVER_URL + '/api/donors/donations.json',
				method: 'GET',
				data: {"start_date" : "2014-01-01", "end_date" : "2014-12-31" },
				contentType: "application/json",
				dataType:"json"}).success(function(response) {		    	 	
					$.each(response.donations, function(k, donation) {
						var $row = $statement.find('tbody:last').append('<tr></tr>');		
						// And stamp each bit for our row
						timestamp = new Date(donation.created_at);
						var $col = $statement.find('tr:last');
						$col.append('<td>' + timestamp.toString() + '</td>');
						$col.append('<td>Endowment Name: ' + donation.endowment_name + '</td>');
						$col.append('<td>$' + donation.gross_amount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + '</td>');
					});

					$statement.find('#statement-total').html("<span>Total: $" + response.total.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + "</span>");
					ugly_statement_timestamp = new Date(response.timestamp * 1000);
					pretty_statement_timestamp = prettify_timestamp(ugly_statement_timestamp);
					$statement.find('#statement-date-insert').html(pretty_statement_timestamp);
					// Open in new Window
					var html = $('<html>').append($statement).html();
					popup.document.write(html);
				}).fail(function(data) {
					// Close Window
					popup.close();
					growlError('There was an error loading your Statement.');
				});
			}).fail(function(data) {
				// Close Window
				popup.close();
				growlError('There was an error loading your Statement.');
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
	// 	  url: GLOBAL.SERVER_URL + '/api/donors/donations.json',
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
		$("#add-account-btn").button('reset');
		log(response.error);
	} else {
		// token contains id, last4, and card type
		var token = response.id;
		// Insert the token into the form so it gets submitted to the server
		$form.append($('<input type="hidden" name="stripeToken" />').val(token));
		// and add token to g2g
		var payment = {};
		payment.processor = "stripe";
		payment.stripeToken = response.id;
		var payload = JSON.stringify(payment);

		$.ajax({
			url: GLOBAL.SERVER_URL + "/api/donors/payment_accounts.json",
			type: "POST",
			data: payload,
			contentType: "application/json",
			dataType:"json"
		}).done(function (data) {
			log(data);
			// Success
			// Hide Modal
			$("#add-payment-modal").modal('hide');
			// Clear Form
			$("#add-payment-form")[0].reset();
			$("#add-account-btn").button('reset');
			// Reload Payment Accounts
			fetchPaymentAccounts();
		}).fail(function(data) {
			var res = JSON.parse(data.responseText);
			log("[error]: " + res.message);
		});
	}
};
