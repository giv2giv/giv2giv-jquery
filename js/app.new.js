// WebUI Application
// Michael Thomas, 2014

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

	// Login Form
	$("#login-frm").on("submit", function(e) {
		// Build Payload
		var payload = JSON.stringify({ "email" : $("#signin-email").val(), "password" : $("#signin-password").val() });
		log(payload);
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
			 	hideLogin();
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
 					log($.cookie('session'));
	 				xhr.setRequestHeader("Authorization", "Token token=" + $.cookie('session'));
				}
			});
			// Get Donor Info (and check session as a result)
			$.get("https://api.giv2giv.org/api/donors.json").success(function(data) {
				// Load Dashboard (routing)
				log("WebUI: Valid session, loading application.");
				log("WebUI: Parsing page " + window.location.pathname);
				
				crossroads.parse(window.location.pathname);
				// Set Donor Name
				$("#donor-name").html(data.donor.name);
				// Display Application
				displayApplication(function() {
					stopLoad();
				});
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

	// End Application
	var endApplication = function(message, callback) {
		message = typeof message !== 'undefined' ? message : "";
		// Clear existing data in Application Container
		$("#app-panel").html("");
		$('#app-panel').addClass('hide');
		$('#login-panel').removeClass('hide');

		// Callback
		if(typeof callback === "function") {
    	// Call it, since we have confirmed it is callable
      callback();
    }
	};

	// Start Loading
  var startLoad = function() {
  	log("WebUI: Start Loader");
    $('.logo-loading').show();
  };

  // Stop Loading
  var stopLoad = function() {
  	log("WebUI: Stop Loader");
    $('.logo-loading').hide();
  };

  // Setup App Router
  // Note: Sub routing (like /endowments/1) handled in modules.
	var router = function() {
		log("WebUI: Starting router.");
		// Handle Nav Bar Clicks
		$(".nav li a").on("click", function(e) {
			crossroads.parse($(this).attr("href"));
			e.preventDefault();
		});

		// Dashboard Route
		crossroads.addRoute('/', function() {
			log("WebUI: Loading Dashboard");
			loadPage('/ui/dashboard.html', function() {
				// Execute Dashboard Module
				History.pushState(null, 'giv2giv - Dashboard', '/');
			});
		});

		// Dashboard Route
		crossroads.addRoute('/donor', function() {
			log("WebUI: Loading Donor");
			loadPage('/ui/donor.html', function() {
				// Execute Donor Module
				DonorUI.init();
				History.pushState(null, 'giv2giv - Donor', '/donor');
			});
		});

		// Dashboard Route
		crossroads.addRoute('/numbers', function() {
			log("WebUI: Loading Numbers");
			loadPage('/ui/numbers.html', function() {
				// Execute Numbers Module
				History.pushState(null, 'giv2giv - Numbers', '/numbers');
			});
		});

		// Log all routes
		crossroads.routed.add(log, console);
	};

	// Load HTML Page
	function loadPage(url, callback) {
		log("WebUI: Loading Page HTML: " + url);
		$.get(url, function (data) {
			$("#app-panel").html(data);
			stopLoad();
		}).fail(function(data) {
			stopLoad();
			log("WebUI: Failed to load page.");
		});

		// Callback
		if(typeof callback === "function") {
  		// Call it, since we have confirmed it is callable
    	callback();
  	}
	}

  // Finally expose bits
	return {
		init: function () {
			router();
			startApplication();
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