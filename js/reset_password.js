// Reset Password UI

// Signal Hook
var ResetPassUI = {
	start : new signals.Signal() 
};

// Add Listener
ResetPassUI.start.add(onStart);

// (Re)Start Dashboard UI
function onStart(token) {
	$('#reset-password-btn').on('click', function(e) {
		e.preventDefault();
		if ($('#new-password').val() === $('#new-password2').val()) {
			var payload = {};
			payload.reset_token = token;
			payload.password = $('#new-password').val();
			payload = JSON.stringify(payload);
			$.ajax({
				url: GLOBAL.SERVER_URL + '/api/donors/reset_password.json',
				type: 'POST',
				contentType: 'application/json',
				dataType: 'json',
				data: payload
			}).done(function() {
				hasher.setHash('signin');
				growlSuccess('Your password was successfully reset! Login again.');
			}).fail(function() {
				growlError('Sorry, the password reset link you clicked on appears to be expired.');
			});
		} else {
			growlError('Sorry, those passwords don\'t match. Try again.');
		}
	});
}
