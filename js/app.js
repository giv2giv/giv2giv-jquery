// WebUI Application
// Michael Thomas, 2014

// Setup Stripe
var stripe_pub_key = 'pk_test_d678rStKUyF2lNTZ3MfuOoHy';
Stripe.setPublishableKey(stripe_pub_key);

// Awesome Logging
// Only display console log output in debug mode, else nothing.
// @todo - Send serious logs to server?
var debug = true;

log = function () {
  if (debug && console && typeof console.log === 'function') {
    for (var i = 0, ii = arguments.length; i < ii; i++) {
      console.log(arguments[i]);
    }
  }
}

// Bootstrap Growl Helpers
// Growl Error
function growlError(message) {
	$.bootstrapGrowl(message, {
	  ele: 'body', // which element to append to
	  type: 'error', // (null, 'info', 'error', 'success')
	  offset: {from: 'top', amount: 20}, // 'top', or 'bottom'
	  align: 'right', // ('left', 'right', or 'center')
	  width: 'auto', // (integer, or 'auto')
	  delay: 5000,
	  allow_dismiss: true,
	  stackup_spacing: 10 // spacing between consecutively stacked growls.
	});
}

// Growl Success
function growlSuccess(message) {
	$.bootstrapGrowl(message, {
	  ele: 'body', // which element to append to
	  type: 'success', // (null, 'info', 'error', 'success')
	  offset: {from: 'top', amount: 20}, // 'top', or 'bottom'
	  align: 'right', // ('left', 'right', or 'center')
	  width: 'auto', // (integer, or 'auto')
	  delay: 5000,
	  allow_dismiss: true,
	  stackup_spacing: 10 // spacing between consecutively stacked growls.
	});
}

// Main Application
var WebUI = function() {
	// Login Bits
	// Display the login screen.
	var displayLogin = function(callback) {
		// Hide Header
		$("#app-nav").addClass("hide");
		// Set Title
		document.title = "giv2giv - Login";
		// Show Login Panel
		$("#login-panel").removeClass("hide");

		// Callback
		if(typeof callback === "function") {
    	// Call it, since we have confirmed it is callable
      callback();
    }
	};

	// Hide the login screen
	var hideLogin = function(callback) {
		// Show Header
		$("#app-nav").removeClass("hide");
		// Title is set in Load Page
		// Hide Login Panel
		$("#login-panel").addClass("hide");
		// Clean up form here.
		$("#signin-email").val("");
		$("#signin-password").val("");

		// Callback
		if(typeof callback === "function") {
    	// Call it, since we have confirmed it is callable
      callback();
    }
	};

	// Logo Reload
	$("#logo-main").on("click", function(e) {
		crossroads.resetState();
		crossroads.parse(window.location.pathname);
		e.preventDefault();
	});

	// Endowment Search
	$('#endowment-search').typeahead({
		remote: {
			name: 'endowments',
			url: "https://api.giv2giv.org/api/endowment.json?page=1&per_page=5&query=%QUERY",
			filter: function(response) {
				var results = [];
				log(response);
				$.each(response.endowments, function(key, value) {
					var endowment = new Object();
					log(value);
					endowment['id'] = value.id;
					endowment['value'] = value.name;
					endowment['desc'] = value.description;
					results.push(endowment);
				});
				return results;
			},
			maxParallelRequests: 1,
			rateLimitWait: 500
		},
		template: [                                                                 
  		'<p>{{value}} - {{desc}}</p>'                         
		],
		engine: Hogan,
		limit: 5
	}).on('typeahead:selected', function(obj, datum, name) {
 		// Go to Endowment
 		crossroads.parse("/endowment/" + datum.id);
	});

	// Show signup panel
	$("#display-signup-btn").on("click", function(e) {
		// Hide Login Panel
		$("#login-panel").addClass("hide");
		// Clean & Show Sign Up
		$("#signup-name").val("");
		$("#signup-email").val("");
		$("#signup-password").val("");
		$("#signup-accept-terms").attr('checked', false);
		$("#signup-panel").removeClass("hide");
		e.preventDefault();
	});

	// Terms Button
	$("#terms-btn").on("click", function(e) {
		$("#terms-div").load("/ui/terms.html", function() {
			$("#terms-modal").modal('show');
		});
	});

	// Hide sign-up & return to login
	$("#cancel-signup-btn").on("click", function(e) {
		$("#signup-panel").addClass("hide");
		$("#login-panel").removeClass("hide");
		e.preventDefault();
	});

	// Signup Form
	$("#signup-frm").on("submit", function(e) {
		var payload = {};
		payload['email'] = $("#signup-email").val();
		payload['password'] = $("#signup-password").val();
		payload['name'] = $("#signup-name").val();
		payload['accepted_terms'] = $("#signup-accept-terms").prop('checked')

		var request = JSON.stringify(payload);
		$.ajax({
  		url: 'https://api.giv2giv.org/api/donors.json',
  		method: 'POST',
  		data: request,
  		dataType: "json",
  		contentType: "application/json"
  	}).done(function(data) {
  		// Success, now cheat and login
  		var payload = JSON.stringify({ "email" : $("#signup-email").val(), "password" : $("#signup-password").val() });
			$.ajax({
				url: "https://api.giv2giv.org/api/sessions/create.json",
				type: "POST",
				data: payload,
				contentType: "application/json",
				dataType:"json",
				success: function (data) {
					$.ajaxSetup({
			 			beforeSend: function(xhr, settings) {
				 			xhr.setRequestHeader("Authorization", "Token token=" + data.session.session.token);
			  		}
			 		});
			 		// Hide Signup
			 		$("#signup-panel").addClass("hide");
			 		// Set Cookie
			 		$.cookie('session', data.session.session.token);
				  startApplication();
				},
				error: function(data) {
					var res = JSON.parse(data.responseText);
					if(res.message == "unauthorized") {
						$("#login-message").html("Incorrect Email or Password");
					} else {
						log("WebUI: Login Error - " + res.message);
					}
				}
			});
  	}).fail(function(data) {
  		log(data);
  	});
		e.preventDefault();
	});

	// Login Form
	$("#login-frm").on("submit", function(e) {
		// Build Payload
		var payload = JSON.stringify({ "email" : $("#signin-email").val(), "password" : $("#signin-password").val() });
		$.ajax({
			url: "https://api.giv2giv.org/api/sessions/create.json",
			type: "POST",
			data: payload,
			contentType: "application/json",
			dataType:"json",
			success: function (data) {
				$.ajaxSetup({
		 			beforeSend: function(xhr, settings) {
			 			xhr.setRequestHeader("Authorization", "Token token=" + data.session.session.token);
		  		}
		 		});
		 		// Set Cookie
		 		$.cookie('session', data.session.session.token);
			  startApplication();
			},
			error: function(data) {
				var res = JSON.parse(data.responseText);
				if(res.message == "unauthorized") {
					$("#login-message").html("Incorrect Email or Password");
				} else {
					log("WebUI: Login Error - " + res.message);
				}
			}
		});
		e.preventDefault();
	});

	// Handle Logout Button
	$("#logout-btn").on("click", function(e) {
		log("WebUI: Logout.");
		$.ajax({
			url: "https://api.giv2giv.org/api/sessions/destroy.json",
			type: "POST",
			contentType: "application/json",
			dataType:"json",
			success: function (data) {
		 		// Delete Cookie
		 		$.removeCookie('session');
			  // Reload Page. Ensures everything is clear & gets around History bug /elegantly/
			  location.pathname = '/';
			}
		});
		e.preventDefault();
	});

	// Application Bits
	// Display Application
	var displayApplication = function(callback) {
		// Show App Panel
		$("#app-panel").removeClass("hide");
		// Show App Nav
		$("#app-nav").removeClass("hide");
		// Callback
		if(typeof callback === "function") {
    	// Call it, since we have confirmed it is callable
      callback();
    }
	};

	// Start Application
	// This is only loaded on full page refresh or first visit
	var startApplication = function(callback) {
		log("WebUI: Started Application");
		if($.cookie('session') == undefined) {
			log("WebUI: No Session Cookie found, displaying Login.");
			displayLogin();
			stopLoad();
		} else {
			// We have a session cookie, set header & see if it's valid
			log("WebUI: Session Cookie found, checking session.");
			// Set Header
			$.ajaxSetup({
 				beforeSend: function(xhr, settings) {
	 				xhr.setRequestHeader("Authorization", "Token token=" + $.cookie('session'));
				}
			});
			// Get Donor Info (and check session as a result)
			$.get("https://api.giv2giv.org/api/donors.json").success(function(data) {
				log("WebUI: Valid session, loading application.");
				log("WebUI: Initial Page " + window.location.pathname);
				// Load Current URL
				crossroads.parse(window.location.pathname);
				// Set Donor Name
				$("#donor-name").html(data.donor.name);
				hideLogin();
				// Display Application
				displayApplication();
			}).error(function(data) {
				if(data.statusText == "Unauthorized") {
					log("WebUI: Invalid session, resetting cookie & displaying Login.");
					displayLogin();
					stopLoad();
				}
			});
		}
		if(typeof callback === "function") {
    	// Call it, since we have confirmed it is callable
      callback();
    }
	};

	// Start Loading
  var startLoad = function() {
  	log("WebUI: Start Loader");
    $('#loading').removeClass("hide");
  };

  // Stop Loading
  var stopLoad = function() {
  	log("WebUI: Stop Loader");
    $('#loading').addClass("hide");
  };

  // Setup App Router
  // Note: Sub routing (like /endowments/1) handled in modules.
	var router = function(callback) {
		log("WebUI: Starting router.");

		// Handle Nav Bar Clicks woof
		$(".nav-link a").on("click", function(e) {
			if(!$(this).parent().hasClass("active")) {
				crossroads.parse($(this).attr('href'));
			}
			e.preventDefault();
		});

		// Routes
		// Dashboard Route
		crossroads.addRoute('/', function() {
			startLoad();
			loadPage('/ui/endowments.html', function() {
				// Remove old active tabs
				$(".nav-link").siblings().removeClass("active");
				History.replaceState(null, 'giv2giv - Endowments', '/');
				EndowmentsUI.start.dispatch();
				// Set Nav Tab
				$("#endowments-nav").addClass("active");
			});
		});

		// Endowment Details Route
		crossroads.addRoute('/endowment/{id}', function(id) {
			startLoad();
			// Load Endowment Details First
			// Get Donor Info (and check session as a result)
			$.get("https://api.giv2giv.org/api/endowment/"+id+".json").success(function(data) {
				loadPage('/ui/endowment_details.html', function() {
					// Fill in jQuery Selectors
					History.replaceState(null, 'giv2giv - Details for ' + data.endowment.name, '/endowment/'+id);
					// Load JS
					EndowmentsUI.details.dispatch(data.endowment);
					// Set Nav Tab
					$("#endowments-nav").addClass("active");
					stopLoad();
				});
			}).error(function(data) {
				growlError("There was an error loading the Endowment Details.");
				crossroads.resetState();
				stopLoad();
			});
		});

		// Donor Route
		crossroads.addRoute('/donor', function() {
			startLoad();
			loadPage('/ui/donor.html', function() {
				$(".nav-link").siblings().removeClass("active");
				History.replaceState(null, 'giv2giv - Donor', '/donor');
				// Load JS
				DonorUI.start.dispatch();
				// Set Nav Tab
				$("#donor-nav").addClass("active");
			});
		});

		// Numbers Route
		crossroads.addRoute('/numbers', function() {
			startLoad();
			loadPage('/ui/numbers.html', function() {
				$(".nav-link").siblings().removeClass("active");
				History.replaceState(null, 'giv2giv - Numbers', '/numbers');
				NumbersUI.start.dispatch();
				// Set Nav Tab
				$("#numbers-nav").addClass("active");
			});
		});

		// Callbacks
		if(typeof callback === "function") {
    	// Call it, since we have confirmed it is callable
      callback();
    }
	};

	// Load HTML Page
	function loadPage(url, callback) {
		log("WebUI: Loading Page HTML: " + url);
		$.get(url, function (data) {
			log("WebUI: Loaded page.")
			$("#app-panel").html(data);
			reloadUI();
		}).fail(function(data) {
			log("WebUI: Failed to load page.");
		}).always(function(data) {
			// Callback
			if(typeof callback === "function") {
	  		// Call it, since we have confirmed it is callable
	    	callback();
	  	}
		});
	}

	// Reload UI
	// Some jQuery Selectors can't delegate & need to be applied to dynamic HTML
	function reloadUI() {
		// Initialize tabs
		$('[data-toggle="tabs"] a').click(function (e) { e.preventDefault(); $(this).tab('show'); });
	}

  // Finally expose bits
	return {
		init: function () {
			// History Adapter
			log("WebUI: Init Start");
			router(function() {
				startApplication();
				log("WebUI: Init Complete");
			});
		}, startLoad: function () {
			startLoad();
		}, stopLoad: function () {
			stopLoad();
		}, showAlert: function(type, message, timeout) {
			showAlert(type, message, timeout);
		}
	};
} ();

// DOM Loaded
$(function() {
	WebUI.init();
});