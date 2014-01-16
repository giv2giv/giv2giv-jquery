// Endowments UI
// Michael Thomas, 2014

// Signal Hook
var EndowmentsUI = {
	start : new signals.Signal() 
};

// Add Listener
EndowmentsUI.start.add(onStart);

// (Re)Start Endowments UI
function onStart() {
	WebUI.startLoad();
	// Load Featured Endowments
	fetchFeaturedEndowments(function() {
		// Fetch Subscribed Endowments
		fetchSubscribedEndowments(function() {
			WebUI.stopLoad();
		});
	});
}

// Get Subscribed Endowments
function fetchSubscribedEndowments(callback) {
	$.ajax({
	  url: 'https://api.giv2giv.org/api/donors/subscriptions.json',
	  method: 'GET',
	}).done(function(data) {
  	log(data);
  	// did we get anything
  	if(data.length == 0) {
  		// Display not found card
  		$("#sub-not-found-card").parent().removeClass('hide');
  	} else {
  		// Parse Results Here
  		$.each(data, function(k, v) {
  			var i = v[0];
  			// Get Object
  			var ii = Object.keys(i);
  			var sub = i[ii[0]];
  			log(sub);
  			// Now Build A Card
  			// Start Body & Name
  			var body = "<div class='info'><div class='title'>"+sub.endowment_name+"</div>";
  			// Donation Amount
  			body += "<div class='desc'>Donation Amount: <strong>$"+sub.endowment_donation_amount+" ("+sub.endowment_donation_type+")</strong></div>";
  			// # of Donors
  			if(sub.endowment_donor_count == 1) {
  				var donor_string = "donor";
  			} else {
  				var donor_string = "donors";
  			}
  			body += "<div class='desc'><strong>"+sub.endowment_donor_count+"</strong> "+donor_string+".</div>";
  			// Donor Balance
  			body += "<div class='desc'>My Balance: <strong>$"+sub.endowment_donor_current_balance+"</strong>.</div>";
  			body += "<div class='desc'><strong>"+sub.endowment_donor_total_donations+"</strong> donations.</div>";
  			// Endowment Balance & Donations
  			body += "<div class='desc'>Endowment Balance: <strong>$"+sub.endowment_total_balance+"</strong>.</div>";
  			body += "<div class='desc'><strong>"+sub.endowment_total_donations+"</strong> total donations.</div>";
  			// Action Buttons
  			var actions = "<div class='bottom'><button class='btn btn-success'>More Details</button> <button class='btn btn-danger'>Unsubscribe</button></div>";
  			var card_html = "<div class='span3'><div class='card hovercard'>"+body+"</div>"+actions+"</div></div>";
  			// Add the Card
  			var $card = $("#sub-endowments").append(card_html);
  		});
  	}
	}).fail(function(data) {
	  log(data);
	  growlError("Opps! An error occured while loading your Subscribed Endowments.");
	}).always(function(data) {
		// Callbacks
		if(typeof callback === "function") {
    	// Call it, since we have confirmed it is callable
      callback();
    }
	});
}

// Get Featured Endowments
function fetchFeaturedEndowments(callback) {
	$.ajax({
	  url: 'https://api.giv2giv.org/api/endowment.json',
	  method: 'GET',
	  data: {
	    page: '1',
	    per_page: '10'
	  }
	}).done(function(data) {
  	if(data.message == "Not found") {
  		// Display not found card
  		$("#featured-not-found-card").removeClass('hide');
  	} else {
  		// Display results
  		log(data);
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