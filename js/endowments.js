// Endowments UI
// Michael Thomas, 2014

// Signal Hook
var EndowmentsUI = {
	start : new signals.Signal(),
	details : new signals.Signal()
};

// Add Listener
EndowmentsUI.start.add(onStart);
EndowmentsUI.details.add(onDetails);

// (Re)Start Endowments UI
function onStart() {
	WebUI.startLoad();
	// Load Featured Endowments
	fetchFeaturedEndowments(function() {
		// Fetch Subscribed Endowments
		fetchSubscribedEndowments(function() {
			endowmentSelectors();
			WebUI.stopLoad();
		});
	});
}

// (Re)Start Endowments Detail UI
function onDetails(endowment) {
	WebUI.startLoad();
	// Subscription Info
	if(WebUI.activeSession()) {
		$("#subscription-tab").removeClass("hide");
		if (endowment.my_balances.is_subscribed) {
			// Subscribed
			fetchEndowmentDonations(endowment.id);
			$("#endowment-details-unsubscribe").attr("data-id", endowment.id);
			$("#subscription-details").removeClass("hide");      
		} else {
			// Not subscribed
			$("#no-subscription").removeClass("hide");
			$("#endowment-details-subscribe").attr("data-id", endowment.id);
		}
	} else {
		// Hide tab
		$("#subscription-tab").addClass("hide");
	}

	// Subscription Buttons
	// Confirm Endowment Subscription
	$("#confirm-subscribe-endowment").off("click");
	$("#confirm-subscribe-endowment").on("click", function(e) {
		$btn = $(this);
		$btn.button('loading');
		var payload = {};
		payload.amount = $("#subscribe-endowment-modal #subscribe-endowment-donation").val();
		payload.endowment_id = $(this).attr("data-id");
		var request_payload = JSON.stringify(payload);
		$.ajax({
			url: server_url + "/api/donors/payment_accounts/"+$("#subscribe-endowment-payment-accounts").val()+"/donate_subscription.json",
			method: 'POST',
			contentType: "application/json",
			dataType:"json",
			data: request_payload
		}).done(function(data) {
			growlSuccess("Donation scheduled. Thank you! You'll see your endowment balance update in a minute or two.");
			$btn.button('reset');
			fetchEndowmentDonations($("#confirm-subscribe-endowment").attr("data-id"), function() {
				$("#no-subscription").addClass("hide");
				$("#subscription-details").removeClass("hide");
				$("#subscribe-endowment-modal").modal("hide");
			});
		}).fail(function(data) {
			log(data);
			$btn.button('reset');
			growlError("Opps! There was an error subscribing to this endowment.");
		});
		e.preventDefault();
	});

	// Subscribe Button
	$("#endowment-details-subscribe").off("click");
	$("#endowment-details-subscribe").on("click", function(e) {
		WebUI.startLoad();
		// Take ID and get Endowment Details
		// Set Subscribe Button
		$("#confirm-subscribe-endowment").attr("data-id", $(this).attr("data-id"));
		// Now Get Endowment Details
		$.ajax({
			url: server_url + "/api/endowment/" + $(this).attr("data-id") + ".json",
			method: 'GET'
		}).done(function(data) {
			// Clean & Prep Modal
			$("#confirm-subscribe-endowment").attr("data-id", data.endowment.id);
			$("#subscribe-endowment-modal #subscribe-endowment-payment-accounts").html("");
			$("#subscribe-endowment-modal #subscribe-endowment-donation").val("");
			$("#subscribe-endowment-modal #subscribe-endowment-header").html("Subscribe to " + data.endowment.name);
			$("#subscribe-endowment-modal #subscribe-endowment-min-donation").html("$" + data.endowment.minimum_donation_amount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
			// Now Get Payment Accounts
			$.ajax({
				url: server_url + '/api/donors/payment_accounts.json',
				method: 'GET'
			}).done(function(data) {
				if(data.length === 0) {
					growlError("Please set up a payment account under Donors->Payment Accounts");
					$("#subscribe-endowment-payment-accounts").append("<option>No Payment Accounts</option>");
					$("#subscribe-endowment-payment-accounts").attr("disabled", "disabled");
				} else {
					$.each(data, function(k, v) {
						// for the love of god man make this prettier!
						var i = v[0];
						var ii = Object.keys(i);
						var iii = i[ii[0]];
						var c = iii.cards[0];
						var cc = c[0];
						var ccc = Object.keys(cc);
						var card = cc[ccc[0]];
						// Create Option
						var $select = $("#subscribe-endowment-payment-accounts");
						$select.append("<option value='"+ii+"'>"+card.type+" - "+card.last4+" ("+card.exp_month+"/"+card.exp_year+")</option>");
					});
				}
				// Show Modal
				$("#subscribe-endowment-modal").modal('show');
				WebUI.stopLoad();
			});
		}).fail(function(data) {
			log(data);
		});
		e.preventDefault();
	});

	// Unsubscribe Button
	$("#endowment-details-unsubscribe").off("click");
	$("#endowment-details-unsubscribe").on("click", function(e) {
		WebUI.startLoad();
		// Take ID and get Endowment Details
		// Set Subscribe Button
		$("#confirm-unsubscribe-endowment").attr("data-id", $(this).attr("data-id"));
		// Now Get Endowment Details
		$.ajax({
			url: server_url + "/api/endowment/" + $(this).attr("data-id") + ".json",
			method: 'GET'
		}).done(function(data) {
			log(data);
			// Clean & Prep Modal
			// $("#unsubscribe-endowment-modal #unsubscribe-endowment-donation").val("");
			$("#unsubscribe-endowment-modal #unsubscribe-endowment-header").html("Unsubscribe to " + data.endowment.name);
			// $("#unsubscribe-endowment-modal #unsubscribe-endowment-min-donation").html("$" + data.endowment.minimum_donation_amount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
			// Set Confirm Button
			$("#confirm-unsubscribe-endowment").attr("data-id", data.endowment.my_balances.my_subscription_id);
			// Now Show Modal
			$("#unsubscribe-endowment-modal").modal('show');
			WebUI.stopLoad();
		}).fail(function(data) {
			log(data);
		});
		e.preventDefault();
	});

	// Unsubscribe confirmation click
	$("#confirm-unsubscribe-endowment").off("click");
	$("#confirm-unsubscribe-endowment").on("click", function(e) {
		WebUI.startLoad();
		$btn = $(this);
		$btn.button('loading');
		// Now Get Endowment Details
		$.ajax({
			url: server_url + "/api/donors/payment_accounts/" + $("#confirm-unsubscribe-endowment").attr("data-id") + "/cancel_subscription.json",
			method: 'GET'
		}).done(function(data) {
			$btn.button('reset');
			growlSuccess("Successfully unsubscribed from endowment.");
			$("#no-subscription").removeClass("hide");
			$("#subscription-details").addClass("hide");
			$("#unsubscribe-endowment-modal").modal('hide');
		}).fail(function(data) {
			$btn.button('reset');
			growlError("Opps! There was an error unsubscribing from this endowment.");
		});
		e.preventDefault();
		WebUI.stopLoad();
	});

	// Social Sharing Widget
	$('#social-share').share({
		networks: ['twitter','facebook','tumblr','pinterest','googleplus'],
		orientation: 'vertical',
		urlToShare: 'https://giv2giv.org/#/endowment/' + endowment.id,
		affix: 'right center',
		title: "giv2giv: " + endowment.name,
		description: endowment.description
	});

	// Selectors
	$("li a[href='#charities']").on('click', function(e) {
		// Hide Details Cards
		$("#endowment-charity-details").addClass("hide");
	});

	$("li a[href='#subscription']").on('click', function(e) {
		// Hide Details Cards
		$("#endowment-charity-details").addClass("hide");
	});

	$("li a[href='#details']").on('click', function(e) {
		// Show Details Cards
		$("#endowment-charity-details").removeClass("hide");
	});

	// Header
	$("#endowment-details-header").html(endowment.name);
	// Lead Description
	$("#endowment-details-description").html(endowment.description);
	$("#endowment-details-balance").html("$"+endowment.global_balances.endowment_balance.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
	$("#endowment-details-donor-count").html(endowment.global_balances.endowment_donor_count);
	$("#endowment-details-grants").html("$"+endowment.global_balances.endowment_grants.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));

	if (endowment.my_balances) {
		$("#endowment-details-my-balance").html("$"+endowment.my_balances.my_endowment_balance.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
		$("#endowment-details-my-donations-count").html(endowment.my_balances.my_donations_count);
		$("#endowment-details-my-grants-amount").html("$"+endowment.my_balances.my_grants_amount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
	}
	else {
		$("#endowment-details-my-balance").html("$0.00");
		$("#endowment-details-my-donations-count").html("0");
		$("#endowment-details-my-grants-amount").html("$0.00");
	}



	// Build Charity Table
	$.each(endowment.charities, function(k, v) {
		log(v.charity);
		// Create table row & append
		var $row = $("#charities-table").find('tbody:last').append('<tr></tr>');
		$row.append("<td>"+v.charity.name+"</td>");
		$row.append("<td>"+v.charity.address+" "+v.charity.city+", "+v.charity.state+" "+v.charity.zip+"</td>");
	});
}

// Reload jQuery Selectors
function endowmentSelectors() {
	log("EndowmentsUI: Selectors");

	$("#refresh-featured-endowments").off("click");
	$("#refresh-featured-endowments").on("click", function(e) {
		$(this).addClass("fa-spin");
		fetchFeaturedEndowments(function() {
			$("#refresh-featured-endowments").removeClass("fa-spin");
			endowmentSelectors();
		});
		e.preventDefault();
	});

	if($(this).data('select2')) {
		$("#add-endowment-charities").select2('destroy');
	}

	$("#add-endowment-charities").select2({
		placeholder: "Search for a charity",
		multiple: true,
		minimumInputLength: 3,
		ajax: {
			url: server_url + "/api/charity.json",
			dataType: 'json',
			quietMillis: 500,
			data: function (term, page) { // page is the one-based page number tracked by Select2
				var payload = {};
				payload.page = page;
				payload.per_page = 10;
				payload.query = term;
				if($("#charity-city").val().length > 0) {
					payload.city = $("#charity-city").val();
				}
				return payload;
			},
			results: function (data, page) {
				//var more = (page * 10) < data.total;
				// notice we return the value of more so Select2 knows if more results can be loaded
				// Loop Through Charities & build Results
				var results = [];
				if(data.message === undefined) {
					$.each(data, function(k, v) {
						log(v.charity);
						var charity = {};
						charity.id = v.charity.id;
						charity.text = v.charity.name + " (" + v.charity.city + ", " + v.charity.state + ")";
						results.push(charity);
					});
				}
				return {results: results};
			}
		}
	});

	// Go to Charity List
	$("#add-endowment-modal-save").off("click");
	$("#add-endowment-modal-save").on("click", function(e) {
		// Payload
		var payload = {};
		payload.name = $("#add-endowment-modal #endowment-name").val();
		payload.minimum_donation_amount = $("#add-endowment-modal #endowment-min-donation").val();
		payload.visibility = $("#add-endowment-modal input[name='visibility-radios']:checked").val();

		if($("#add-endowment-modal #endowment-description").val().length > 0) {
			payload.description = $("#add-endowment-modal #endowment-description").val();
		}
		payload.charities = [];
		// Get our Charity IDs in the proper format
		var charities = $("#add-endowment-charities").val().split(",");
		$.each(charities, function(k, v) {
			var charity = {};
			charity.id = v;
			payload.charities.push(charity);
		});

		var request_payload = JSON.stringify(payload);
		log(request_payload);
		// Submit & Wait
		$.ajax({
			 url: server_url + '/api/endowment.json',
			 type: "POST",
			 data: request_payload,
			 contentType: "application/json",
			 dataType: "json"
		}).done(function(data) {
			log(data);
			// Refresh Endowments & Hide Modal
			fetchFeaturedEndowments(function() {
				// Fetch Subscribed Endowments
				fetchSubscribedEndowments(function() {
					endowmentSelectors();
					// Hide Modal
					$("#add-endowment-modal").modal('hide');
				});
			});
		}).fail(function(data) {
			log(data);
			growlError("An error occured while adding this endowment.");
		});
	});

	// Add Endowment Button (when there's none)
	$(".add-endowment-btn").off("click");
	$(".add-endowment-btn").on("click", function(e) {
		// Clean & Show Modal
		$("#add-endowment-modal #endowment-name").val("");
		$("#add-endowment-modal #endowment-desc").val("");
		$("#add-endowment-modal #add-endowment-charities").val("");
		$("#add-endowment-modal").modal('show');
		e.preventDefault();
	});

	$("#add-endowment").off("click");
	$("#add-endowment").on("click", function(e) {
		// Clean & Show Modal
		$("#add-endowment-modal #endowment-name").val("");
		$("#add-endowment-modal #endowment-desc").val("");
		$("#add-endowment-modal #add-endowment-charities").val("");
		$("#add-endowment-modal").modal('show');
		e.preventDefault();
	});

	// Confirm Endowment Subscription
	$("#confirm-subscribe-endowment").off("click");
	$("#confirm-subscribe-endowment").on("click", function(e) {
		$btn = $(this);
		$btn.button('loading');
		var payload = {};
		payload.amount = $("#subscribe-endowment-modal #subscribe-endowment-donation").val();
		payload.endowment_id = $(this).attr("data-id");
		var request_payload = JSON.stringify(payload);
		$.ajax({
			url: server_url + "/api/donors/payment_accounts/"+$("#subscribe-endowment-payment-accounts").val()+"/donate_subscription.json",
			method: 'POST',
			contentType: "application/json",
			dataType:"json",
			data: request_payload
		}).done(function(data) {
			growlSuccess("Donation scheduled. Thank you! You'll see your endowment balance update in a minute or two.");
			// Success
			// Refresh Endowments & Hide Modal
			fetchFeaturedEndowments(function() {
				// Fetch Subscribed Endowments
				fetchSubscribedEndowments(function() {
					endowmentSelectors();
					growlSuccess("You have successfully subscribed to this endowment.");
					$btn.button('reset');
					$("#subscribe-endowment-modal").modal('hide');
				});
			});
		}).fail(function(data) {
			log(data);
			$btn.button('reset');
			growlError("Opps! There was an error subscribing to this endowment.");
		});
		e.preventDefault();
	});

	// Subscribe Button
	$(".endowment-subscribe-btn").off("click");
	$(".endowment-subscribe-btn").on("click", function(e) {
		WebUI.startLoad();
		// Take ID and get Endowment Details
		// Set Subscribe Button
		$("#confirm-subscribe-endowment").attr("data-id", $(this).attr("data-id"));
		// Now Get Endowment Details
		$.ajax({
			url: server_url + "/api/endowment/" + $(this).attr("data-id") + ".json",
			method: 'GET'
		}).done(function(data) {
			// Clean & Prep Modal
			$("#subscribe-endowment-modal #subscribe-endowment-payment-accounts").html("");
			$("#subscribe-endowment-modal #subscribe-endowment-donation").val("");
			$("#subscribe-endowment-modal #subscribe-endowment-header").html("Subscribe to " + data.endowment.name);
			$("#subscribe-endowment-modal #subscribe-endowment-min-donation").html("$" + data.endowment.minimum_donation_amount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
			// Now Get Payment Accounts
			$.ajax({
				url: server_url + '/api/donors/payment_accounts.json',
				method: 'GET'
			}).done(function(data) {
				if(data.length === 0) {
					growlError("Please set up a payment account under Donors->Payment Accounts");
					$("#subscribe-endowment-payment-accounts").append("<option>No Payment Accounts</option>");
					$("#subscribe-endowment-payment-accounts").attr("disabled", "disabled");
				} else {
					$.each(data, function(k, v) {
						// for the love of god man make this prettier!
						var i = v[0];
						var ii = Object.keys(i);
						var iii = i[ii[0]];
						var c = iii.cards[0];
						var cc = c[0];
						var ccc = Object.keys(cc);
						var card = cc[ccc[0]];
						// Create Option
						var $select = $("#subscribe-endowment-payment-accounts");
						$select.append("<option value='"+ii+"'>"+card.type+" - "+card.last4+" ("+card.exp_month+"/"+card.exp_year+")</option>");
					});
				}
				// Show Modal
				$("#subscribe-endowment-modal").modal('show');
				WebUI.stopLoad();
			});
		}).fail(function(data) {
			log(data);
		});
		e.preventDefault();
	});

	// Unsubscribe Button
	$(".endowment-unsubscribe-btn").off("click");
	$(".endowment-unsubscribe-btn").on("click", function(e) {
		WebUI.startLoad();
		// Take ID and get Endowment Details
		// Set Subscribe Button
		$("#confirm-unsubscribe-endowment").attr("data-id", $(this).attr("data-id"));
		// Now Get Endowment Details
		$.ajax({
			url: server_url + "/api/endowment/" + $(this).attr("data-id") + ".json",
			method: 'GET'
		}).done(function(data) {
			log(data);

			// Clean & Prep Modal
			// $("#unsubscribe-endowment-modal #unsubscribe-endowment-donation").val("");
			$("#unsubscribe-endowment-modal #unsubscribe-endowment-header").html("Unsubscribe to " + data.endowment.name);
			// $("#unsubscribe-endowment-modal #unsubscribe-endowment-min-donation").html("$" + data.endowment.minimum_donation_amount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
			// Set Confirm Button
			$("#confirm-unsubscribe-endowment").attr("data-id", data.endowment.my_balances.my_subscription_id);
			// Now Show Modal
			$("#unsubscribe-endowment-modal").modal('show');

		}).fail(function(data) {
			log(data);
		});
		e.preventDefault();
	});

	// Unsubscribe confirmation click
	$("#confirm-unsubscribe-endowment").off("click");
	$("#confirm-unsubscribe-endowment").on("click", function(e) {
		WebUI.startLoad();
		$btn = $(this);
		$btn.button('loading');
		// Now Get Endowment Details
		$.ajax({
			url: server_url + "/api/donors/payment_accounts/" + $("#confirm-unsubscribe-endowment").attr("data-id") + "/cancel_subscription.json",
			method: 'GET'
		}).done(function(data) {
			// Refresh Endowments & Hide Modal
			fetchFeaturedEndowments(function() {
				// Fetch Subscribed Endowments
				fetchSubscribedEndowments(function() {
					$btn.button('reset');
					growlSuccess("Successfully unsubscribed from endowment.");
					endowmentSelectors();
					// Hide Modal
					$("#unsubscribe-endowment-modal").modal('hide');
				});
			});

		}).fail(function(data) {
			$btn.button('reset');
			growlError("Opps! There was an error unsubscribing from this endowment.");
		});
		e.preventDefault();

		WebUI.stopLoad();


		});

	// More Details Button
	$(".endowment-details-btn").off();
	$(".endowment-details-btn").on("click", function(e) {
		hasher.setHash('/endowment/' + $(this).attr("data-id"));
		e.preventDefault();
	});
}

// Get Subscribed Endowments
function fetchSubscribedEndowments(callback) {
	// Clear Old Data
	log("Fetching sub endowments");
	$.ajax({
		url: server_url + '/api/donors/subscriptions.json',
		method: 'GET',
		dataType: "json",
		contentType: "application/json"
	}).done(function(data) {
		$("#sub-endowments").html("");
		// did we get anything
		if(data.length === 0) {
			// Display not found card
			var card = "<div class='span3'><div class='card'><h2 class='card-heading simple'>No Subscriptions</h2>";
			card += "<div class='card-body'><p>You have not subscribed to any endowments yet.";
			card += "</p><p><a class='btn btn-success add-endowment-btn' href='#'>Create Endowment</a></p></div></div></div>";
			$("#sub-endowments").append(card);
		} else {
			// Parse Results Here
			// First Row
			var row = $('#featured-endowments');
			$.each(data, function(index, sub) {
				

log (sub);
				// Add the Card to the Row

				row.prepend(getCardHTML(sub,false));

				$("#sub-endowments").append(row);
			});
			// Finally Add the Create Endowment Card
			// Header
			var add_body = "<div class='info'><div class='title'>Create New Endowment</div>";
			// Description
			add_body += "<p><em>Ready to make a difference?</em></p>";
			add_body += "<div class='bottom'><button id='add-endowment' class='btn btn-success'>Create Endowment</button></div>";
			var card = "<div class='span3'><div class='card endowment'>"+add_body+"</div></div>";
			$("#sub-endowments .row:last").append(card);
		}
	}).fail(function(data) {
		log(data);
		growlError("Oops! An error occured while loading your Subscribed Endowments.");
	}).always(function(data) {
		// Callbacks
		if(typeof callback === "function") {
			// Call it, since we have confirmed it is callable
			callback();
		}
	});
}

// Returns a fully-formed HTML object to be appended to the DOM.
function getCardHTML(sub, featured) {
	var cardBody = "<div class='info'><div class='title'>"+sub.name+"</div>";
	// Description
	cardBody += "<p><em>"+sub.description+"</em></p>";
	var donor_string;
	// # of donors
	if(sub.global_balances.endowment_donor_count === 1) {
		donor_string = "donor";
	} else {
		donor_string = "donors";
	}

	cardBody += "<div class='desc'><strong>"+sub.global_balances.endowment_donor_count+"</strong> individual "+donor_string+".</div>";
	if (featured) {
		cardBody += "<div class='desc'><strong>"+sub.global_balances.endowment_donations_count+"</strong> individual donations.</div>";
	}
	// Endowment Balance
	cardBody += "<div class='desc'>Endowment Balance: <strong>$"+sub.global_balances.endowment_balance.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')+"</strong>.</div>";
	if (featured) {
		// Donation Amount
		cardBody += "<div class='desc'>Minimum Donation Amount: <strong>$"+sub.minimum_donation_amount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')+" (per-month)</strong></div>";
		// Endowment Balance & Donations
		cardBody += "<div class='desc'>Total everyone has donated: <strong>$"+sub.global_balances.endowment_total_donations.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')+"</strong></div>";
	} else {
		cardBody += "<div class='desc'>Total I have donated: <strong>$"+sub.my_balances.my_donations_amount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')+"</strong></div>";
		// Endowment Balance & Donations
		cardBody += "<div class='desc'>Total everyone has donated: <strong>$"+sub.global_balances.endowment_donations.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')+"</strong></div>";
		// Donation Amount
		cardBody += "<div class='desc'>Minimum Donation Amount: <strong>$"+sub.minimum_donation_amount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')+" ("+sub.my_balances.my_subscription_type+")</strong></div>";
	}
	// Donor Balance
	cardBody += "<div class='desc'>My Current Balance: <strong>$"+sub.my_balances.my_endowment_balance.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')+"</strong>.</div>";

	var actions;

	if (featured) {
		// Action Buttons
		actions = "<div class='bottom'><button data-id='"+sub.id+"' class='btn btn-primary endowment-details-btn'>More Details</button> ";
	} else {
		// Action Buttons
		actions = "<div class='bottom'><button data-id='"+sub.endowment_id+"' class='btn btn-primary endowment-details-btn'>More Details</button> ";
		// Subscription Check
		actions += "<button data-id='"+sub.endowment_id+"' class='btn btn-danger endowment-unsubscribe-btn'>Unsubscribe</button></div>";
	}

	// Subscription Check
	if (sub.my_balances.is_subscribed) {
		actions += "<button data-id='"+sub.id+"' class='btn btn-danger endowment-unsubscribe-btn'>Unsubscribe</button></div>";
	} else {
		actions += "<button data-id='"+sub.id+"' class='btn btn-success endowment-subscribe-btn'>Subscribe</button></div>";
	}
	var card_html = "<div class='span3'><div class='card endowment'>"+cardBody+"</div>"+actions+"</div></div>";
	return card_html;

}

// Get Featured Endowments
function fetchFeaturedEndowments(callback) {
	// Clear Old Data
	log("Fetching featured endowments");
	$.ajax({
		url: server_url + '/api/endowment.json',
		method: 'GET',
		data: {
			page: '1',
			per_page: '4'
		},
		dataType: "json",
		contentType: "application/json"
	}).done(function(data) {
		$("#featured-endowments").html("");
		if(data.message == "Not found") {
			// Display not found card
			var card = "<div class='span3'><div class='card'><h2 class='card-heading simple'>No Endowments Yet.</h2>";
			card += "<div class='card-body'><p>There are currently no giv2giv endowments yet.</p>";
			card += "<p><a class='btn btn-success add-endowment-btn' href='#'>Create Endowment</a></p></div></div></div>";
			$("#featured-endowments").append(card);
		} else {
			// Parse Results Here
			var endowments = data.endowments;
			// First Row

			$.each(endowments, function(index, sub) {
				// Now build a card
				log(sub);
				
				var row = getCardHTML(sub, true);

				if(endowments.length === (index + 1)) {
					// Append Current Row
					$("#featured-endowments").append(row);
				}
			});
		}
	}).fail(function(data) {
		log(data);
		growlError("Opps! An error occured while loading the Featured Endowments.");
	}).always(function() {
		// Callbacks
		if(typeof callback === "function") {
			// Call it, since we have confirmed it is callable
			callback();
		}
	});
}

function fetchEndowmentDonations(id, callback) {
	log("Fetching endowment donations.");
	$.ajax({
		url: server_url + '/api/donors/donations.json',
		method: 'GET',
		data: {
			endowment_id: id
		},
		dataType: "json",
		contentType: "application/json"
	}).done(function(data) {
		log(data);
		if(data.message === undefined) {
			$.each(data.donations, function(k, v) {
				var i = v.donation;
				var date = new Date(i.created_at);
				var $row = $("#donations-table").find('tbody:last').append('<tr></tr>');
				$row.append("<td>"+date.toLocaleDateString()+"</td>");
				$row.append("<td>$"+i.gross_amount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')+"</td>");
				$row.append("<td>$"+i.net_amount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')+"</td>");
			});
		}
		// Callbacks
		if(typeof callback === "function") {
			// Call it, since we have confirmed it is callable
			callback();
		}
	}).fail(function(data) {
		growlError("Opps! There was an error loading your donations.");
	});
}
