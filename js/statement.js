$(function() {

// submit for statement form
$("#donor_statement_button").on("click", function(e) {

	// Get our statement.html & turn into something we can use
	$.get('statement.html', function(data) {
		// success, create object
		var $statement = $($.parseHTML(data));
		//console.log($statement);
		// Now we need to get our statement data
		$.ajax({
		  url: 'https://api.giv2giv.org/api/donors/donations.json',
		  method: 'GET',
		  data: {"start_date" : "2014-01-01", "end_date" : "2014-12-31" },
			contentType: "application/json",
			dataType:"json",

		  success: function(response) {
				
				// response looks like: {"donations":[{"donation":{"created_at":"2013-12-01T01:52:34Z","donor_id":6,"endowment_id":11,"gross_amount":333.0,"id":3,"net_amount":323.043,"payment_account_id":2,"shares_added":"0.00323043","transaction_fees":9.957,"updated_at":"2013-12-01T01:52:34Z"}}],"total":333.0}
	    	 	
	    	$.each(response.donations, function(k, v) {
	    		var $row = $statement.find('tbody:last').append('<tr></tr>');		
					// And now each bit for our row
					var $col = $statement.find('tr:last').append('<td>' + v.donation.created_at + '</td>');
					var $col = $statement.find('tr:last').append('<td>Endowment_id: ' + v.donation.endowment_id + '</td>');
					var $col = $statement.find('tr:last').append('<td>' + v.donation.gross_amount + '</td>');

	    	});

	    	$statement.find('#statement-total').html("<span>Total:</span>" + response.total);

	    	// and open new window/render
	    	var popup = window.open();
	    	var html = $('<html>').append($statement).html();
	    	popup.document.write(html);
	    	// console.log(html);
		  },
		  failure: function(response) {
		  	//console.log(data);
		  	window.location.href = "index.html";
		  }
		});

	});
	// display statement.html
	e.preventDefault();

});


// $.("#statement-print").on("click", function(e) {
    
//   window.print();

// });


	
  $('#donor_statement_year').on("change", function(e) {
  	
    /*
	  // Get Donor Statement
		var statement_start_date = new Date($("#donor_statement_year").val(),0,1);
		var statement_end_date = new Date($("#donor_statement_year").val(),11,31);
		var pretty_start_date = statement_start_date.getFullYear() + "-" + statement_start_date.getMonth() + "-" + statement_start_date.getDate();
		var pretty_end_date = statement_end_date.getFullYear() + "-" + statement_end_date.getMonth() + "-" + statement_end_date.getDate();
		*/

  	$.ajax({

		  url: 'https://api.giv2giv.org/api/donors/donations.json',
		  method: 'GET',
		  data: {"start_date" : "2014-01-01", "end_date" : "2014-12-31" },
			contentType: "application/json",
			dataType:"json",

		  success: function(response) {
				// need to do response.donations.each
				// response looks like: {"donations":[{"donation":{"created_at":"2013-12-01T01:52:34Z","donor_id":6,"endowment_id":11,"gross_amount":333.0,"id":3,"net_amount":323.043,"payment_account_id":2,"shares_added":"0.00323043","transaction_fees":9.957,"updated_at":"2013-12-01T01:52:34Z"}}],"total":333.0}
	    		var donations = { date: 'funDate', description: "funDescription", amount: "funAmount" };
	    		$(".table-striped tbody").children().remove();
	    		$("#donation-row-template").tmpl(donations).appendTo(".table-striped tbody");

	    	// console.log(data)

		  },
		  failure: function(response) {
		  	//console.log(data);
		  	window.location.href = "index.html";
		  }
		
		});
	});
});