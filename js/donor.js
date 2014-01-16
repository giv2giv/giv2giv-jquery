// Donor UI
// Michael Thomas, 2014

// Functions
// Fetch Payment Accounts
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
	  	log(data);
	  }
	});
}

// Fetch Donor Profile
function fetchDonorProfile() {
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
	  	log(data);
	  	window.location.href = "index.html";
	  }
	});
}

var DonorUI = function() {
	// Get Payment Accounts
	fetchPaymentAccounts();

	// Load UI
	var ui = function() {
		log("Woot");
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

		// Load Tabs
		$('#donor-tabs li a').on("click", function (e) {
		  e.preventDefault();
		  console.log("Wooof");
		  $(this).tab('show');
		  e.preventDefault();
		});

		// Update Donor Profile
		$("#donor-profile-frm").on("submit", function(e) {
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
					log("Success!");
				},
				fail: function(data) {
					var res = JSON.parse(data.responseText);
						log("[error]: " + res.message);
				}
			});
			e.preventDefault();
		});
	};

  // Stripe
  var stripe = function() {
  	// Set Stripe Key
		var stripe_pub_key = 'pk_test_d678rStKUyF2lNTZ3MfuOoHy';
		Stripe.setPublishableKey(stripe_pub_key);
  	
  	// Response Handler
		var stripeResponseHandler = function(status, response) {
    	var $form = $('#add_payment_form');

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
					success: function (data) {
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
    }
  };

	return {
		init: function () {
			// Methods
			log("DonorUI: Start");
			ui();
			stripe();
		}
	};
}();