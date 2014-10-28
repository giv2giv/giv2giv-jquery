
$(document).ready(function($) {

        var insertion_html="<form><input/><input type='submit' value='Authorize Payment'/></form>";

        $("#donation-widget").html("<a href='#happy' id='donation_button'>Click me to get a CC form</a>");

        $.getScript("https://simplemodal.googlecode.com/files/jquery.simplemodal.1.4.4.min.js")
        .success(function() 
        {  
            console.log( "Load was performed." );
        
            $('#donation-widget').click(function() {$.modal(insertion_html)});
        })
        .fail(function() {console.log( "Load was notperformed." ) });


        //$('#login-form').modal();
        //$.modal('hi');
        
        /******* Load CSS *******/
        var css_link = $("", { 
            rel: "stylesheet", 
            type: "text/css", 
            href: "widget.css" 
        });
        //css_link.appendTo('head');          

        /******* Load HTML *******/
        var jsonp_url = "https://apitest.giv2giv.org/api/endowment/anonymous_donation.json?callback=?";
        //$.getJSON(jsonp_url, function(data) {
          //$('#example-widget-container').html("This data comes from another server: " + data.html);
        //});

    }); //.ready
