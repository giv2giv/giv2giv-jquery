// =================== //
// MAIN APPLICATION    //
// AND ROUTING HANDLER //
// =================== //

var WebUI = function() {

// ======================= //
//          VIEWS          //
// ======================= //

	// Signin Bits
	// Display the signin screen.
	var showsignin = function(callback) {
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
		if (typeof callback === "function") {
			callback();
		}
	};

	// Hide the signin screen
	var hidesignin = function (callback) {
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
	};

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

	// Start Application
	// This is only loaded on full page refresh or first visit
	var startApplication = function (callback) {
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
							crossroads.parse("/dashboard");
							hasher.setHash("dashboard");
						} else {
							crossroads.parse("/");
							hasher.setHash("");
						}
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
	};

	// Check if Session is Active
	// URL parameter is the URL to goto if Session is dead
	var activeSession = function () {
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
	};
	
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

	// Reload UI
	// Some jQuery Selectors can't delegate & need to be applied to dynamic HTML
	function reloadUI() {
		// Initialize tabs
		$("[data-toggle='tabs'] a").click(function (e) {
			e.preventDefault();
			$(this).tab("show");
		});
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
						endowment.id = value.id;
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
		$("#terms-body").load("/ui/terms.html", function () {
			$("#user-name").html($("#signup-name").val());
			$("#user-email").html($("#signup-email").val());
			$("#terms-modal").modal("show");
		});
		e.preventDefault();
	});

	// Wish Modal
	$("#make-wish-form").on("submit", function (e) {
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
		$btn.button("loading");
		var payload = {};
		payload.email = $("#signup-email").val();
		payload.password = $("#signup-password").val();
		payload.name = $("#signup-name").val();
		payload.accepted_terms = $("#signup-accept-terms").prop("checked");

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
						xhr.setRequestHeader("Authorization", "Token token=" + data.session.session.token);
					}
				});
				// Hide Signup
				$("#signup-panel").addClass("hide");
				// Set Cookie
				$.cookie("session", data.session.session.token);
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
		e.preventDefault();
	});

	// Signin Form
	$("#signin-form").on("submit", function (e) {
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
					xhr.setRequestHeader("Authorization", "Token token=" + data.session.session.token);
				}
			});
			// Set Cookie
			$.cookie("session", data.session.session.token);
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
		e.preventDefault();
	});

	// Handle Logout Button
	$("#logout-btn").on("click", function (e) {
		log("WebUI: Logout.");
		$.ajax({
			url: GLOBAL.SERVER_URL + "/api/sessions/destroy.json",
			type: "POST",
			contentType: "application/json",
			dataType: "json"
		}).done(function (data) {
			// Delete Cookie
			$.removeCookie("session");
			growlSuccess("You have successfully signed out of giv2giv");
			crossroads.parse("signin");
			hasher.setHash("signin");
			EndowmentsUI.start.halt();
			DashboardUI.start.halt();
		});
		e.preventDefault();
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
	crossroads.addRoute("/", function () {
		if (activeSession()) {
			loadPage("/ui/endowments.html", function () {
				$("#app-container").attr("data-page-id", "endowments");
				setPageMetadata(!activeSession(), null, "giv2giv - Endowments");
				EndowmentsUI.start.dispatch(); // Load JS
			});
		} else {
			loadPage("/ui/landing.html", function () {
				$("#app-container").attr("data-page-id", "landing");
				setPageMetadata(!activeSession(), null, "giv2giv.org");
				LandingUI.start.dispatch(); // Load JS
			});
		}
	});

	// Signin Route
	crossroads.addRoute("/signin", function () {
		// Set Tabs
		$(".public-nav").siblings().removeClass("active");
		// Hide Signup Panel
		$("#signup-panel").addClass("hide");
		// Display Signin (Title Set in Method)
		showsignin();
	});

	// Sign-Up Route
	crossroads.addRoute("/signup", function () {
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
		$("#signup-panel").removeClass("hide");
		$(".public-nav").removeClass("hide");
	});

	// Dashboard Route
	crossroads.addRoute("/dashboard", function () {
		if (activeSession()) {
			loadPage("/ui/dashboard.html", function () {
				$("#app-container").attr("data-page-id", "dashboard");
				setPageMetadata(!activeSession(), $("#dashboard-nav"), "giv2giv.org");
				DashboardUI.start.dispatch(); // Load JS
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
				loadPage("/ui/endowment_details.html", function () {
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
				loadPage("/ui/endowment_details.html", function () {
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
	crossroads.addRoute("/donor", function () {
		if (activeSession()) {
			loadPage("/ui/donor.html", function () {
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
	crossroads.addRoute("/numbers", function () {
		var navTab = activeSession() ? $("#numbers-nav") : $("#pub-numbers-nav");

		loadPage("/ui/numbers.html", function () {
			$("#app-container").attr("data-page-id", "numbers");
			setPageMetadata(!activeSession(), navTab, "giv2giv - Numbers");
			// Load JS
			NumbersUI.start.dispatch();
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
		init: function () {
			// History Adapter
			log("WebUI: Init Start");
			router(function () {
				startApplication();
			});
			log("WebUI: Init Complete");
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

