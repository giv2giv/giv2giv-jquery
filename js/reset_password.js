// Reset Password UI

// Signal Hook
var ResetPassUI = {
	start : new signals.Signal() 
};

// Add Listener
ResetPassUI.start.add(onStart);

// (Re)Start Dashboard UI
function onStart() {
	initialize();
}

function initialize() {
	$('#reset-password-btn').on('click', function(e) {
		e.preventDefault();
		if ($('#new-password').val() === $('#new-password2').val()) {
			var request = {};
			request.reset_token = window.location.search.slice(1);
			request.password = $('#new-password').val();

			$.ajax({
				url: '/api/reset_password.json',
				type: 'POST',
				contentType: 'application/json',
				dataType: 'json',
				data: request
			}).done(function() {
				console.log("success");
			}).fail(function() {
				growlError('There was an error trying to reset your password');
			});
		} else {
			growlError('Sorry, those passwords don\'t match. Try again.');
		}
	});
}
