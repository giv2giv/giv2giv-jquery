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
// Fetch Payment Accounts
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
				var x = v[0];
				var y = Object.keys(x);
				var z = x[y[0]];
				var cards = z.cards[0];
				var cardz = cards[0];
				var card_x = Object.keys(cardz);
				var card = cardz[card_x[0]];
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