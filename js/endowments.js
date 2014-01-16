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
	  success: function(data) {
	  	log(data);
	  	// did we get anything
	  	if(data.length == 0) {
	  		// Display not found card
	  		$("#sub-not-found-card").removeClass('hide');
	  	} else {
	  		// Parse Results Here
	  	}
	  	// Callback
			if(typeof callback === "function") {
	    	// Call it, since we have confirmed it is callable
	      callback();
	    }
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
	  },
	  success: function(data) {
	  	if(data.message == "Not found") {
	  		// Display not found card
	  		$("#featured-not-found-card").removeClass('hide');
	  	} else {
	  		// Display results
	  		log(data);
	  	}
	  	// Callback
			if(typeof callback === "function") {
	    	// Call it, since we have confirmed it is callable
	      callback();
	    }
	  }
	});
}