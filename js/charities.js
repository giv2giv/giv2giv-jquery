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
CharitiesUI.details.add(onDetails);
//EndowmentsUI.subscriptions.add(onSubscriptions);


// (Re)Start Charities UI
function onStart() {
	// Load Featured Charities
	fetchFeaturedCharities(function() {
		charitySelectors();
		
	});
	initSocialShare();
}

// Get Featured Charities
function fetchFeaturedCharities(callback) {
	// Clear Old Data
	log('Fetching featured charities');
	$.ajax({
		url: GLOBAL.SERVER_URL + '/api/charity.json',
		method: 'GET',
		data: {
			page: '1',
			per_page: '4'
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
		card = new SimpleCard(
			'Oops',
			'There was a problem loading featured charities.',
			'Sorry!');
		$('#featured-charities').append(card.getHTML());
	} else {
		// Parse Results Here
		var charities = data.charities;
		for (var i = 0; i < charities.length; i++) {
			card = new DetailedCard(charities[i], true);
			$('#featured-charities').append(card.getHTML());
		}
	}
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
	'<p>'+this.cardButton+'</p>'+
	'</div></div>';

	this.getHTML = function() {
		return html;
	};
}

// Constructor for DetailedCard Object
function DetailedCard(sub, isFeatured) {
	
	this.id = sub.id;
	this.slug = sub.slug;
	this.cardTitle = sub.name;
	this.cardBody = sub.description;
	/*
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
		'<button data-id="'+this.slug+'" class="btn btn-primary charity-details-btn">More Details</button> ';
/*			if (this.isSubscribed) {
				html+='<button data-id="'+this.id+'" class="btn btn-danger endowment-unsubscribe-btn">Unsubscribe</button>';
			} else {
				html+='<button data-id="'+this.id+'" class="btn btn-success endowment-subscribe-btn">Subscribe</button>';
			}*/html+=
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
function onDetails(charity) {
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
	}*/

	// Add social sharing text
	$('.twitter-share').attr('data-text', "Join me at giv2giv and support my charity \"" + charity.name + "\" #impinv #socint");
	$('.facebook-like').attr('href', "https://www.facebook.com/sharer.php?s=100p[url]=https://giv2giv.org/#charity/"+charity.slug+"&p[title]=Joinmeatgiv2giv.org&p[summary]=Joinmeathttps://giv2giv.org/#charity/" + charity.slug + "Supportmyendowment" + charity.name + "Thanks");
	$('.facebook-like').attr('data-href', "https://giv2giv.org/#charity/"+charity.slug);
	$('.linkedin-share').attr('href', "https://www.linkedin.com/shareArticle?mini=true&amp;url=https://giv2giv.org/#charity/"+charity.slug+"&amp;title=giv2giv.org");
	$('.linkedin-share').attr('data-url', "https://giv2giv.org/#charity/"+charity.slug);

//	subscribeSelectors();
	initSocialShare();

/*
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
	$('#charity-details-header').html(charity.name);
	// Lead Description
	$('#charity-details-description').html(charity.description);
	$('#charity-details-donor-count').html(charity.global_balances.charity_donor_count);
	$('#charity-details-grants').html('$'+charity.global_balances.charity_grants.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
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

	MapsUI.start.dispatch(charity.charities);
*/
}

function initSocialShare() {

	Socialite.load('.social-buttons');

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