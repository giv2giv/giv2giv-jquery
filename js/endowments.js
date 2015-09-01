// Endowments UI

// Signal Hook
var EndowmentsUI = {
	start : new signals.Signal(),
	newModal : new signals.Signal(),
	details : new signals.Signal(),
	subscriptions: new signals.Signal(),
};

// Add Listener
EndowmentsUI.start.add(onStart);
EndowmentsUI.newModal.add(onModal);
EndowmentsUI.details.add(onDetails);
EndowmentsUI.subscriptions.add(onSubscriptions);

function onModal() {
	// Load Featured Endowments
	fetchFeaturedEndowments(function() {
		endowmentSelectors();
		cleanAndShowModal();
		});
	//initSocialShare();
}

// (Re)Start Endowments UI
function onStart() {
	// Load Featured Endowments
	fetchFeaturedEndowments(function() {
		endowmentSelectors();
		
	});
	//initSocialShare();
}

function onSubscriptions() {
	fetchSubscribedEndowments(function() {
		endowmentSelectors();
	});
	//initSocialShare();
}

// Get Featured Endowments
function fetchFeaturedEndowments(callback) {
	// Clear Old Data
	log('Fetching featured endowments');
	$.ajax({
		url: GLOBAL.SERVER_URL + '/api/endowment.json',
		method: 'GET',
		data: {
			page: '1',
			per_page: '12'
		},
		dataType: 'json',
		contentType: 'application/json'
	}).done(function(data) {
		handleFeaturedEndowments(data);
	}).fail(function(data) {
		log(data);
		growlError('An error occurred while loading the Featured Endowments.');
	}).always(function() {
		callback();
	});
}

function handleFeaturedEndowments(data) {
	$('#featured-endowments').html('');
	var card;
	if(data.message === 'Not found') {
		// Display not found card
		card = new SimpleCard(
			'No Endowments Yet',
			'There are currently no giv2giv endowments yet.',
			'Create an Endowment');
		$('#featured-endowments').append(card.getHTML());
	} else {
		// Parse Results Here
		var endowments = data.endowments;
		for (var i = 0; i < endowments.length; i++) {
			card = new DetailedCard(endowments[i], true);
			$('#featured-endowments').append(card.getHTML());
		}
	}
}

// Get Subscribed Endowments
function fetchSubscribedEndowments(callback) {
	// Clear Old Data
	log('Fetching sub endowments');
	$.ajax({
		url: GLOBAL.SERVER_URL + '/api/donors/subscriptions.json',
		method: 'GET',
		dataType: 'json',
		data: {
			current_only: true
		},
		contentType: 'application/json'
	}).done(function(data) {
		handleSubscribedEndowments(data);
	}).fail(function(data) {
		log(data);
		growlError('An error occurred while loading your Subscribed Endowments.');
	}).always(function(data) {
		// Callbacks
		if(typeof callback === 'function') {
			
			callback();
		}
	});
}

function handleSubscribedEndowments(data) {
	$('#sub-endowments').html('');
	// did we get anything
	var card;
	if(data.length === 0) {
		// Display not found card
		card = new SimpleCard(
			'No Subscriptions',
			'You have not subscribed to any endowments yet.',
			'Create an Endowment'
			);
		$('#sub-endowments').append(card.getHTML());
	} else {
		// Parse Results Here
		$.each(data, function(index, sub) {
			
		log(sub);
		// Add the Card to the Row
		$('#sub-endowments').append(new DetailedCard(sub, false).getHTML());
		});
		// Finally Add the Create Endowment Card
		card = new SimpleCard(
			'Create New Endowment',
			'<em>Ready to make a difference?</em>',
			'Create an Endowment'
			);
		$("#sub-endowments .row:last").append(card.getHTML());
	}
}

// Reload jQuery Selectors
function endowmentSelectors() {
	log('EndowmentsUI: Selectors');
	$('#refresh-featured-endowments').off('click');
	$('#refresh-featured-endowments').on('click', function(e) {
		$(this).addClass('fa-spin');
		fetchFeaturedEndowments(function() {
			$('#refresh-featured-endowments').removeClass('fa-spin');
			endowmentSelectors();
		});
		e.preventDefault();
	});


	if($(this).data('select2')) {
		$('#add-endowment-charities').select2('destroy');
	}


	$('#add-endowment-charities').select2({
		placeholder: 'Search for a charity',
		multiple: true,
		minimumInputLength: 3,
		ajax: {
			url: GLOBAL.SERVER_URL + '/api/charity/autocomplete.json',
			dataType: 'json',
			quietMillis: 500,
			data: function (term, page) { // page is the one-based page number tracked by Select2
				var payload = {};
				payload.q = term + " " + $('#charity-city').val();
				return payload;
			},
			results: function (data) {
				var results = [];
				if(data.message === undefined) {
					$.each(data, function(k, v) {
						var charity = {};
						charity.id = v.id;
						charity.text = v.value + ' (' + v.city + ', ' + v.state + ')';
						results.push(charity);
					});
				}
				return {results: results};
			}
		}
	});

	// Go to Charity List
	$('#add-endowment-modal-save').off('click');
	$('#add-endowment-modal-save').on('click', function(e) {
		e.preventDefault();
		// Payload
		var payload = {};
		payload.name = $('#add-endowment-modal #endowment-name').val();
		payload.visibility = $('#add-endowment-modal input[name="visibility-radios"]:checked').val();

		if($('#add-endowment-modal #endowment-description').val().length > 0) {
			payload.description = $('#add-endowment-modal #endowment-description').val();
		}
		payload.charities = [];
		// Get our Charity IDs in the proper format
		var charities = $('#add-endowment-charities').val().split(',');
		$.each(charities, function(k, v) {
			var charity = {};
			charity.id = v;
			payload.charities.push(charity);
		});

		var request_payload = JSON.stringify(payload);

		// Submit & Wait
		$.ajax({
			url: GLOBAL.SERVER_URL + '/api/endowment.json',
			type: 'POST',
			data: request_payload,
			contentType: 'application/json',
			dataType: 'json'
		}).done(function(data) {
			$('#add-endowment-modal').modal('hide');
			hasher.setHash('endowment/'+data.endowment.slug);
			growlSuccess('Successfully created your endowment. Now subscribe, and share your endowment to maximize your impact!');
		}).fail(function(data) {
			log(data);
			growlError('An error occurred while adding this endowment.');
		});
	});

	// Add Endowment Button (when there's none)
	$('.add-endowment-btn').off('click');
	$('.add-endowment-btn').on('click', function(e) {
		// Clean & Show Modal
		cleanAndShowModal();
		e.preventDefault();
	});

	subscribeSelectors();

	// Subscribe Button
	$('.endowment-subscribe-btn').off('click');
	$('.endowment-subscribe-btn').on('click', function(e) {
		e.preventDefault();
		var endowmentId = $(this).attr('data-id') || $('#endowment-details-unsubscribe').attr('data-id');
		// Now Get Endowment Details
		$.ajax({
			url: GLOBAL.SERVER_URL + '/api/endowment/' + endowmentId + '.json',
			method: 'GET'
		}).done(function(data) {
			// Clean & Prep Modal
			$('#subscribe-endowment-payment-accounts').html('');
			$('#subscribe-endowment-donation').val('');
			$('#subscribe-endowment-header').html('Subscribe to ' + data.endowment.name);
			$('#confirm-subscribe-endowment').attr('data-id', data.endowment.id);
			$('#confirm-subscribe-endowment').attr('data-slug', data.endowment.slug);
			$('#confirm-subscribe-endowment').attr('data-name', data.endowment.name);
			// Now Get Payment Accounts
			$.ajax({
				url: GLOBAL.SERVER_URL + '/api/donors/payment_accounts.json',
				method: 'GET'
			}).done(function(data) {
				if(data.length === 0) {
					growlError("You can't subscribe until you set up a method of payment. <a href='https://giv2giv.org/#donor'>Add a card</a> to get started");
					$('#subscribe-endowment-payment-accounts').append('<option>No Payment Accounts</option>');
					$('#subscribe-endowment-payment-accounts').attr('disabled', 'disabled');
				} else {

					$.each(data, function(k, payment_account) {

						var $select = $('#subscribe-endowment-payment-accounts');
						if (payment_account.processor=='stripe') {
							$select.append('<option value="'+payment_account.id+'">'+payment_account.card_info.type+' - '+payment_account.card_info.last4+' ('+payment_account.card_info.exp_month+'/'+payment_account.card_info.exp_year+')</option>');
						}
						else if (payment_account.processor=='knox') {
							$select.append('<option value="'+payment_account.id+'">Bank Account connected via Knox Payments</option>');
						}
					});
					// Show Modal
					$('#subscribe-endowment-modal').modal('show');
				}

			}).fail(function(){
				growlError("You can't subscribe until you set up a method of payment. <a href='https://wwwtest.giv2giv.org/#donor'>Add a card</a> to get started");
			});
		}).fail(function(data) {
			log(data);
		});
	});

	unsubscribeSelectors();

	// More Details Button
	$('.endowment-details-btn').off();
	$('.endowment-details-btn').on('click', function(e) {
		e.preventDefault();
		hasher.setHash('endowment/' + $(this).attr('data-id'));
	});
}

function cleanAndShowModal() {
	$('#add-endowment-modal #endowment-name').val('');
	$('#add-endowment-modal #endowment-desc').val('');
	$('#add-endowment-modal #add-endowment-charities').val('');
	$('#add-endowment-modal').modal('show');
}

// Constructor for SimpleCard Object
function SimpleCard(heading, body, button) {
	this.cardHead = heading;
	this.cardBody = body;
	this.cardButton = button;

	var html = '';
	html += '<div class="card card-fixed">'+ 
	'<h3 class="card-heading simple">'+ this.cardHead +'</h3>'+
	'<div class="card-body">'+
	'<p>'+ this.cardBody +'</p>'+
	'<p><a class="btn btn-success add-endowment-btn" href="#">'+this.cardButton+'</a></p>'+
	'</div></div>';

	this.getHTML = function() {
		return html;
	};
}

// Constructor for DetailedCard Object
function DetailedCard(sub, isFeatured) {
	// TODO: Delete sub.endowment_id once Rails is update
	this.id = sub.id;
	this.slug = sub.slug;
	this.cardTitle = sub.name;
	this.cardBody = sub.description;
	this.isFeatured = isFeatured;
	this.donorCount = sub.global_balances.endowment_donor_count;
	this.pluralDonors = this.donorCount !== 1;
	this.donorString = this.pluralDonors ? ' individual donors' : ' individual donor';
	this.donationsCount = sub.global_balances.endowment_donations_count;
	this.totalBalance = sub.global_balances.endowment_balance.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
	this.totalDonations = sub.global_balances.endowment_total_donations.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
	this.myBalance = sub.my_balances.my_endowment_balance.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
	this.myDonations = sub.my_balances.my_donations_amount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
	this.isSubscribed = sub.my_balances.is_subscribed;

	var div = function(cssClass) {return '<div class="'+cssClass+'">';};

	var html = '';
	html += div('card card-fixed')+
	div('info')+
		div('title')+
			this.cardTitle+
		'</div><p><em>'+
			this.cardBody+
		'</em></p>'+

		div('desc')+'<strong>'+
			this.donorCount+'</strong>'+this.donorString+
		'</div>';

		if (this.isFeatured) {
			html += div('desc')+'<strong>'+
				this.donationsCount +'</strong> individual donations</div>';
		}html+=

		div('desc')+'Endowment Balance: '+
			'<strong>$'+
				this.totalBalance+
		'</strong></div>';

		if (this.isFeatured) {
			html+=div('desc')+'Total everyone has donated: <strong>$'+this.totalDonations+'</strong></div>';
		} else {
			html+=div('desc')+'Total I have donated: <strong>$'+this.myDonations+'</strong></div>';
			html+=div('desc')+'Total everyone has donated: <strong>$'+this.totalDonations+'</strong></div>';
		}html+=
		div('desc')+'My Current Balance: <strong>$'+this.myBalance+'</strong></div>'+
	'</div>'+

	div('bottom')+
		'<button data-id="'+this.slug+'" class="btn btn-primary endowment-details-btn">More Details</button> ';
			if (this.isSubscribed) {
				html+='<button data-id="'+this.id+'" class="btn btn-danger endowment-unsubscribe-btn">Unsubscribe</button>';
			} else {
				html+='<button data-id="'+this.id+'" class="btn btn-success endowment-subscribe-btn">Subscribe</button>';
			}html+=
	'</div>';

	this.getHTML = function() {
		return html;
	};
}

// ======================= //
//  ENDOWMENTS DETAILS UI  //
// THIS IS A SEPARATE PAGE //
// ======================= //

// (Re)Start Endowments Detail UI
function onDetails(endowment) {

	// Subscription Info
	if(WebUI.activeSession()) {
		fetchEndowmentDonations(endowment.id);

		if (endowment.my_balances.is_subscribed) {
			// Subscribed
			$('#endowment-details-unsubscribe').attr('data-id', endowment.id);
			$('#subscription-details').removeClass('hide');  
		}
		else if (endowment.my_balances.my_donations_amount > 0) {
			// Balance but not subscribed
			$('#subscription-balance').removeClass('hide');
			$('#endowment-details-balance-subscribe').attr('data-id', endowment.id);
		}
		else {
			// No balance, not subscribed
			$('#no-subscription').removeClass('hide');
			$('#endowment-details-subscribe').attr('data-id', endowment.id);
		}
	} else {
		// Hide tab
		$('#subscription-signup').removeClass('hide');
	}

	subscribeSelectors();
	initSocialShare(endowment);

	$('#qrcode').qrcode({width: 64,height: 64,text: window.location.href});

	// Subscribe Button
	$('.endowment-details-subscribe').off('click');
	$('.endowment-details-subscribe').on('click', function(e) {
		// Now Get Endowment Details
		$.ajax({
			url: GLOBAL.SERVER_URL + '/api/endowment/' + $(this).attr('data-id') + '.json',
			method: 'GET'
		}).done(function(data) {
			// Clean & Prep Modal
			$('#subscribe-endowment-payment-accounts').html('');
			$('#subscribe-endowment-donation').val('');
			$('#subscribe-endowment-header').html('Subscribe to ' + data.endowment.name);
			$('#confirm-subscribe-endowment').attr('data-id', data.endowment.id);
			$('#confirm-subscribe-endowment').attr('data-slug', data.endowment.slug);
			$('#confirm-subscribe-endowment').attr('data-name', data.endowment.name);

			// Now Get Payment Accounts
			$.ajax({
				url: GLOBAL.SERVER_URL + '/api/donors/payment_accounts.json',
				method: 'GET'
			}).done(function(data) {
				if(data.length === 0) {
					growlError("You can't subscribe until you set up a method of payment. <a href='https://giv2giv.org/#donor'>Add a card</a> to get started");
					$('#subscribe-endowment-payment-accounts').append('<option>No Payment Accounts</option>');
					$('#subscribe-endowment-payment-accounts').attr('disabled', 'disabled');
				} else {
					
					$.each(data, function(k, payment_account) {

						var $select = $('#subscribe-endowment-payment-accounts');
						if (payment_account.processor=='stripe') {
							$select.append('<option value="'+payment_account.id+'">'+payment_account.card_info.type+' - '+payment_account.card_info.last4+' ('+payment_account.card_info.exp_month+'/'+payment_account.card_info.exp_year+')</option>');
						}
						else if (payment_account.processor=='knox') {
							$select.append('<option value="'+payment_account.id+'">Bank Account connected via Knox Payments</option>');
						}
					});

					// Show Modal
					$('#subscribe-endowment-modal').modal('show');
				}
			});
		}).fail(function(data) {
			log(data);
		});
		e.preventDefault();
	});

	unsubscribeSelectors();

	// Header
	$('#endowment-details-header').html(endowment.name);
	// Lead Description
	$('#endowment-details-description').html(endowment.description);
	$('#endowment-details-fund-balance').html('$'+endowment.global_balances.endowment_balance.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
	$('#endowment-details-donor-count').html(endowment.global_balances.endowment_donor_count);
	$('#endowment-details-grants').html('$'+endowment.global_balances.endowment_grants.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));

	if (endowment.my_balances) {

		if (endowment.my_balances.is_subscribed)
		  $('#endowment-details-my-balance-subscribed').html('My Current Balance: $'+endowment.my_balances.my_endowment_balance.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
		else
			$('#endowment-details-my-balance').html('My Current Balance: $'+endowment.my_balances.my_endowment_balance.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));

		$('#endowment-details-my-donations-count').html(endowment.my_balances.my_donations_count);
		$('#endowment-details-my-grants-amount').html('$'+endowment.my_balances.my_grants_amount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
	}
	else {
		$('#endowment-details-my-balance').html('My Current Balance: $0.00');
		$('#endowment-details-my-donations-count').html('0');
		$('#endowment-details-my-grants-amount').html('$0.00');
	}

	var $charity_div = $('#charity_list');
	$charity_div.html('<ul>');
	$.each(endowment.charities, function(index, charity) {
		//$charity_div.append('<li>' + charity.name+' in '+charity.city+', '+charity.state+'</li>');
		$charity_div.append("<li><a href='/#charity/" + charity.slug+ "'>" + charity.name+' in '+charity.city+', '+charity.state+'</a></li>');
	});
	$charity_div.append('</ul>');

	balanceGraph(endowment.global_balances, $('#balanceHistory'), 'Global Balance History',
		'endowment_balance_history', 'balance');

	balanceGraph(endowment.global_balances, $('#projectedBalance'), 'Projected Global Impact',
		'projected_balance', 'balance');
	MapsUI.start.dispatch(endowment.charities);
}

function fetchEndowmentDonations(id, callback) {
	log('Fetching endowment donations.');
	$.ajax({
		url: GLOBAL.SERVER_URL + '/api/donors/donations.json',
		method: 'GET',
		data: {
			endowment_id: id
		},
		dataType: 'json',
		contentType: 'application/json'
	}).done(function(data) {
		handleEndowmentDonations(data);
	}).fail(function(data) {
		growlError('There was an error loading your donations.');
	}).always(function() {
		if (typeof callback === 'function') {
			callback();
		}
	});
}

function handleEndowmentDonations(data) {
	if(data.message === undefined) {
		$.each(data.donations, function(k, v) {
			var date = new Date(v.created_at);
			var $row = $('#donations-table').find('tbody:last').append('<tr></tr>');
			$row.append('<td>'+date.toLocaleDateString()+'</td>');
			$row.append('<td>$'+v.gross_amount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')+'</td>');
			$row.append('<td>$'+v.net_amount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')+'</td>');
		});
	}
}

function subscribeSelectors() {
	// Confirm Endowment Subscription
	$('#confirm-subscribe-endowment').off('click');
	$('#confirm-subscribe-endowment').on('click', function(e) {
		e.preventDefault();
		var self = $(this);
		self.button('loading');

		var amount = $('#subscribe-endowment-donation').val();
		if (amount < GLOBAL.MIN_DONATION) {
			self.button('reset');
			growlError('Sorry! The minimum donation is $' + GLOBAL.MIN_DONATION.toFixed(2));
			return;
		}

		var frequency = $('#subscribe-endowment-frequency').val();
		if (frequency == 'per-month') {
			endpoint = '/api/donors/payment_accounts/'+$('#subscribe-endowment-payment-accounts').val()+'/donate_subscription.json'	
		}
		else {
			endpoint = '/api/donors/payment_accounts/'+$('#subscribe-endowment-payment-accounts').val()+'/one_time_payment.json'	
		}

		var payload = {};
		payload.amount = amount;
		payload.frequency = frequency;
		payload.endowment_id = self.attr('data-id');
		var request_payload = JSON.stringify(payload);
		$.ajax({
			url: GLOBAL.SERVER_URL + endpoint,
			method: 'POST',
			contentType: 'application/json',
			dataType:'json',
			data: request_payload
		}).done(function(data) {
			growlSuccess('Donation scheduled. Thank you! You\'ll see your endowment balance update in a minute or two.');
			// Success
			// Refresh Endowments & Hide Modal
			fetchFeaturedEndowments(function() {
				// Fetch Subscribed Endowments
				fetchSubscribedEndowments(function() {
					endowmentSelectors();
					self.button('reset');
					$('#no-subscription').addClass('hide');
					if (frequency=='per-month') {
					  $('#subscription-details').removeClass('hide');
					}
					else {
						$('#subscription-balance').removeClass('hide');
					}
					$('#subscribe-endowment-modal').modal('hide');
					$('#social-share-modal').modal('show');
					var endowment = {name:self.attr('data-name'), slug:self.attr('data-slug'), description:'fun'}
					//TODO should we grab endowment details for the endowment we just donated to, just to show?
					initSocialShare(endowment);
					//$('#share-buttons div').attr('data-url', 'https://www.giv2giv.org/#endowment/'+self.attr('data-slug'));
					//$('#share-buttons div').attr('data-text', "Join me at giv2giv and support my endowment \"" + self.attr('data-name') + "\"");
				});
			});
		}).fail(function(data) {
			log(data);
			self.button('reset');
			growlError('There was an error subscribing to this endowment.');
		});
	});
}

function unsubscribeSelectors() {
	// Unsubscribe Button
	$('.endowment-unsubscribe-btn').off('click');
	$('.endowment-unsubscribe-btn').on('click', function(e) {
		e.preventDefault();
		// Take ID and get Endowment Details
		var endowmentId = $(this).attr('data-id') || $('#endowment-details-subscribe').attr('data-id');

		// Set Subscribe Button
//		$('#confirm-unsubscribe-endowment').attr('data-id', endowmentId);

		// Now Get Endowment Details
		$.ajax({
			url: GLOBAL.SERVER_URL + '/api/endowment/' + endowmentId + '.json',
			method: 'GET'
		}).done(function(data) {
			log(data);
			// Clean & Prep Modal
			$('#unsubscribe-endowment-header').html('Unsubscribe to ' + data.endowment.name);
			// Set Confirm Button
			$('#confirm-unsubscribe-endowment').attr('data-id', data.endowment.my_balances.my_subscription_id);
			// Now Show Modal
			$('#unsubscribe-endowment-modal').modal('show');

		}).fail(function(data) {
			log(data);
		});
	});

	// Unsubscribe confirmation click
	$('#confirm-unsubscribe-endowment').off('click');
	$('#confirm-unsubscribe-endowment').on('click', function(e) {
		e.preventDefault();
		var self = $(this);
		self.button('loading');
		// Now Get Endowment Details
		$.ajax({
			url: GLOBAL.SERVER_URL + '/api/donors/payment_accounts/' + $('#confirm-unsubscribe-endowment').attr('data-id') + '/cancel_subscription.json',
			method: 'GET'
		}).done(function(data) {
			// Refresh Endowments & Hide Modal
			fetchFeaturedEndowments(function() {
				// Fetch Subscribed Endowments
				fetchSubscribedEndowments(function() {
					self.button('reset');
					growlSuccess('Successfully unsubscribed from endowment.');
					endowmentSelectors();
					$('#no-subscription').removeClass('hide');
					$('#subscription-details').addClass('hide');
					// Hide Modal
					$('#unsubscribe-endowment-modal').modal('hide');
				});
			});
		}).fail(function(data) {
			self.button('reset');
			growlError('There was an error unsubscribing from this endowment.');
		});
	});
}

function initSocialShare(endowment) {
	var shareURL = GLOBAL.WEB_URL + '/#endowment/' + endowment.slug;

	// Twitter
	// TODO - figure out why data-counturl won't work with slug/hashtag
	$(".twitter-share-button").attr("data-text", "Make a difference today.");
	$(".twitter-share-button").attr("data-url", shareURL);
	$(".twitter-share-button").attr("data-counturl", GLOBAL.WEB_URL);
	$(".twitter-share-button").attr("data-hashtags", "giv2giv");
	$(".twitter-share-button").attr("data-related", "giv2giv");

	//twttr.widgets.load();

	// Facebook
	$('.facebook-share').on('click', function(e) {
		FB.ui({
			method: 'feed',
			link: shareURL,
			caption: "Funds at giv2giv sustain charities for generations: " + endowment.name,
			description: endowment.description
		}, function(response){});
	});

	// LinkedIn (building URL)
	var title = "See my fund: " + endowment.name;
	var shortDescription = endowment.description.substring(0, 256);
	var linkedinURL = encodeURI("http://www.linkedin.com/shareArticle?mini=true&url="+shareURL+"&title="+title+"&summary="+shortDescription+"&source=giv2giv");

	$("#linkedin-share").attr("href", linkedinURL);

	// Reddit
	//$("#reddit-share").html('<script type="text/javascript" src="//www.reddit.com/buttonlite.js?i=0"></script>');
	$('#share-via-email').on('click', function(e) {
		e.preventDefault();
		var self = $(this);
		self.button('loading');

		var payload = {};
		payload.email = $('#friend-email').val();

		$.ajax({
			url: GLOBAL.SERVER_URL + '/api/donors/send_invite.json',
			type: 'POST',
			data: JSON.stringify(payload),
			dataType: 'json',
			contentType: 'application/json',
			beforeSend: function(xhr, settings) {
				xhr.setRequestHeader("Authorization", "Token token=" + $.cookie('session'));
			}
		}).done(function(data) {
			growlSuccess('Your email was sent! Thanks for sharing :)');
		}).fail(function() {
			growlError('We couldn\'t send your email for some reason. Please try again later.');
		}).always(function() {
			self.button('reset');
		});
	});

}
