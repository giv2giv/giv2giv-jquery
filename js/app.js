/*
 * Giv2Giv Application
 * Michael Thomas - 01/06/2014
 */

var G2G = function() {
	// Start Loading Indicator
	var startLoad = function() {
		$('#logo').hide(0, function () {
			$('#loading').show();
		});
	};

	// Stop Loading Indicator
	var stopLoad = function() {
		$('#loading').hide(0, function () {
			$('#logo').show();
		});
	};

	// Display Login
	var displayLogin = function() {
		// For now, just redirect to index.html
		window.location.href = "index.html";
	};

	// Start application
	var startApplication = function() {
		// For now, redirect to app.html
		window.location.href = "dashboard.html";
	};

	// Login Form
	$("#login-form").on("submit", function(e) {
		// Build Payload
		var payload = JSON.stringify({ "email" : $("#signin_email").val(), "password" : $("#signin_password").val() });
		$.ajax({
			url: "https://api.giv2giv.org/api/sessions/create.json",
			type: "POST",
			data: payload,
			contentType: "application/json",
			dataType:"json",
			success: function (data) {
				// Setup Session & Cookie
				console.log(data);
				$.ajaxSetup({
		 			beforeSend: function(xhr, settings) {
			 			xhr.setRequestHeader("Authorization", "Token " + data.session.session.token);
		  		}
		 		});
		 		// Set Cookie
		 		$.cookie('session', data.session.session.token);
			  
			  // Clean up form here.
			  $("#signin_email").val("");
			  $("#signin_password").val("");
			  startApplication();
			},
			fail: function(data) {
				var res = JSON.parse(data.responseText);
				console.log(data);
				if(res.message == "unauthorized") {
					console.log("Bad login");
					$.bootstrapGrowl("Incorrect username or password.");
				} else {
					console.log("[error]: " + res.message);
				}
			}
		});
		e.preventDefault();
	});

	// Registration Form
	$("#register-form").on("submit", function(e) {
	// Build Payload
		var registerPayload = JSON.stringify({ "name" : $("#signup_name").val(), "email" : $("#signup_email").val(), "password" : $("#signup_password").val() });
		
		$.ajax({
			url: "https://api.giv2giv.org/api/donors.json",
			type: "POST",
			data: registerPayload,
			contentType: "application/json",
			dataType:"json",
			success: function (data) {
				// Perform login
				var loginPayload = JSON.stringify({ "name" : $("#signup_name").val(), "email" : $("#signup_email").val(), "password" : $("#signup_password").val() });

				$.ajax({
					url: "https://api.giv2giv.org/api/sessions/create.json",
					type: "POST",
					data: loginPayload,
					contentType: "application/json",
					dataType:"json",
					success: function (data) {
						// Setup Session & Cookie
						console.log(data);
						$.ajaxSetup({
				 			beforeSend: function(xhr, settings) {
					 			xhr.setRequestHeader("Authorization", "Token " + data.session.session.token);
				  		}
				 		});
				 		// Set Cookie
				 		$.cookie('session', data.session.session.token);
					  
					  // Clean up form here.
					  $("#email").val("");
					  $("#password").val("");
					  startApplication();
					},
					fail: function(data) {
						var res = JSON.parse(data.responseText);
						console.log(res);
					}
				});

				// Setup Session & Cookie
				console.log(data);
				$.ajaxSetup({
		 			beforeSend: function(xhr, settings) {
			 			xhr.setRequestHeader("Authorization", "Token " + data.session.session.token);
		  			}
				});
		 		// Set Cookie
		 		$.cookie('session', data.session.session.token);
				  
				// Clean up form here.
				$("#signup_name").val("");
				$("#signup_email").val("");
				$("#signup_password").val("");
				startApplication();
			},
			fail: function(data) {
				var res = JSON.parse(data.responseText);
				console.log(res);
				$.bootstrapGrowl(res);
			}
		});
		e.preventDefault();

	});

	// Reset Password Form
	$("#reset-password-form").on("submit", function(e) {
		// Build Payload
		var payload = JSON.stringify({ "email" : $("#reset-email").val() });
		$.post("https://api.giv2giv.org/api/donors/forgot_password.json", payload, function (data) {
		  $("#reset-email").val("");
			$.bootstrapGrowl(data.message);
		}).fail(function(data) {
			var res = JSON.parse(data.responseText);
			$.bootstrapGrowl(res.message);
		});
	  e.preventDefault();
	});

	// Logout Button
	$("#logout_btn").on("click", function(e) {
		// unset cookie
		$.removeCookie('session');
		window.location.href = "index.html";
		e.preventDefault();
	});

	// Tooltips
	$('a[data-toggle="tooltip"]').tooltip();

	// Not needed until pretty ajaxyismness
	// // Setup UI Routing
	// var routing = function() {
	// 	// History.js adapter
	// 	History.Adapter.bind(window,'statechange',function(){ // Note: We are using statechange instead of popstate
 //      // Get current url and parse it
 //      crossroads.parse(History.getState().hash);
 //    });

	// 	// Dashboard Route
	// 	crossroads.addRoute('/', function() {
	// 		console.log("Loading Dashboard");
	// 		// Now this is where magic happens.
			
	// 	});

	// 	// Clients Route
	// 	crossroads.addRoute('client', function() {
 //    	console.log("Loading Clients");
 //    	loadPage('/ui/client');
	// 	});

	// 	function loadPage(url, callback) {
	// 		console.log("Loading Page: " + url);
	// 		$.get(url, function (data) {
	// 				$("#application-body").html(data);
	// 				stopLoad();
	// 			}).fail(function(data) {
	// 				stopLoad();
	// 				console.log("Failed to load page.");
	// 			if(callback != undefined)
	// 				callback();
	// 		});
	// 	}
	// };

	return {
		init: function () {
			// routing();
			// startApplication();
		}, startLoad: function () {
			startLoad();
		}, stopLoad: function () {
			stopLoad();
		}, showAlert: function(type, message, timeout) {
			showAlert(type, message, timeout);
		}
	};
}();

/* Initialize WebApp when page loads */
$(function() {
	G2G.init();
});
