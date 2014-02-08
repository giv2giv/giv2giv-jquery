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
  // Social Sharing Widget
  $('#social-share').share({
    networks: ['twitter','facebook','tumblr','pinterest','googleplus'],
    orientation: 'vertical',
    urlToShare: 'http://giv2giv.biscuitlabs.com/endowment/' + endowment.id,
    affix: 'right center',
    title: "giv2giv: " + endowment.name,
    description: endowment.description
  });

  // Selectors
  $("li a[href='#charities']").on('click', function(e) {
    // Hide Details Cards
    $("#endowment-charity-details").addClass("hide");
  });

  $("li a[href='#details']").on('click', function(e) {
    // Show Details Cards
    $("#endowment-charity-details").removeClass("hide");
  });

  // Header
  $("#endowment-details-header").html("Details for " + endowment.name);
  // Lead Description
  $("#endowment-details-description").html(endowment.description);
  $("#endowment-details-balance").html("$"+endowment.global_balances.endowment_balance.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
  $("#endowment-details-donations").html("$"+endowment.global_balances.endowment_donations.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
  $("#endowment-details-donations-count").html(endowment.global_balances.endowment_donations_count);
  $("#endowment-details-donor-count").html(endowment.global_balances.endowment_donor_count);
  $("#endowment-details-fees").html("$"+endowment.global_balances.endowment_fees.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
  $("#endowment-details-grants").html("$"+endowment.global_balances.endowment_grants.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
  $("#endowment-details-transaction-fees").html("$"+endowment.global_balances.endowment_transaction_fees.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));

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

  $("#add-endowment-charities").select2({
    placeholder: "Search for a charity",
    multiple: true,
    minimumInputLength: 3,
    ajax: {
      url: "https://api.giv2giv.org/api/charity.json",
      dataType: 'json',
      quietMillis: 100,
      data: function (term, page) { // page is the one-based page number tracked by Select2
        var payload = {};
        payload['page'] = page;
        payload['per_page'] = 10;
        payload['query'] = term;
        return payload;
      },
      results: function (data, page) {
        //var more = (page * 10) < data.total;
        // notice we return the value of more so Select2 knows if more results can be loaded
        // Loop Through Charities & build Results
        var results = new Array();
        $.each(data, function(k, v) {
          log(v.charity)
          var charity = {};
          charity.id = v.charity.id;
          charity.text = v.charity.name + " (" + v.charity.city + ", " + v.charity.state + ")";
          results.push(charity);
        });
        return {results: results};
      }
    }
  });

  // Go to Charity List
  $("#add-endowment-modal-save").off("click");
  $("#add-endowment-modal-save").on("click", function(e) {
    // Payload
    var payload = {};
    payload['name'] = $("#add-endowment-modal #endowment-name").val();
    payload['minimum_donation_amount'] = $("#add-endowment-modal #endowment-min-donation").val();
    payload['visibility'] = $("#add-endowment-modal input[name='visibility-radios']:checked").val();

    if($("#add-endowment-modal #endowment-description").val().length > 0) {
      payload['description'] = $("#add-endowment-modal #endowment-description").val();
    }
    payload['charities'] = new Array();
    // Get our Charity IDs in the proper format
    var charities = $("#add-endowment-charities").val().split(",");
    $.each(charities, function(k, v) {
      var charity = {};
      charity['id'] = v;
      payload['charities'].push(charity);
    })

    var request_payload = JSON.stringify(payload);
    log(request_payload);
    // Submit & Wait
    $.ajax({
       url: 'https://api.giv2giv.org/api/endowment.json',
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
      growlError("An error occured while adding this endowment.");
    });
  });

  // Add Endowment Button (when there's none)
  $(".add-endowment-btn").off("click");
  $(".add-endowment-btn").on("click", function(e) {
    // Clean & Show Modal
    $("#add-endowment-modal #endowment-name").val("");
    $("#add-endowment-modal #endowment-desc").val("");
    $("#add-endowment-modal").modal('show');
    e.preventDefault();
  });

  $("#add-endowment").off("click");
  $("#add-endowment").on("click", function(e) {
    // Clean & Show Modal
    $("#add-endowment-modal #endowment-name").val("");
    $("#add-endowment-modal #endowment-desc").val("");
    $("#add-endowment-modal").modal('show');
    e.preventDefault();
  });

  // Confirm Endowment Subscription
  $("#confirm-subscribe-endowment").off("click");
  $("#confirm-subscribe-endowment").on("click", function(e) {
    $btn = $(this);
    $btn.button('loading');
    var payload = {};
    payload['amount'] = $("#subscribe-endowment-modal #subscribe-endowment-donation").val();
    payload['endowment_id'] = $(this).attr("data-id");
    var request_payload = JSON.stringify(payload);
    $.ajax({
      url: "https://api.giv2giv.org/api/donors/payment_accounts/"+$("#subscribe-endowment-payment-accounts").val()+"/donate_subscription.json",
      method: 'POST',
      contentType: "application/json",
      dataType:"json",
      data: request_payload
    }).done(function(data) {
      growlSuccess("Donation scheduled. Thank you! You'll see your endowment balance update in a minute or two.")
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
      url: "https://api.giv2giv.org/api/endowment/" + $(this).attr("data-id") + ".json",
      method: 'GET'
    }).done(function(data) {
      // Clean & Prep Modal
      $("#subscribe-endowment-modal #subscribe-endowment-payment-accounts").html("");
      $("#subscribe-endowment-modal #subscribe-endowment-donation").val("");
      $("#subscribe-endowment-modal #subscribe-endowment-header").html("Subscribe to " + data.endowment.name);
      $("#subscribe-endowment-modal #subscribe-endowment-min-donation").html("$" + data.endowment.minimum_donation_amount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
      // Now Get Payment Accounts
      $.ajax({
        url: 'https://api.giv2giv.org/api/donors/payment_accounts.json',
        method: 'GET'
      }).done(function(data) {
        if(data.length == 0) {
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
      url: "https://api.giv2giv.org/api/endowment/" + $(this).attr("data-id") + ".json",
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
      url: "https://api.giv2giv.org/api/donors/payment_accounts/" + $("#confirm-unsubscribe-endowment").attr("data-id") + "/cancel_subscription.json",
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
    url: 'https://api.giv2giv.org/api/donors/subscriptions.json',
    method: 'GET',
    dataType: "json",
    contentType: "application/json"
  }).done(function(data) {
    $("#sub-endowments").html("");
    // did we get anything
    if(data.length == 0) {
      // Display not found card
      var card = "<div class='span3'><div class='card'><h2 class='card-heading simple'>No Subscriptions</h2>";
      card += "<div class='card-body'><p>You have not subscribed to any endowments yet.";
      card += "</p><p><a class='btn btn-success add-endowment-btn' href='#'>Create Endowment</a></p></div></div></div>";
      $("#sub-endowments").append(card);
    } else {
      // Parse Results Here
      // First Row
      var row = "<div class='row-fluid'>";
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
        
        // # of Donors
        if(sub.endowment_donor_count == 1) {
          var donor_string = "donor";
        } else {
          var donor_string = "donors";
        }  
    
        body += "<div class='desc'><strong>"+sub.endowment_donor_count+"</strong> unique "+donor_string+".</div>";
        // Endowment Balance
        body += "<div class='desc'>Endowment Balance: <strong>$"+sub.endowment_total_balance.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')+"</strong>.</div>";    
        
        body += "<div class='desc'>Total I have donated: <strong>$"+sub.endowment_donor_total_donations.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')+"</strong></div>";
        // Endowment Balance & Donations
        body += "<div class='desc'>Total everyone has donated: <strong>$"+sub.endowment_total_donations.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')+"</strong></div>";
        // Donation Amount
        body += "<div class='desc'>Minimum Donation Amount: <strong>$"+sub.endowment_donation_amount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')+" ("+sub.endowment_donation_type+")</strong></div>";
        // Donor Balance
        body += "<div class='desc'>My Current Balance: <strong>$"+sub.endowment_donor_current_balance.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')+"</strong>.</div>";

        // Action Buttons
        var actions = "<div class='bottom'><button data-id='"+sub.endowment_id+"' class='btn btn-primary endowment-details-btn'>More Details</button> ";
        // Subscription Check
        actions += "<button data-id='"+sub.endowment_id+"' class='btn btn-danger endowment-unsubscribe-btn'>Unsubscribe</button></div>";

        
        var card_html = "<div class='span3'><div class='card endowment'>"+body+"</div>"+actions+"</div></div>";
        // Add the Card to the Row
        row += card_html;
        // New Row Check
        var new_row_check = (k + 1) % 4;
        if(new_row_check == 0) {
          row += "</div>";
          // Append Current Row
          $("#sub-endowments").append(row);
          // New Row
          row = "<div class='row-fluid'>";
        }
        if(data.length == (k + 1)) {
          row += "</div>";
          // Append Current Row
          $("#sub-endowments").append(row);
        }
      });
      // Finally Add the Create Endowment Card
      // Header
      var add_body = "<div class='info'><div class='title'>Create New Endowment</div>";
      // Description
      add_body += "<p><em>Ready to make a difference?</em></p>";
      add_body += "<div class='bottom'><button id='add-endowment' class='btn btn-success'>Create Endowment</button></div>";
      var card = "<div class='span3'><div class='card endowment'>"+add_body+"</div></div>";
      $("#sub-endowments .row-fluid:last").append(card);
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
  // Clear Old Data
  log("Fetching featured endowments");
  $.ajax({
    url: 'https://api.giv2giv.org/api/endowment.json',
    method: 'GET',
    data: {
      page: '1',
      per_page: '8'
    },
    dataType: "json",
    contentType: "application/json"
  }).done(function(data) {
    $("#featured-endowments").html("");
    if(data.message == "Not found") {
      // Display not found card
      var card = "<div class='span3'><div class='card'><h2 class='card-heading simple'>No Endowments Yet.</h2>";
      card += "<div class='card-body'><p>There are currently no giv2giv endowments yet.";
      card += "</p><p><a class='btn btn-success add-endowment-btn' href='#'>Create Endowment</a></p></div></div></div>";
      $("#featured-endowments").append(card);
    } else {
      // Parse Results Here
      var endowments = data.endowments;
      // First Row
      var row = "<div class='row-fluid'>";
      $.each(endowments, function(k, v) {
        // Now build a card
        log(v);
        var sub = v;
        var body = "<div class='info'><div class='title'>"+sub.name+"</div>";
        // Description
        body += "<p><em>"+sub.description+"</em></p>";
        
        // # of Donors
        if(sub.global_balances.endowment_donor_count == 1) {
          var donor_string = "donor";
        } else {
          var donor_string = "donors";
        }

        body += "<div class='desc'><strong>"+sub.global_balances.endowment_donor_count+"</strong> unique "+donor_string+".</div>";
        body += "<div class='desc'><strong>"+sub.my_balances.my_donations_count+"</strong> unique donations.</div>";
        // Endowment Balance
        body += "<div class='desc'>Endowment Balance: <strong>$"+sub.global_balances.endowment_balance.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')+"</strong>.</div>";
        // Donation Amount
        body += "<div class='desc'>Minimum Donation Amount: <strong>$"+sub.minimum_donation_amount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')+" (per-month)</strong></div>";
        // Endowment Balance & Donations
        body += "<div class='desc'>Total everyone has donated: <strong>$"+sub.global_balances.endowment_donations.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')+"</strong></div>";
        // Donor Balance
        body += "<div class='desc'>My Current Balance: <strong>$"+sub.my_balances.my_endowment_balance.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')+"</strong>.</div>";

        // Action Buttons
        var actions = "<div class='bottom'><button data-id='"+sub.id+"' class='btn btn-primary endowment-details-btn'>More Details</button> ";
        // Subscription Check
        if(sub.my_balances.my_subscription_id == "") {
          actions += "<button data-id='"+sub.id+"' class='btn btn-success endowment-subscribe-btn'>Subscribe</button></div>";
        } else {
          actions += "<button data-id='"+sub.id+"' class='btn btn-danger endowment-unsubscribe-btn'>Unsubscribe</button></div>";
        }
        var card_html = "<div class='span3'><div class='card endowment'>"+body+"</div>"+actions+"</div></div>";
        row += card_html;
        // New Row Check
        var new_row_check = (k + 1) % 4;
        if(new_row_check == 0) {
          row += "</div>";
          // Append Current Row
          $("#featured-endowments").append(row);
          // New Row
          row = "<div class='row-fluid'>";
        }
        if(endowments.length == (k + 1)) {
          row += "</div>";
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