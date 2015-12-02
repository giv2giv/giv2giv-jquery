// Charities UI

// Signal Hook
var CharitiesUI = {
	start : new signals.Signal(),
	//newModal : new signals.Signal(),
	details : new signals.Signal(),
	//subscriptions: new signals.Signal(),
};

// Add Listener
CharitiesUI.start.add(onStart);
//EndowmentsUI.newModal.add(onModal);
CharitiesUI.details.add(onCharityDetails);
//EndowmentsUI.subscriptions.add(onSubscriptions);


// (Re)Start Charities UI
function onStart() {
	// Load Featured Charities
	fetchFeaturedCharities(function() {
		charitySelectors(); //need to work on this for 'refresh list'
	});
	initCharitySocialShare();

	$('.create-endowment-btn').on('click', function(e) {
		e.preventDefault();
		hasher.setHash('/');
		EndowmentsUI.newModal.dispatch();
	});

}

// Get Featured Charities
function fetchFeaturedCharities(callback) {
	// Clear Old Data
	if ($.cookie('latitude')) {
		latitude=$.cookie('latitude');
		longitude=$.cookie('longitude');
	}
	else {
		latitude=0;
		longitude=0;
	}
	log('Fetching featured charities with lat/long ' + latitude + "/" + longitude);
	$.ajax({
		url: GLOBAL.SERVER_URL + '/api/charity/near.json',
		method: 'GET',
		data: {
			radius: '25',
			latitude: latitude,
			longitude: longitude
		},
		dataType: 'json',
		contentType: 'application/json'
	}).done(function(data) {
		handleFeaturedCharities(data);
	}).fail(function(data) {
		log(data);
		growlError('An error occured while loading the Featured Charities.');
	}).always(function() {
		callback();
	});
}

function handleFeaturedCharities(data) {
	$('#featured-charities').html('');
	var card;
	if(data.message === 'Not found') {
		// Display not found card
		card = new SimpleCharityCard(
			'Oops',
			'There was a problem loading featured charities.',
			'Sorry!');
		$('#featured-charities').append(card.getHTML());
	} else {
		// Parse Results Here
		var charities = data.charities;
		for (var i = 0; i < charities.length; i++) {
			card = new DetailedCharityCard(charities[i], true);
			$('#featured-charities').append(card.getHTML());
		}
	}
}


// Constructor for SimpleCard Object
function SimpleCharityCard(heading, body, button) {
	this.cardHead = heading;
	this.cardBody = body;
	this.cardButton = button;

	var html = '';
	html += '<div class="card card-fixed">'+ 
	'<h3 class="card-heading simple">'+ this.cardHead +'</h3>'+
	'<div class="card-body">'+
	'<p>'+ this.cardBody +'</p>'+
	'<p>'+this.cardButton+'</p>'+
	'</div></div>';

	this.getHTML = function() {
		return html;
	};
}

// Constructor for DetailedCharityCard Object
function DetailedCharityCard(sub, isFeatured) {

	this.id = sub.id;
	this.slug = sub.slug;
	this.cardTitle = sub.name.titleize();
	this.donorCount = sub.donor_count;

	if (sub.tagline)
		this.cardBody = sub.tagline;
	else
		this.cardBody = '';
	
		

	/*
	this.isFeatured = isFeatured;
	this.pluralDonors = this.donorCount !== 1;
	this.donorString = this.pluralDonors ? ' individual donors' : ' individual donor';
	this.donationsCount = sub.global_balances.endowment_donations_count;
	this.totalBalance = sub.global_balances.endowment_balance.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
	this.totalDonations = sub.global_balances.endowment_total_donations.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
	this.myBalance = sub.my_balances.my_endowment_balance.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
	this.myDonations = sub.my_balances.my_donations_amount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
	this.isSubscribed = sub.my_balances.is_subscribed;
	*/

	var div = function(cssClass) {return '<div class="'+cssClass+'">';};

	var html = '';
	html += div('card card-fixed')+
	div('info')+
		div('title')+
			this.cardTitle+
		'</div><p><em>'+
			this.cardBody+
		'</em></p>'+
/*
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
	*/

	div('bottom')+
		'<button data-id="'+this.slug+'" class="btn btn-primary charity-details-btn">More Details</button> '+
	'</div>';

	this.getHTML = function() {
		return html;
	};
}

// ======================= //
// CHARITIES DETAILS UI    //
// THIS IS A SEPARATE PAGE //
// ======================= //

// (Re)Start Charities Detail UI
function onCharityDetails(charity) {

	// Subscription Info
	/*if(WebUI.activeSession()) {
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

	// Add social sharing text
	$('.twitter-share').attr('data-text', "Join me at giv2giv and support my charity \"" + charity.name + "\" #impinv #socint");
	$('.facebook-like').attr('href', "https://www.facebook.com/sharer.php?s=100p[url]=https://giv2giv.org/#charity/"+charity.slug+"&p[title]=Joinmeatgiv2giv.org&p[summary]=Joinmeathttps://giv2giv.org/#charity/" + charity.slug + "Supportmyendowment" + charity.name + "Thanks");
	$('.facebook-like').attr('data-href', "https://giv2giv.org/#charity/"+charity.slug);
	$('.linkedin-share').attr('href', "https://www.linkedin.com/shareArticle?mini=true&amp;url=https://giv2giv.org/#charity/"+charity.slug+"&amp;title=giv2giv.org");
	$('.linkedin-share').attr('data-url', "https://giv2giv.org/#charity/"+charity.slug);

//	subscribeSelectors();
	initCharitySocialShare();
	
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
						var $select = $('#subscribe-endowment-payment-accounts');
						$select.append('<option value='+ii+'>'+card.type+' - '+card.last4+' ('+card.exp_month+'/'+card.exp_year+')</option>');
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
*/

	// Header
	$('#charity-details-header').html(charity.name.titleize());
/*
	var scriptTag = document.createElement('script');
  scriptTag.setAttribute("type", "text/javascript");
  scriptTag.setAttribute("id", "giv2giv-script");
  scriptTag.setAttribute("data-charity-id", charity.id);
  scriptTag.setAttribute("data-theme", charity.theme);
  scriptTag.setAttribute("data-minimum-amount", charity.minimum_amount);
  scriptTag.setAttribute("data-minimum-passthru-percentage", charity.minimum_passthru_percentage);
  scriptTag.setAttribute("data-maximum_amount", charity.maximum_amount);
  scriptTag.setAttribute("data-maximum-passthru-percentage", charity.maximum_passthru_percentage);
  scriptTag.setAttribute("data-initial-amount", charity.initial_amount);
  scriptTag.setAttribute("data-initial-passthru", charity.initial_passthru);
  scriptTag.setAttribute("data-donor-add-fees", charity.donor_add_fees);
  scriptTag.setAttribute("src", "/widget/widget.js");



	// Finally, insert the script element into the div
	document.getElementById("giv2giv-script-div").appendChild(scriptTag);
*/

	if(charity.tags.length > 0) {
		$.each(charity.tags, function (k, tag) {
			$('#charity-tags').append('<li>'+tag + '</li>');
		});
	}
	else {
		$('#charity-tags').append('<li>None</li>');
	}

	if(charity.supporting_endowments.length > 0) {
		$.each(charity.supporting_endowments, function (k, endowment) {
			$('#supporting-endowments').append("<li><a href='/#endowment/"+endowment.slug+"''>"+endowment.name + "</a></li>");
		});
	}
	else {
	//TODO show pre-filled create modal
		$('#supporting-endowments').append('<li>None yet - <a href id=new_endowment>You should create one!</a></li>');
	}

	// Lead Description
	//$('#charity-details-description').html(charity.description);

	$('#charity-details-logo').attr('src', GLOBAL.SERVER_URL + '/logos/' + charity.slug +'.png');
	$('#charity-details-logo').css({"max-height":"100%","max-width":"100%"});
  
  $('#charity-logo-upload').html("");
			

	$('#charity-details-address').html(charity.address + "<br>" + charity.city + ", " + charity.state + " " + charity.zip);
	$('#charity-details-donor-count').html(charity.donor_count);
	$('#charity-details-pending-grants').html('$'+charity.pending_grants.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
	$('#charity-details-delivered-grants').html('$'+charity.delivered_grants.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
	tagline_missing_text = "No tagline yet. <a href='mailto:hello@giv2giv?subject=Charity Tagline Suggestion' target=_blank>Suggest one!</a>"
  description_missing_text = "No description yet. <a href='mailto:hello@giv2giv?subject=Charity Description Suggestion' target=_blank>Suggest one!</a>"

	$('#charity-tagline').html(!charity.tagline ? tagline_missing_text : charity.tagline);
	$('#charity-description').html(!charity.description ? description_missing_text : charity.description);



	MapsUI.start.dispatch([ charity ]);

/*
	if (charity.my_balances) {
		$('#charity-details-my-balance').html('$'+charity.my_balances.my_charity_balance.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
		$('#charity-details-my-donations-count').html(charity.my_balances.my_donations_count);
		$('#charity-details-my-grants-amount').html('$'+charity.my_balances.my_grants_amount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
	}
	else {
		$('#charity-details-my-balance').html('$0.00');
		$('#charity-details-my-donations-count').html('0');
		$('#charity-details-my-grants-amount').html('$0.00');
	}
	
	balanceGraph(charity.global_balances, $('#balanceHistory'), 'Global Balance History',	'charity_balance_history', 'balance');

	balanceGraph(charity.global_balances, $('#projectedBalance'), 'Projected Global Impact', 'projected_balance', 'balance');
*/

	

}

function initCharitySocialShare() {

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

// Reload jQuery Selectors
function charitySelectors() {
	log('CharitiesUI: Selectors');
	$('#refresh-featured-charities').off('click');
	$('#refresh-featured-charities').on('click', function(e) {
		$(this).find('i').addClass('fa-spin');
		fetchFeaturedCharities(function() {
			$('#refresh-featured-charities').find('i').removeClass('fa-spin');
			charitySelectors();
		});
		e.preventDefault();
	});

	// More Details Button
	$('.charity-details-btn').off();
	$('.charity-details-btn').on('click', function(e) {
		e.preventDefault();
		hasher.setHash('charity/' + $(this).attr('data-id'));
	});

}



/*	if($(this).data('select2')) {
		$('#add-endowment-charities').select2('destroy');
	}

	$('#add-endowment-charities').select2({
		placeholder: 'Search for a charity',
		multiple: true,
		minimumInputLength: 3,
		ajax: {
			url: GLOBAL.SERVER_URL + '/api/charity.json',
			dataType: 'json',
			quietMillis: 500,
			data: function (term, page) { // page is the one-based page number tracked by Select2
				var payload = {};
				payload.page = page;
				payload.per_page = 10;
				payload.query = term;
				if($('#charity-city').val().length > 0) {
					payload.city = $('#charity-city').val();
				}
				return payload;
			},
			results: function (data, page) {
				// var more = (page * 10) < data.total;
				// notice we return the value of more so Select2 knows if more results can be loaded
				// Loop Through Charities & build Results
				var results = [];
				if(data.message === undefined) {
					$.each(data, function(k, v) {
						log(v.charity);
						var charity = {};
						charity.id = v.charity.id;
						charity.text = v.charity.name + ' (' + v.charity.city + ', ' + v.charity.state + ')';
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
			hasher.setHash('endowment/'+data.endowment.id);
			growlSuccess('Successfully created your endowment. Now subscribe, and share your endowment to maximize your impact!');
		}).fail(function(data) {
			log(data);
			growlError('An error occured while adding this endowment.');
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
					$.each(data, function(k, v) {
						// @TODO: Warning: Magic
						var i = v[0];
						var ii = Object.keys(i);
						var iii = i[ii[0]];
						var c = iii.cards[0];
						var cc = c[0];
						var ccc = Object.keys(cc);
						var card = cc[ccc[0]];
						// Create Option
						var $select = $('#subscribe-endowment-payment-accounts');
						$select.append('<option value="'+ii+'">'+card.type+' - '+card.last4+' ('+card.exp_month+'/'+card.exp_year+')</option>');
					});
					// Show Modal
					$('#subscribe-endowment-modal').modal('show');
				}

			}).fail(function(){
				growlError("You can't subscribe until you set up a method of payment. <a href='" + WEB_URL + "/#donor'>Add a card</a> to get started");
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

*/
