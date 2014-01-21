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
      endowmentSelectors();
			WebUI.stopLoad();
		});
	});
}

// Reload jQuery Selectors
function endowmentSelectors() {
  log("EndowmentsUI: Selectors");

  $("#add-endowment-modal-save-and-continue").on("click", function(e) {
    // Payload
    var payload = {};
    payload['name'] = $("#add-endowment-modal #endowment-name").val();
    payload['minimum_donation_amount'] = $("#add-endowment-modal #endowment-min-donation").val();
    payload['visibility'] = $("#add-endowment-modal input[name='visibility-radios']:checked").val();

    if($("#add-endowment-modal #endowment-description").val().length > 0) {
      payload['description'] = $("#add-endowment-modal #endowment-description").val();
    }
    var request_payload = JSON.stringify(payload);
    // Submit & Wait
    $.ajax({
      url: 'https://api.giv2giv.org/api/endowment.json',
      type: "POST",
      data: request_payload,
      contentType: "application/json",
      dataType: "json"
    }).done(function(data) {
      log(data);
      // Show Next Panel
      $("#add-endowment-step-one").addClass("hide");
      $("#add-endowment-step-two").removeClass("hide");
    }).fail(function(data) {  
      log(data.responseText);
    });
  });

  $("#add-endowment").on("click", function(e) {
    // Clean & Show Modal
    $("#add-endowment-modal #endowment-name").val("");
    $("#add-endowment-modal #endowment-desc").val("");
    $("#add-endowment-modal").modal('show');
    e.preventDefault();
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
        // Description
        body += "<p><em>"+sub.endowment_description+"</em></p>";
  			// Donation Amount
  			body += "<div class='desc'>Donation Amount: <strong>$"+sub.endowment_donation_amount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')+" ("+sub.endowment_donation_type+")</strong></div>";
  			// # of Donors
  			if(sub.endowment_donor_count == 1) {
  				var donor_string = "donor";
  			} else {
  				var donor_string = "donors";
  			}
        // Endowment Balance
        body += "<div class='desc'>Endowment Balance: <strong>$"+sub.endowment_total_balance.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')+"</strong>.</div>";
  			body += "<div class='desc'><strong>"+sub.endowment_donor_count+"</strong> "+donor_string+".</div>";
  			// Donor Balance
  			body += "<div class='desc'>My Balance: <strong>$"+sub.endowment_donor_current_balance.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')+"</strong>.</div>";
  			body += "<div class='desc'><strong>"+sub.endowment_donor_total_donations+"</strong> donations.</div>";
  			// Endowment Balance & Donations
  			body += "<div class='desc'><strong>"+sub.endowment_total_donations+"</strong> total donations.</div>";
  			// Action Buttons
  			var actions = "<div class='bottom'><button class='btn btn-success'>More Details</button> <button class='btn btn-danger'>Unsubscribe</button></div>";
  			var card_html = "<div class='span3'><div class='card endowment'>"+body+"</div>"+actions+"</div></div>";
  			// Add the Card
  			$("#sub-endowments").append(card_html);
  		});
      // Finally Add the Create Endowment Card
      // Header
      var add_body = "<div class='info'><div class='title'>Create New Endowment</div>";
      // Description
      add_body += "<p><em>Ready to make a difference?</em></p>";
      add_body += "<div class='bottom'><button id='add-endowment' class='btn btn-success'>Create Endowment</button></div>";
      var card = "<div class='span3'><div class='card endowment'>"+add_body+"</div></div>";
      $("#sub-endowments").append(card);
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
      // @todo - Take out of row & add via code here - Spans won't fill page otherwise.
  		$("#featured-not-found-card").removeClass('hide');
  	} else {
      // Parse Results Here
      var endowments = data.endowments;
      $.each(endowments, function(k, v) {
        // Now build a card
        var sub = v;
        var body = "<div class='info'><div class='title'>"+sub.name+"</div>";
        // Description
        body += "<p><em>"+sub.description+"</em></p>";
        // Donation Amount
        body += "<div class='desc'>Donation Amount: <strong>$"+sub.minimum_donation_amount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')+" (per-month)</strong></div>";
        // # of Donors
        if(sub.endowment_donor_count == 1) {
          var donor_string = "donor";
        } else {
          var donor_string = "donors";
        }
        // Endowment Balance
        body += "<div class='desc'>Endowment Balance: <strong>$"+sub.global_balances.endowment_balance.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')+"</strong>.</div>";
        body += "<div class='desc'><strong>"+sub.endowment_donor_count+"</strong> "+donor_string+".</div>";
        // Donor Balance
        body += "<div class='desc'>My Balance: <strong>$"+sub.my_balances.my_endowment_balance.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')+"</strong>.</div>";
        body += "<div class='desc'><strong>"+sub.my_balances.my_donations_count+"</strong> donations.</div>";
        // Endowment Balance & Donations
        body += "<div class='desc'><strong>"+sub.global_balances.endowment_donations+"</strong> total donations.</div>";
        // Action Buttons
        var actions = "<div class='bottom'><button class='btn btn-success'>More Details</button> <button class='btn btn-danger'>Unsubscribe</button></div>";
        var card_html = "<div class='span3'><div class='card endowment'>"+body+"</div>"+actions+"</div></div>";
        // Add the Card
        var $card = $("#featured-endowments").append(card_html);
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