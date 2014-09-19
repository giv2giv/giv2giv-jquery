// =================== //
// MAIN APPLICATION    //
// AND ROUTING HANDLER //
// =================== //

// Facebook Bits
window.fbAsyncInit = function() {
	FB.init({
		appId      : '453893384741267',
		cookie     : true,  // enable cookies to allow the server to access 
												// the session
		xfbml      : true,  // parse social plugins on this page
		version    : 'v2.1' // use version 2.1
	});

	FB.getLoginStatus(function(response) {
		if(response.status == 'connected') {
			FB.api('/me', function(response) {
				// Enable Button
				$("#facebook-signin").prop('disabled', false);
				$("#facebook-signin").html('<i class="fa fa-facebook"></i> Sign In as ' + response.name);
			});
		} else {
			// Enable Button
			$("#facebook-signin").prop('disabled', false);
			$("#facebook-signin").html('<i class="fa fa-facebook"></i> Sign Up with Facebook');
		}
	});
};

// Load the SDK asynchronously
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&appId=453893384741267&version=v2.0";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

var WebUI = function() {
	var isFacebookAuthorized = false;

	// Sample Function
	var cake = function(callback) {
			// It's a lie
			console.log("srry bro, it's a lie");
			
			// Not needed, but good if you're loading data and you need to inform UI/another function you're done.
			if (typeof callback === "function") {
		callback();
	}
 };
		
// ======================= //
//          VIEWS          //
// ======================= //

	// Signin Bits
	// Display the signin screen.
	function showsignin(callback) {
		// Hide App Panel
		$("#app-panel").addClass("hide");
		$("#app-panel").html("");
		// Hide Private Nav
		$(".private-nav").addClass("hide");
		// Show Public Nav
		$(".public-nav").removeClass("hide");
		
		// Set Title
		document.title = "giv2giv - Signin";
		// Show Signin Panel
		$("#signin-panel").removeClass("hide");
		$("#app-container").attr("data-page-id", "signin");

		$("#facebook-signin").on('click', function(e) {
			e.preventDefault();
			FB.login(function(response) {
				statusChangeCallback(response);
			}, {scope: 'public_profile,email'});
		});
		if (typeof callback === "function") {
			callback();
		}
	}

	// Hide the signin screen
	function hidesignin(callback) {
		// Show Private Nav
		$(".private-nav").removeClass("hide");
		// Hide Public Nav
		$(".public-nav").addClass("hide");
		// Title is set in Load Page
		// Hide Signin Panel
		$("#signin-panel").addClass("hide");
		// Clean up form here.
		$("#signin-message").html("");
		$("#signin-email").val("");
		$("#signin-password").val("");

		if (typeof callback === "function") {
			callback();
		}
	}

// ======================= //
//        HANDLERS         //
// ======================= //

	/*
	* Prepares the CSS classes to display the correct page
	* @param isPublic {boolean}
	* @param activeTab {jQuery Object} CSS id of the active navbar tab e.g. "#signup-nav"
	* @param title {string} document.title for the page
	*/
	function setPageMetadata(isPublic, activeTab, title) {
		// Show App Panel
		$("#app-panel").removeClass("hide");

		$("#signin-panel").addClass("hide");
		$("#signup-panel").addClass("hide");

		if (isPublic) {
			// Hide Private Nav
			$(".private-nav").addClass("hide");
			// Show Public Nav
			$(".public-nav").removeClass("hide");
			// Set Tabs
			$(".public-nav").siblings().removeClass("active");
		} else {
			// Show Private Nav
			$(".private-nav").removeClass("hide");
			// Hide Public Nav
			$(".public-nav").addClass("hide");
			// Set Tabs
			$(".private-nav").siblings().removeClass("active");
		}
		// Set Tabs
		if (activeTab !== null) {
			activeTab.addClass("active");
		}
		// Set Title
		document.title = title;
	}

	// Facebook Helpers
	function statusChangeCallback(response, accepted_terms) {
		// The response object is returned with a status field that lets the
		// app know the current login status of the person.
		// Full docs on the response object can be found in the documentation
		// for FB.getLoginStatus().
		if (response.status === 'connected') {
			WebUI.isFacebookAuthorized = true;
			handleFacebookLogin(response, true);
		} else if (response.status === 'not_authorized') {
			// The person is logged into Facebook, but not your app.
			WebUI.isFacebookAuthorized = false;
		} else {
			// The person is not logged into Facebook, so we're not sure if
			// they are logged into this app or not.
			WebUI.isFacebookAuthorized = false;
		}
	}

	function handleFacebookLogin(authResponse, accepted_terms) {

	// send token to server, receive g2g session ID back
	console.log(authResponse.authResponse.accessToken);

	FB.api('/me', function(response) {
		var payload = JSON.stringify({
			"token": authResponse.authResponse.accessToken,
			"accepted_terms": accepted_terms
		});

		$.ajax({
			url: GLOBAL.SERVER_URL + "/api/sessions/create_facebook.json",
			type: "POST",
			data: payload,
			contentType: "application/json",
			dataType: "json"
		}).done(function (data) {
			$.ajaxSetup({
				beforeSend: function (xhr, settings) {
					xhr.setRequestHeader("Authorization", "Token token=" + data.session.token);
				}
			});
			// Set Cookie
			$.cookie("session", data.session.token);
			WebUI.startApplication();
		}).fail(function (data) {
			var res = JSON.parse(data.responseText);
			if (res.message == "unauthorized") {
				growlError("Could not authorize using that Facebook token");
			} else {
				log("WebUI: Signin Error - " + res.message);
			}
		});
	}); // FB.api end
} // hendleFacebookLogin END

	// Start Application
	// This is only loaded on full page refresh or first visit
	function startApplication(callback) {
		log("WebUI: Starting Application");
		if (activeSession()) {
			// Get Donor Info
			$.ajax({
				url: GLOBAL.SERVER_URL + "/api/donors.json",
				type: "GET",
				contentType: "application/json",
				dataType: "json"
			}).done(function (data) {
				log("WebUI: Loading Donor information.");
				// Load Current URL
				log(window.location.hash);
				if (window.location.hash === "#signin" || window.location.hash === "#signup" || window.location.hash === "" || window.location.hash === "#/") {
					// If the user's dashboard is empty, send them to the featured endowments page
					// Otherwise, send them to the dashboard
					var donations = 0;
					$.ajax({
						url: GLOBAL.SERVER_URL + "/api/donors/donations.json",
						type: "GET",
						contentType: "application/json",
						dataType: "json",
					}).done(function(response) {
						donations = parseFloat(response.total);
						if (donations > 0) {
							hasher.setHash("dashboard");
						} else {
							hasher.setHash("");
						}
						LandingUI.start.halt();
					});
					
				} else {
					hasher.setHash(window.location.hash);
				}
				// Facebook conversion tracking
				var fb_param = {};
				fb_param.pixel_id = "6017461958346";
				fb_param.value = "0.00";
				fb_param.currency = "USD";
				var fpw = document.createElement("script");
				fpw.async = true;
				fpw.src = "//connect.facebook.net/en_US/fp.js";
				var ref = document.getElementsByTagName("script")[0];
				ref.parentNode.insertBefore(fpw, ref);
				log(ref);
				// Hide Signin
				// Show App Panel
				$("#app-panel").removeClass("hide");
				// Show Private Nav
				$(".private-nav").removeClass("hide");
				hidesignin();
			}).error(function (data) {
				if (data.statusText === "Unauthorized") {
					log("WebUI: Invalid session, resetting cookie & displaying Signin.");
					$.removeCookie("session");
					hasher.setHash("signin");
				}
			});
		} else {
			// Parse URL (Will Show Signin or Public Page)
			hasher.setHash(window.location.hash);
		}
		if (typeof callback === "function") {
			
			callback();
		}
	}

	// Check if Session is Active
	// URL parameter is the URL to goto if Session is dead
	function activeSession() {
		log("WebUI: Checking session.");
		var status = false;
		if ($.cookie("session") !== undefined) {
			$.ajaxSetup({
				beforeSend: function (xhr, settings) {
					xhr.setRequestHeader("Authorization", "Token token=" + $.cookie("session"));
				}
			});
			$.ajax({
				type: "POST",
				url: GLOBAL.SERVER_URL + "/api/sessions/ping.json",
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
	}
	
	// Load HTML Page
	function loadPage(url, callback) {
		log("WebUI: Loading Page HTML: " + url);
		$.get(url, function (data) {
			log("WebUI: Loaded page.");
			$("#app-panel").html(data);
			reloadUI();
			if (typeof callback === "function") {
				callback();
			}
		}).fail(function (data) {
			log("WebUI: Failed to load page.");
		});
	}

	function loadModals() {
		$.get('/ui/modals.html', function (data) {
			$("#modal-container").html(data);
		}).fail(function (data) {
			log("WebUI: Failed to load modals.");
		});
	}

	// Reload UI
	// Some jQuery Selectors can't delegate & need to be applied to dynamic HTML
	function reloadUI() {
		// Initialize tabs
		$("[data-toggle='tabs'] a").click(function (e) {
			e.preventDefault();
			$(this).tab("show");
		});
	}

	// Functions that are deffered until after the WebUI is initialized
	function deferredFunctions() {
		loadModals();
	}

// ======================= //
//        SELECTORS        //
// ======================= //

	// Endowment Search
	$("#endowment-search").typeahead({
		remote: {
			name: "endowments",
			rateLimitWait: 500,
			url: GLOBAL.SERVER_URL + "/api/endowment.json?page=1&per_page=5&query=%QUERY",
			filter: function (response) {
				var results = [];
				log(response);
				if (response.message === undefined) {
					$.each(response.endowments, function (key, value) {
						var endowment = {};
						log(value);
						endowment.id = value.slug;
						endowment.value = value.name;
						endowment.desc = value.description;
						results.push(endowment);
					});
				}
				return results;
			},
			maxParallelRequests: 1,
		},
		template: [
		"<p>{{value}} - {{desc}}</p>"
		],
		engine: Hogan,
		limit: 5
	}).on("typeahead:selected", function (obj, datum, name) {
		// Go to Endowment
		hasher.setHash("endowment/" + datum.id);
	});

	// Terms Button
	$("#terms-btn").on("click", function (e) {
		e.preventDefault();
		$("#terms-body").load("/ui/terms.html", function() {
			$("#user-name").html($("#signup-name").val());
			$("#user-email").html($("#signup-email").val());
			$("#terms-modal").modal("show");
		});
	});

		// Terms Button
	$("#social-terms-btn").on("click", function (e) {
		e.preventDefault();
		$("#terms-body").load("/ui/terms.html", function() {
			$("#user-name").html($("#signup-name").val());
			$("#user-email").html($("#signup-email").val());
			$("#terms-modal").modal("show");
		});
	});

	// Wish Modal
	$("#make-wish-form").on("submit", function (e) {
		e.preventDefault();
		var payload = {};
		payload.wish_text = $("#wish").val();
		payload.page = $("#app-container").attr("data-page-id");
		log(payload);
		var request = JSON.stringify(payload);
		$.ajax({
			url: GLOBAL.SERVER_URL + "/api/wishes.json",
			method: "POST",
			data: request,
			dataType: "json",
			contentType: "application/json"
		}).done(function (data) {
			growlSuccess("Thank you for your feedback! Got a wizard? Fork our code at <a href='https://github.com/giv2giv' target=_blank>GitHub</a> to grant wishes!");
			$("#wish-modal").modal("hide");
		}).fail(function (data) {
			growlError("There was an error making this wish.");
		});
	});

	// Signup Form
	$("#signup-form").on("submit", function (e) {
		e.preventDefault();
		$btn = $("#signup-btn");
		$btn.button("loading");
		var payload = {};
		payload.email = $("#signup-email").val();
		payload.password = $("#signup-password").val();
		payload.name = $("#signup-name").val();
		payload.accepted_terms = $("#signup-accept-terms").prop("checked");

		if (!payload.accepted_terms) {
			growlError("Must accept terms and conditions");
			$btn.button("reset");
			return;
		}

		var request = JSON.stringify(payload);
		$.ajax({
			url: GLOBAL.SERVER_URL + "/api/donors.json",
			method: "POST",
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
				url: GLOBAL.SERVER_URL + "/api/sessions/create.json",
				type: "POST",
				data: payload,
				contentType: "application/json",
				dataType: "json"
			}).done(function (data) {
				$.ajaxSetup({
					beforeSend: function (xhr, settings) {
						xhr.setRequestHeader("Authorization", "Token token=" + data.session.token);
					}
				});
				// Hide Signup
				$("#signup-panel").addClass("hide");
				// Set Cookie
				$.cookie("session", data.session.token);
				startApplication();
				$btn.button("reset");
			}).fail(function (data) {
				var res = JSON.parse(data.responseText);
				$btn.button("reset");
				if (res.message == "unauthorized") {
					growlError("Could not login with that email or password");
				} else {
					growlError(res.message);
					log("WebUI: Signin Error - " + res.message);
				}
			});
		}).fail(function (data) {
			var res = JSON.parse(data.responseText);
			$btn.button("reset");
			if (res.message == "unauthorized") {
				growlError("Could not login with that email or password");
			} else if (res.message) {
				growlError(res.message);
				log("WebUI: Signin Error - " + res.message);
			} else {
				$.each(res, function (key, value) {
					growlError(key + ": " + value);
				});
			}
		});
	});

	// Signin Form
	$("#signin-form").on("submit", function (e) {
		e.preventDefault();
		// Build Payload
		$btn = $("#signin-btn");
		$btn.button("loading");
		var payload = JSON.stringify({
			"email": $("#signin-email").val(),
			"password": $("#signin-password").val()
		});
		$.ajax({
			url: GLOBAL.SERVER_URL + "/api/sessions/create.json",
			type: "POST",
			data: payload,
			contentType: "application/json",
			dataType: "json"
		}).done(function (data) {
			$.ajaxSetup({
				beforeSend: function (xhr, settings) {
					xhr.setRequestHeader("Authorization", "Token token=" + data.session.token);
				}
			});
			// Set Cookie
			$.cookie("session", data.session.token);
			startApplication();
			$btn.button("reset");
		}).fail(function (data) {
			$btn.button("reset");
			var res = JSON.parse(data.responseText);
			if (res.message == "unauthorized") {
				$("#signin-message").html("Could not login with that email or password");
			} else {
				log("WebUI: Signin Error - " + res.message);
			}
		});
	});

	$("#reset-password-btn").on('click', function(e) {
		e.preventDefault();
		if (!$("#signin-email").val()) {
			growlError("Enter your email address then click \"Reset My Password\"");
		} else {
			$.ajax({
				url: GLOBAL.SERVER_URL + '/api/donors/forgot_password.json',
				type: 'POST',
				data: JSON.stringify({"email":$("#signin-email").val()}),
				contentType: "application/json",
				dataType:"json"
			}).done(function() {
				growlSuccess("Password reset instructions have been sent to your email address " + $("#signup-email").val() + "<br>Follow the instructions in the email to change your password.");
			}).fail(function() {
				growlError("There was an error trying to reset your email.");
			});
		}
	});

	// Handle Logout Button
	$("#logout-btn").on("click", function (e) {
		e.preventDefault();
		log("WebUI: Logout.");
		$.ajax({
			url: GLOBAL.SERVER_URL + "/api/sessions/destroy.json",
			type: "POST",
			contentType: "application/json",
			dataType: "json"
		}).done(function (data) {
			// Delete Cookie
			$.removeCookie("session");
			// Delete Facebook token
			// FB.logout(function(response) {
		// 		// user is now logged out
			// });
			growlSuccess("You have successfully signed out of giv2giv");
			hasher.setHash("/");
			// EndowmentsUI.start.halt();
			// EndowmentsUI.details.halt();
			// EndowmentsUI.subscriptions.halt();
			// DashboardUI.start.halt();
		});
	});

	// Nav Tabs
	$(".private-nav a, .public-nav a").on("click", function (e) {
		hasher.setHash($(this).attr("href"));
		e.preventDefault();
	});

// ======================= //
//         ROUTING         //
// ======================= //

	// Will Create proper routes based on Active Session
	var router = function (callback) {
		log("WebUI: Starting router.");
		// Ignore Router State (Same URL Loads)
		// crossroads.ignoreState = true;
	};

	// Landing Page Route
	crossroads.addRoute("/", function() {
		if (activeSession()) {
			loadPage("/ui/endowments.html", function() {
				$("#app-container").attr("data-page-id", "endowments");
				setPageMetadata(!activeSession(), null, "giv2giv - Endowments");
				EndowmentsUI.start.dispatch(); // Load JS
			});
		} else {
			loadPage("/ui/landing.html", function() {
				$("#app-container").attr("data-page-id", "landing");
				setPageMetadata(!activeSession(), null, "giv2giv.org");
				LandingUI.start.dispatch(); // Load JS
			});
		}
	});

	// Signin Route
	crossroads.addRoute("/signin", function() {
		// Set Tabs
		$(".public-nav").siblings().removeClass("active");
		// Hide Signup Panel
		$("#signup-panel").addClass("hide");
		// Display Signin (Title Set in Method)
		showsignin();
	});

	// Sign-Up Route
	crossroads.addRoute("/signup", function() {
		// Set Tabs
		$(".public-nav").siblings().removeClass("active");
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
		$("#signup-accept-terms").attr("checked", false);
		$("#social-signup-accept-terms").attr("checked", false);
		$("#signup-panel").removeClass("hide");
		$(".public-nav").removeClass("hide");

		// Setup Facebook
		$("#facebook-signup").on('click', function(e) {
			e.preventDefault();
			accepted_terms = $("#social-signup-accept-terms").prop("checked");

			if (!accepted_terms) {
				growlError("You must accept the terms and conditions to use giv2giv.org");
				return;
			}

			FB.login(function(response) {
				statusChangeCallback(response, accepted_terms);
			}, {scope: 'public_profile,email'});
		});

	});

	// Dashboard Route
	crossroads.addRoute("/dashboard", function() {
		if (activeSession()) {
			loadPage("/ui/dashboard.html", function() {
				$("#app-container").attr("data-page-id", "dashboard");
				setPageMetadata(!activeSession(), $("#dashboard-nav"), "giv2giv.org");
				DashboardUI.start.dispatch(); // Load JS
			});
		} else {
			crossroads.parse("/signin");
		}
	});

	// My Subscriptions Route
	crossroads.addRoute("/subscriptions", function() {
		if (activeSession()) {
			loadPage("/ui/subscriptions.html", function() {
				$("#app-container").attr("data-page-id", "subscriptions");
				setPageMetadata(!activeSession(), null, "giv2giv.org");
				EndowmentsUI.subscriptions.dispatch(); // Load JS
			});
		} else {
			crossroads.parse("/signin");
		}
	});

	// Endowment Details Route
	crossroads.addRoute("/endowment/{id}", function (id) {
		if (activeSession()) {
			// Load Endowment Details First
			$.ajax({
				url: GLOBAL.SERVER_URL + "/api/endowment/" + id + ".json",
				type: "GET",
				contentType: "application/json",
				dataType: "json"
			}).done(function (data) {
				loadPage("/ui/endowment_details.html", function() {
					$("#app-container").attr("data-page-id", "endowment-details");
					setPageMetadata(!activeSession(), null, "giv2giv - " + data.endowment.name + " Details");
					// Load JS
					EndowmentsUI.details.dispatch(data.endowment);
				});
			}).fail(function (data) {
				growlError("There was an error loading the Endowment Details.");
			});
		} else {
			// Load Endowment Details First
			$.ajax({
				url: GLOBAL.SERVER_URL + "/api/endowment/" + id + ".json",
				type: "GET",
				contentType: "application/json",
				dataType: "json"
			}).done(function (data) {
				loadPage("/ui/endowment_details.html", function() {
					$("#app-container").attr("data-page-id", "endowment-details");
					setPageMetadata(!activeSession(), null, "giv2giv - " + data.endowment.name + " Details");
					// Load JS
					EndowmentsUI.details.dispatch(data.endowment);
				});
			}).fail(function (data) {
				growlError("There was an error loading the Endowment Details.");
			});
		}

	});

	// Donor Route
	crossroads.addRoute("/donor", function() {
		if (activeSession()) {
			loadPage("/ui/donor.html", function() {
				$("#app-container").attr("data-page-id", "donor");
				setPageMetadata(false, $("#donor-nav"), "giv2giv- Donor");
				// Load JS
				DonorUI.start.dispatch();
			});
		} else {
			crossroads.parse("/signin");
		}
	});

	// Numbers Route
	crossroads.addRoute("/numbers", function() {
		var navTab = activeSession() ? $("#numbers-nav") : $("#pub-numbers-nav");

		loadPage("/ui/numbers.html", function() {
			$("#app-container").attr("data-page-id", "numbers");
			setPageMetadata(!activeSession(), navTab, "giv2giv - Numbers");
			// Load JS
			NumbersUI.start.dispatch();
		});
	});

	// Password Reset Form
	crossroads.addRoute("/reset_password?reset_token={token}", function(token) {		
		// TODO: Check whether or not the reset password token is expired,
		// and if it is, redirect the user to the sign-in page. Also, display
		// growlError('Sorry, that password reset link has expired.') 
		loadPage("/ui/reset_password.html", function() {
			$("#app-container").attr("data-page-id", "reset-password");
			setPageMetadata(!activeSession(), null, "giv2giv.org");
			ResetPassUI.start.dispatch(token);
		});
	});

	// Not found route - send to Dashboard
	crossroads.bypassed.add(function (request) {
		log("WebUI: Route not found.");
		log(request);
		crossroads.parse("/dashboard");
	});

	// Setup Hasher
	function parseHash(newHash, oldHash) {
		crossroads.parse(newHash);
	}

	hasher.initialized.add(parseHash);
	hasher.changed.add(parseHash);
	hasher.init();
	hasher.prependHash = "";

	if (typeof callback === "function") {
		callback();
	}

	// Finally expose bits
	return {
		init: function() {
			// History Adapter
			log("WebUI: Init Start");
			router(function() {
				startApplication();
			});
			log("WebUI: Init Complete");
		},
		// Expose our sample function to the outside world
		cake: function (callback) {
			return cake(callback);
		},
		deferredLoad: function() {
			deferredFunctions();
		},
		showAlert: function (type, message, timeout) {
			showAlert(type, message, timeout);
		},
		activeSession: function() {
			return activeSession();
		},
		statusChangeCallback: function(response, accepted_terms) {
			return statusChangeCallback(response, accepted_terms);
		},
		startApplication: function() {
			return startApplication();
		}
	};
}();

// DOM Loaded
$(function() {
	WebUI.init();
	WebUI.deferredLoad();
});

