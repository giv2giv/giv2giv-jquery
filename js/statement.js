// Statement Renderer
// Michael Dream Team, 2014

$(document).ready(function() {     
	$("#statement-print").on("click", function(e) {
		window.print();
	});
});

/*
	
	$('#donor_statement_year').on("change", function(e) {
		
		// Get Donor Statement
		var statement_start_date = new Date($("#donor_statement_year").val(),0,1);
		var statement_end_date = new Date($("#donor_statement_year").val(),11,31);
		var pretty_start_date = statement_start_date.getFullYear() + "-" + statement_start_date.getMonth() + "-" + statement_start_date.getDate();
		var pretty_end_date = statement_end_date.getFullYear() + "-" + statement_end_date.getMonth() + "-" + statement_end_date.getDate();


		$.ajax({

			url: GLOBAL.SERVER_URL + '/api/donors/donations.json',
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
*/
