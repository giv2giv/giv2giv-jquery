// donor.js
// functions we'll use more than once
function fetchPaymentAccounts() {
	// Get Payment Accounts
	$.ajax({
	  url: 'https://api.giv2giv.org/api/donors/payment_accounts.json',
	  method: 'GET',
	  data: {},
	  success: function(data) {
	  	// Clear old data & hide things
			$("#payment_accounts_table").find('tbody:last').html("");
			$("#no_payment_accounts_card").addClass("hide");
			$("payment_accounts_card").addClass("hide");
	  	if(data.length == 0) {
	  		// Show "Add Payment Account Card"
	  		$("#no_payment_accounts_card").removeClass("hide");
	  	} else {
	  		// Loop through accounts & create payment accounts table
				$.each(data, function(k, v) {
					// for the love of god man make this prettier!
					var x = v[0];
					var y = Object.keys(x);
					var z = x[y[0]];
					var cards = z.cards[0];
					var cardz = cards[0];
					var card_x = Object.keys(cardz);
					var card = cardz[card_x[0]];
					// Create table row & append
					var $row = $("#payment_accounts_table").find('tbody:last').append('<tr></tr>');
					$row.append("<td>"+card.type+"</td>");
					$row.append("<td>"+card.last4+"</td>");
					$row.append("<td>"+card.exp_month+"/"+card.exp_year+"</td>");
					$row.append("<td>Actions</td>");
				});
				$("#payment_accounts_card").removeClass("hide");
			}
	  },
	  failure: function(data) {
	  	console.log(data);
	  }
	});
}

$(function() {
	// Set Stripe Key
	var stripe_pub_key = 'pk_test_d678rStKUyF2lNTZ3MfuOoHy';
	var stripe_secret_key = '';

	Stripe.setPublishableKey(stripe_pub_key);

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
	fetchPaymentAccounts();

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
			type: "PUT",
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

  // stripe
  // stripe handler
	var stripeResponseHandler = function(status, response) {
    var $form = $('#add_payment_form');

    if (response.error) {
      // Show the errors on the form
      $form.find('.payment-errors').text(response.error.message);
    	$("#add_account_btn").prop('disabled', false);
    	console.log(response.error);
    } else {
      // token contains id, last4, and card type
      var token = response.id;
      // Insert the token into the form so it gets submitted to the server
      $form.append($('<input type="hidden" name="stripeToken" />').val(token));
      // and add token to g2g
			console.log(response);
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
				success: function (data) {
					// Success
					// Hide Modal
    			$("#add_payment_modal").modal('hide');
					// Clear Form
					$("#add_payment_form")[0].reset();
    			$("#add_account_btn").prop('disabled', false);
    			// Reload Payment Accounts
    			fetchPaymentAccounts();
				},
				fail: function(data) {
					var res = JSON.parse(data.responseText);
						console.log("[error]: " + res.message);
				}
			});
    }
  };


	//$('[data-numeric]').payment('restrictNumeric');
  $('.cc-number').payment('formatCardNumber');
  $('.cc-exp').payment('formatCardExpiry');
  $('.cc-cvc').payment('formatCardCVC');

  // Add account button
  $('#add_account_btn').on("click", function(e) {
  	$("#add_payment_form").submit();
  	e.preventDefault();
  });

  $('#add_payment_form').submit(function(e) {
    var $form = $(this);

    // Disable the submit button to prevent repeated clicks
    $("#add_account_btn").prop('disabled', true);

    // $('input').removeClass('invalid');
    // $('.validation').removeClass('passed failed');

    //var cardType = $.payment.cardType($('.cc-number').val());

    // $('.cc-number').toggleClass('invalid', !$.payment.validateCardNumber($('.cc-number').val()));
    // $('.cc-exp').toggleClass('invalid', !$.payment.validateCardExpiry($('.cc-exp').payment('cardExpiryVal')));
    // $('.cc-cvc').toggleClass('invalid', !$.payment.validateCardCVC($('.cc-cvc').val(), cardType));

    // if ( $('input.invalid').length ) {
    //   $('.validation').addClass('failed');
    // } else {
    //   $('.validation').addClass('passed');
    // }

    Stripe.card.createToken($form, stripeResponseHandler);

    // Prevent the form from submitting with the default action
    e.preventDefault();
  });



});