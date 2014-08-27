$(function() {

	// Check Login
	if($.cookie('session')) {
		$.ajaxSetup({
				beforeSend: function(xhr, settings) {
				xhr.setRequestHeader("Authorization", "Token token=" + $.cookie('session'));
			}
		});
	} else {
		window.location.href = "index.html";
	}

	$("#charity_search_input").on("change", function(e) {

		//Search charities
		$.ajax({
			url: server_url + '/api/charities.json',
			method: 'GET',
			data: {
			page: '1',
			per_page: '10',
			query: $("#charity_search_input").val()
			},
			success: function(data) {
			// did we get anything
			if(data.message == "Not found") {
				// Display not found charity
				$("#not_found_charity").removeClass('hide');
			} else {

			}
			}
		}); // ajax
	}); // onChange
}); // function
