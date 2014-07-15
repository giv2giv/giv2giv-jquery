// WebUI Application
// Michael Thomas, 2014
var server_url = "https://apitest.giv2giv.org";

// Setup Stripe
var stripe_pub_key = 'pk_test_d678rStKUyF2lNTZ3MfuOoHy';
Stripe.setPublishableKey(stripe_pub_key);

// Wish Page ID
var wish_page;

// Awesome Logging
// Only display console log output in debug mode, else nothing.
// @todo - Send serious logs to server?
var debug = false;

log = function () {
  if (debug && console && typeof console.log === 'function') {
    for (var i = 0, ii = arguments.length; i < ii; i++) {
      console.log(arguments[i]);
    }
  }
};

// Bootstrap Growl Helpers
// Growl Error
function growlError(message) {
	$.bootstrapGrowl(message, {
		ele: 'body', // which element to append to
		type: 'error', // (null, 'info', 'error', 'success')
		offset: {
			from: 'top',
			amount: 20
		}, // 'top', or 'bottom'
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
		offset: {
			from: 'top',
			amount: 20
		}, // 'top', or 'bottom'
		align: 'right', // ('left', 'right', or 'center')
		width: 'auto', // (integer, or 'auto')
		delay: 5000,
		allow_dismiss: true,
		stackup_spacing: 10 // spacing between consecutively stacked growls.
	});
}

// Main Application
var WebUI = function() {
	// Signin Bits
	// Display the signin screen.
	var displaysignin = function(callback) {
		// Hide App Panel
		$("#app-panel").addClass("hide");
		$("#app-panel").html("");
		// Hide App Nav
		$("#app-nav").addClass("hide");
		// Show Public Nav
		$("#public-nav").removeClass("hide");
		// Set Title
		document.title = "giv2giv - Signin";
		// Show Signin Panel
		$("#signin-panel").removeClass("hide");
		$('#app-container').attr('data-page-id', 'signin');
		// Callback
		if (typeof callback === "function") {
			// Call it, since we have confirmed it is callable
			callback();
		}
	};

	// Hide the signin screen
	var hidesignin = function (callback) {
		// Show App Nav
		$("#app-nav").removeClass("hide");
		// Hide Public Nav
		$("#public-nav").addClass("hide");
		// Title is set in Load Page
		// Hide Signin Panel
		$("#signin-panel").addClass("hide");
		// Clean up form here.
		$("#signin-message").html("");
		$("#signin-email").val("");
		$("#signin-password").val("");

		// Callback
		if (typeof callback === "function") {
			// Call it, since we have confirmed it is callable
			callback();
		}
	};

	// Endowment Search
	$('#endowment-search').typeahead({
		remote: {
			name: 'endowments',
			rateLimitWait: 500,
			url: server_url + "/api/endowment.json?page=1&per_page=5&query=%QUERY",
			filter: function (response) {
				var results = new Array();
				log(response);
				if (response.message === undefined) {
					$.each(response.endowments, function (key, value) {
						var endowment = new Object();
						log(value);
						endowment['id'] = value.id;
						endowment['value'] = value.name;
						endowment['desc'] = value.description;
						results.push(endowment);
					});
				}
				return results;
			},
			maxParallelRequests: 1,
		},
		template: [
			'<p>{{value}} - {{desc}}</p>'
		],
		engine: Hogan,
		limit: 5
	}).on('typeahead:selected', function (obj, datum, name) {
		// Go to Endowment
		hasher.setHash('/endowment/' + datum.id);
	});

	// Show signup panel
	$("#display-signup-btn").on("click", function (e) {
		// Hide Signin Panel
		$("#signin-panel").addClass("hide");
		// Clean & Show Sign Up
		$("#signup-name").val("");
		$("#signup-email").val("");
		$("#signup-password").val("");
		$("#signup-accept-terms").attr('checked', false);
		$("#signup-panel").removeClass("hide");
		e.preventDefault();
	});

	// Terms Button
	$("#terms-btn").on("click", function (e) {
		$("#terms-div").load("/ui/terms.html", function () {
			$("#terms-modal").modal('show');
		});
		e.preventDefault();
	});

	// Wish Modal
	$("#make-wish-form").on("submit", function (e) {
		var payload = {};
		payload.wish_text = $("#wish").val();
		payload.page = $('#app-container').attr('data-page-id');
		log(payload);
		var request = JSON.stringify(payload);
		$.ajax({
			url: server_url + '/api/wishes.json',
			method: 'POST',
			data: request,
			dataType: "json",
			contentType: "application/json"
		}).done(function (data) {
			growlSuccess("Thank you for your feedback! Got a wizard? Fork our code at <a href='https://github.com/giv2giv' target=_blank>GitHub</a> to grant wishes!");
			$("#wish-modal").modal('hide');
		}).fail(function (data) {
			growlError("Opps! There was an error making this wish.");
		});
		e.preventDefault();
	});

	// Hide sign-up & return to signin
	$("#cancel-signup-btn").on("click", function (e) {
		$("#signup-panel").addClass("hide");
		$("#signin-panel").removeClass("hide");
		e.preventDefault();
	});

	// Signup Form
	$("#signup-form").on("submit", function (e) {
		$btn = $("#signup-btn");
		$btn.button('loading');
		var payload = {};
		payload['email'] = $("#signup-email").val();
		payload['password'] = $("#signup-password").val();
		payload['name'] = $("#signup-name").val();
		payload['accepted_terms'] = $("#signup-accept-terms").prop('checked');

		var request = JSON.stringify(payload);
		$.ajax({
			url: server_url + '/api/donors.json',
			method: 'POST',
			data: request,
			dataType: "json",
			contentType: "application/json"
		}).done(function (data) {
			// Success, now cheat and signin
			var payload = JSON.stringify({
				"email": $("#signup-email").val(),
				"password": $("#signup-password").val()
			});
			$.ajax({
				url: server_url + "/api/sessions/create.json",
				type: "POST",
				data: payload,
				contentType: "application/json",
				dataType: "json"
			}).done(function (data) {
				$.ajaxSetup({
					beforeSend: function (xhr, settings) {
						xhr.setRequestHeader("Authorization", "Token token=" + data.session.session.token);
					}
				});
				// Hide Signup
				$("#signup-panel").addClass("hide");
				// Set Cookie
				$.cookie('session', data.session.session.token);
				startApplication();
				$btn.button('reset');
			}).fail(function (data) {
				var res = JSON.parse(data.responseText);
				$btn.button('reset');
				if (res.message == "unauthorized") {
					growlError("Incorrect Email or Password");
				} else {
					growlError(res.message);
					log("WebUI: Signin Error - " + res.message);
				}
			});
		}).fail(function (data) {
			var res = JSON.parse(data.responseText);
			$btn.button('reset');
			if (res.message == "unauthorized") {
				growlError("Incorrect Email or Password");
			} else if (res.message) {
				growlError(res.message);
				log("WebUI: Signin Error - " + res.message);
			} else {
				$.each(res, function (key, value) {
					growlError(key + ": " + value);
				});
			}
		});
		e.preventDefault();
	});

	// Signin Form
	$("#signin-form").on("submit", function (e) {
		// Build Payload
		$btn = $("#signin-btn");
		$btn.button('loading');
		var payload = JSON.stringify({
			"email": $("#signin-email").val(),
			"password": $("#signin-password").val()
		});
		$.ajax({
			url: server_url + "/api/sessions/create.json",
			type: "POST",
			data: payload,
			contentType: "application/json",
			dataType: "json"
		}).done(function (data) {
			$.ajaxSetup({
				beforeSend: function (xhr, settings) {
					xhr.setRequestHeader("Authorization", "Token token=" + data.session.session.token);
				}
			});
			// Set Cookie
			$.cookie('session', data.session.session.token);
			startApplication();
			$btn.button('reset');
		}).fail(function (data) {
			$btn.button('reset');
			var res = JSON.parse(data.responseText);
			if (res.message == "unauthorized") {
				$("#signin-message").html("Incorrect Email or Password");
			} else {
				log("WebUI: Signin Error - " + res.message);
			}
		});
		e.preventDefault();
	});

	// Handle Logout Button
	$("#logout-btn").on("click", function (e) {
		log("WebUI: Logout.");
		$.ajax({
			url: server_url + "/api/sessions/destroy.json",
			type: "POST",
			contentType: "application/json",
			dataType: "json"
		}).done(function (data) {
			// Delete Cookie
			$.removeCookie('session');
			hasher.setHash('/signin');
		});
		e.preventDefault();
	});

	// Application Bits
	// Display Application
	var displayApplication = function (callback) {
		// Show App Panel
		$("#app-panel").removeClass("hide");
		// Show App Nav
		$("#app-nav").removeClass("hide");
		// Callback
		if (typeof callback === "function") {
			// Call it, since we have confirmed it is callable
			callback();
		}
	};

	// Display Public Application View
	var displayPublicApplication = function (callback) {
		// Show App Panel
		$("#app-panel").removeClass("hide");
		// Show App Nav
		$("#public-nav").removeClass("hide");
		// Callback
		if (typeof callback === "function") {
			// Call it, since we have confirmed it is callable
			callback();
		}
	};

	// Start Application
	// This is only loaded on full page refresh or first visit
	var startApplication = function (callback) {
		log("WebUI: Starting Application");
		if (!activeSession()) {
			// Parse URL (Will Show Signin or Public Page)
			hasher.setHash(window.location.hash);
		} else {
			// Get Donor Info
			$.ajax({
				url: server_url + "/api/donors.json",
				type: "GET",
				contentType: "application/json",
				dataType: "json"
			}).done(function (data) {
				log("WebUI: Loading Donor information.");
				// Load Current URL
				log(window.location.hash);
				if (window.location.hash === "#/signin" || window.location.hash === "#/signup" || window.location.hash === "" || window.location.hash === "#/") {
					hasher.setHash('/endowments');
				} else {
					hasher.setHash(window.location.hash);
				}
				// Facebook conversion tracking
				var fb_param = {};
				fb_param.pixel_id = '6017461958346';
				fb_param.value = '0.00';
				fb_param.currency = 'USD';
				var fpw = document.createElement('script');
				fpw.async = true;
				fpw.src = '//connect.facebook.net/en_US/fp.js';
				var ref = document.getElementsByTagName('script')[0];
				ref.parentNode.insertBefore(fpw, ref);
				log(ref);
				// Set Donor Name
				// FF Fix
				$("#donor-name").html(data.donor.name);
				// Hide Signin
				// Display Main Application
				displayApplication(function () {
					hidesignin();
				});
			}).error(function (data) {
				if (data.statusText === "Unauthorized") {
					log("WebUI: Invalid session, resetting cookie & displaying Signin.");
					$.removeCookie('session');
					hasher.setHash('/signin');
				}
			});
		}
		if (typeof callback === "function") {
			// Call it, since we have confirmed it is callable
			callback();
		}
	};

	// Start Loading
	var startLoad = function () {
		log("WebUI: Start Loader");
		$('#loading').removeClass("hide");
	};

	// Stop Loading
	var stopLoad = function () {
		log("WebUI: Stop Loader");
		$('#loading').addClass("hide");
	};

	// Check if Session is Active
	// URL parameter is the URL to goto if Session is dead
	var activeSession = function () {
		log("WebUI: Checking session.");
		var status = false;
		if ($.cookie('session') !== undefined) {
			$.ajaxSetup({
				beforeSend: function (xhr, settings) {
					xhr.setRequestHeader("Authorization", "Token token=" + $.cookie('session'));
				}
			});
			$.ajax({
				type: 'POST',
				url: server_url + '/api/sessions/ping.json',
				async: false
			}).done(function (data) {
				log("WebUI: Session is good.");
				status = true;
			}).fail(function (data) {
				log("WebUI: Session is invalid.");
				status = false;
			});
		} else {
			status = false;
		}
		return status;
	};

	// Nav Tabs
	$(".nav-link a, .public-nav a").on("click", function (e) {
		hasher.setHash($(this).attr('href'));
		e.preventDefault();
	});

	// Load HTML Page
	function loadPage(url, callback) {
		log("WebUI: Loading Page HTML: " + url);
		$.get(url, function (data) {
			log("WebUI: Loaded page.");
			$("#app-panel").html(data);
			reloadUI();
			// Callback
			if (typeof callback === "function") {
				// Call it, since we have confirmed it is callable
				callback();
			}
		}).fail(function (data) {
			log("WebUI: Failed to load page.");
		});
	}

	// Router
	// Will Create proper routes based on Active Session
	var router = function (callback) {
		log("WebUI: Starting router.");
		// Ignore Router State (Same URL Loads)
		// crossroads.ignoreState = true;
	};

	// Landing Page Route
	crossroads.addRoute('/', function () {
		startLoad();
		if (activeSession()) {
			loadPage('/ui/landing.html', function () {
				$(".public-nav").siblings().removeClass("active");
				$("#landing-nav").addClass("active");
				$('#app-container').attr('data-page-id', 'landing');
				// Set Title
				document.title = "giv2giv.org";
			});
		} else {
			loadPage('/ui/landing.html', function () {
				$(".public-nav").siblings().removeClass("active");
				$("#app-panel").removeClass("hide");
				$("#signin-panel").addClass("hide");
				$("#signup-panel").addClass("hide");
				$('#app-container').attr('data-page-id', 'landing');
				// Set Nav Tab
				$("#landing-nav").addClass("active");
				// Set Title
				document.title = "giv2giv.org";
				displayPublicApplication();
			});
		}
		stopLoad();
	});

	// Signin Route
	crossroads.addRoute('/signin', function () {
		// Start Load
		startLoad();
		// Set Tabs
		$(".public-nav").siblings().removeClass("active");
		$("#signin-nav").addClass("active");
		// Hide Signup Panel
		$("#signup-panel").addClass("hide");
		// Display Signin (Title Set in Method)
		displaysignin();
		// Stop Load
		stopLoad();
	});

	// Sign-Up Route
	crossroads.addRoute('/signup', function () {
		// Show Signup
		startLoad();
		// Set Tabs
		$(".public-nav").siblings().removeClass("active");
		$("#signup-nav").addClass("active");
		// Hide Signin Panel
		$("#signin-panel").addClass("hide");
		// And App
		$("#app-panel").addClass("hide");
		$("#app-panel").html("");
		// Set Title
		document.title = "giv2giv - Sign Up";
		// Clean & Show Sign Up
		$("#signup-name").val("");
		$("#signup-email").val("");
		$("#signup-password").val("");
		$("#signup-accept-terms").attr('checked', false);
		$("#signup-panel").removeClass("hide");
		$("#public-nav").removeClass("hide");

		stopLoad();
	});

	// Endowments Route
	crossroads.addRoute('/endowments', function () {
		if (activeSession()) {
			loadPage('/ui/endowments.html', function () {
				$('#app-container').attr('data-page-id', 'endowments');
				// Load JS
				EndowmentsUI.start.dispatch();
				// Set Tabs
				$(".nav-link").siblings().removeClass("active");
				$("#endowments-nav").addClass("active");
				// Set Title
				document.title = "giv2giv - Endowments";
			});
		} else {
			crossroads.parse('/signin');
		}
	});

	// Endowment Details Route
	crossroads.addRoute('/endowment/{id}', function (id) {
		if (activeSession()) {
			// Load Endowment Details First
			$.ajax({
				url: server_url + "/api/endowment/" + id + ".json",
				type: "GET",
				contentType: "application/json",
				dataType: "json"
			}).done(function (data) {
				loadPage('/ui/endowment_details.html', function () {
					$('#app-container').attr('data-page-id', 'endowment-details');
					// Load JS
					EndowmentsUI.details.dispatch(data.endowment);
					// Set Tabs
					$(".nav-link").siblings().removeClass("active");
					$("#endowments-nav").addClass("active");
					// Set Title
					document.title = "giv2giv - " + data.endowment.name + " Details";
					stopLoad();
				});
			}).fail(function (data) {
				growlError("Opps! There was an error loading the Endowment Details.");
				stopLoad();
			});
		} else {
			// Load Endowment Details First
			$.ajax({
				url: server_url + "/api/endowment/" + id + ".json",
				type: "GET",
				contentType: "application/json",
				dataType: "json"
			}).done(function (data) {
				displayPublicApplication();
				$("#signin-panel").addClass('hide');

				loadPage('/ui/endowment_details.html', function () {
					$('#app-container').attr('data-page-id', 'endowment-details');
					// Load JS
					EndowmentsUI.details.dispatch(data.endowment);
					// Set Tabs
					$(".public-nav").siblings().removeClass("active");
					// Set Title
					document.title = "giv2giv - " + data.endowment.name + " Details";
					stopLoad();
				});
			}).fail(function (data) {
				growlError("Opps! There was an error loading the Endowment Details.");
				stopLoad();
			});
		}

	});

	// Donor Route
	crossroads.addRoute('/donor', function () {
		if (activeSession()) {
			loadPage('/ui/donor.html', function () {
				$('#app-container').attr('data-page-id', 'donor');
				// Load JS
				DonorUI.start.dispatch();
				// Set Tabs
				$(".nav-link").siblings().removeClass("active");
				$("#donor-nav").addClass("active");
				// Set Title
				document.title = "giv2giv - Donor";
			});
		} else {
			crossroads.parse('/signin');
		}
	});

	// Numbers Route
	crossroads.addRoute('/numbers', function () {
		if (activeSession()) {
			loadPage('/ui/numbers.html', function () {
				$(".nav-link").siblings().removeClass("active");
				$('#app-container').attr('data-page-id', 'numbers');
				// Load JS
				NumbersUI.start.dispatch();
				// Set Nav Tab
				$("#numbers-nav").addClass("active");
				// Set Title
				document.title = "giv2giv - Numbers";
			});
		} else {
			loadPage('/ui/numbers.html', function() {
				$("#app-panel").removeClass("hide");
				$("#signin-panel").addClass("hide");
				$("#signup-panel").addClass("hide");
				$(".public-nav").siblings().removeClass("active");
				$('#app-container').attr('data-page-id', 'numbers');
				// Load JS
				NumbersUI.start.dispatch();
				// Set Nav Tab
				$("#pub-numbers-nav").addClass("active");
				// Set Title
				document.title = "giv2giv - Numbers";
				displayPublicApplication();
				stopLoad();
			});
		}
		//else {
		//	crossroads.parse('/signin');
		//}
	});

	// Not found route - send to Endowments
	crossroads.bypassed.add(function (request) {
		log("WebUI: Route not found.");
		log(request);
		crossroads.parse('/endowments');
	});

	// Setup Hasher
	function parseHash(newHash, oldHash) {
		crossroads.parse(newHash);
	}

	hasher.initialized.add(parseHash);
	hasher.changed.add(parseHash);
	hasher.init();
	hasher.prependHash = '';

	// Callbacks
	if (typeof callback === "function") {
		// Call it, since we have confirmed it is callable
		callback();
	}

	// Reload UI
	// Some jQuery Selectors can't delegate & need to be applied to dynamic HTML
	function reloadUI() {
		// Initialize tabs
		$('[data-toggle="tabs"] a').click(function (e) {
			e.preventDefault();
			$(this).tab('show');
		});
	}

	// Finally expose bits
	return {
		init: function () {
			// History Adapter
			log("WebUI: Init Start");
			router(function () {
				startApplication();
			});
			log("WebUI: Init Complete");
		},
		startLoad: function () {
			startLoad();
		},
		stopLoad: function () {
			stopLoad();
		},
		showAlert: function (type, message, timeout) {
			showAlert(type, message, timeout);
		},
		activeSession: function () {
			return activeSession();
		}
	};
}();

// DOM Loaded
$(function () {
	WebUI.init();
});
