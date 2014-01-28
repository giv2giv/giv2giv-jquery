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
	// Public Router
	var publicRouter;

	// Login Bits
	// Display the login screen.
	var displayLogin = function(callback) {
		// Hide App Nav
		$("#app-nav").addClass("hide");
		// Show Public Nav
		$("#public-nav").removeClass("hide");
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
		// Show App Nav
		$("#app-nav").removeClass("hide");
		// Hide Public Nav
		$("#public-nav").addClass("hide");
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
		e.preventDefault();
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
						growlError("Incorrect Email or Password");
					}
					else {
						growlError(res.message);
						log("WebUI: Login Error - " + res.message);
					}
				}
			});
  	}).fail(function(data) {
			var res = JSON.parse(data.responseText);
			if(res.message == "unauthorized") {
				growlError("Incorrect Email or Password");
			} else if (res.message) {
				growlError(res.message);
				log("WebUI: Login Error - " + res.message);
			}
			else {
				$.each(res, function(key, value) {
  				growlError(key + ": " + value)
				});	
			}
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

	// Display Public Application View
	var displayPublicApplication = function(callback) {
		// Show App Panel
		$("#app-panel").removeClass("hide");
		// Show App Nav
		$("#public-nav").removeClass("hide");
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
			publicRouter.parse(window.location.pathname);
		} else {
			// We have a session cookie, set header & see if it's valid
			log("WebUI: Session Cookie found, checking session.");
			// Set Authorization Header
			$.ajaxSetup({
 				beforeSend: function(xhr, settings) {
	 				xhr.setRequestHeader("Authorization", "Token token=" + $.cookie('session'));
				}
			});
			// Get Donor Info (and check session as a result)
			$.get("https://api.giv2giv.org/api/donors.json").success(function(data) {
				// Valid Session
				log("WebUI: Valid session, loading application.");
				log("WebUI: Initial Page " + window.location.pathname);
				// Load Current URL
				crossroads.resetState();
				crossroads.parse(window.location.pathname);
				// Set Donor Name
				$("#donor-name").html(data.donor.name);
				hideLogin();
				// Display Application
				displayApplication();
			}).error(function(data) {
				if(data.statusText == "Unauthorized") {
					log("WebUI: Invalid session, resetting cookie & displaying Login.");
					$.removeCookie('session');
					publicRouter.parse(window.location.pathname);
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

  // Check if Session is Active
  // URL parameter is the URL to goto if Session is dead
  var activeSession = function() {
  	log("WebUI: Checking session.");
  	var status = false;
  	$.ajax({
		  type: 'POST',
		  url: 'https://api.giv2giv.org/api/sessions/ping.json',
		  async:false
		}).done(function(data) {
			status = true;
		}).fail(function(data) {
  		status = false;
  	});
  	return status;
  };

  // Router
  // Will Create proper routes based on Active Session
	var router = function(callback) {
		log("WebUI: Starting router.");
		// Ignore Router State (Same URL Loads)
		// crossroads.ignoreState = true;
		
		// Create Public Router
		publicRouter = crossroads.create();
		
		// Signup Route
		publicRouter.addRoute('/signup', function() {
			// Show Signup
			startLoad();
			// Set Nav Tab
			$("#signup-nav").addClass("active");
			// Hide Login Panel
			$("#login-panel").addClass("hide");
			// Clean & Show Sign Up
			$("#signup-name").val("");
			$("#signup-email").val("");
			$("#signup-password").val("");
			$("#signup-accept-terms").attr('checked', false);
			$("#signup-panel").removeClass("hide");
			stopLoad();
			displayPublicApplication();
		});

		// Public Endowment Page
		publicRouter.addRoute('/endowment/{id}', function(id) {
			startLoad();
			// Load Endowment Details First
			// Get Donor Info (and check session as a result)
			$.get("https://api.giv2giv.org/api/endowment/"+id+".json").done(function(data) {
				loadPage('/ui/endowment_details.html', function() {
					// Fill in jQuery Selectors
					History.replaceState(null, 'giv2giv - Details for ' + data.endowment.name, '/endowment/'+id);
					// Load JS
					EndowmentsUI.details.dispatch(data.endowment);
					stopLoad();
				});
			}).fail(function(data) {
				publicRouter.parse('/');
			}).always(function(data) {
				displayPublicApplication();
			});
		});

		publicRouter.addRoute('/{url}', function(url) {
			publicRouter.parse('/');
		});

		// Login
		publicRouter.addRoute('/', function(url) {
			// History
			History.replaceState(null, 'giv2giv - Login', '/');
			// Show Login Screen
			$("#signin-nav").addClass("active");
			startLoad();
			displayLogin();
			stopLoad();
		});

		// Now for "Private Routes"
		// Add Rule to Determine if we have Active Session. If not, pipe to public router
		// Dashboard Route
		var dashboardRoute = crossroads.addRoute('/');
		dashboardRoute.rules = {
			section : function(value, request, valuesObj) {
				return (activeSession());
			}
		};
		dashboardRoute.matched.add(function() {
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
		var endowmentRoute = crossroads.addRoute('/endowment/{id}');
		endowmentRoute.rules = {
			section : function(value, request, valuesObj) {
				return (activeSession());
			}
		};
		endowmentRoute.matched.add(function(id) {
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
		var donorRoute = crossroads.addRoute('/donor');
		donorRoute.rules = {
			section : function(value, request, valuesObj) {
				return(activeSession());
			}
		};
		donorRoute.matched.add(function() {
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
		var numbersRoute = crossroads.addRoute('/numbers');
		numbersRoute.rules = {
			section : function(value, request, valuesObj) {
				return(activeSession());
			}
		};
		numbersRoute.matched.add(function() {
			startLoad();
			loadPage('/ui/numbers.html', function() {
				$(".nav-link").siblings().removeClass("active");
				History.replaceState(null, 'giv2giv - Numbers', '/numbers');
				NumbersUI.start.dispatch();
				// Set Nav Tab
				$("#numbers-nav").addClass("active");
			});
		});

		// Not found route - send to Dashboard with Error
		crossroads.bypassed.add(function(request) {
			log("WebUI: Route not found.");
			if(activeSession()) {
				log("WebUI: Return to Dashboard.");
				crossroads.parse('/');
			} else {
				log("WebUI: Invalid Session, going public.");
				publicRouter.parse(window.location.href);
			}
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
		// Handle Nav Bar Clicks woof
		$(".nav-link a").on("click", function(e) {
			crossroads.parse($(this).attr('href'));
			e.preventDefault();
		});

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
			});
			log("WebUI: Init Complete");
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