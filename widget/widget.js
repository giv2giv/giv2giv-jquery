(function(window, document) {"use strict";  /* Wrap code in an IIFE */

var jQuery, $; // Localize jQuery variables

var HOST = 'http://test.giv2giv.org/widget/'; // also set host in widget_example.html
var APIHOST = 'http://apitest.giv2giv.org/api';
var STRIPE_KEY = 'pk_test_d678rStKUyF2lNTZ3MfuOoHy';


function loadScript(url, callback) {

  /* Load script from url and calls callback once it's loaded */
  var scriptTag = document.createElement('script');
  scriptTag.setAttribute("type", "text/javascript");
  scriptTag.setAttribute("src", url);
  if (typeof callback !== "undefined") {
    if (scriptTag.readyState) {
      /* For old versions of IE */
      scriptTag.onreadystatechange = function () { 
        if (this.readyState === 'complete' || this.readyState === 'loaded') {
          callback();
        }
      };
    } else {
      scriptTag.onload = callback;
    }
  }
  (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(scriptTag);
}



function main() {


//    $(function() {

      /* The main logic of our widget is here */
      /* We should have fully loaded jquery, jquery-ui and all plugins */

      var script = $('#giv2giv-script'),

      charity_preferences = {
        charity_id: script.data('charity-id'),
        minamt: script.data('minimum-amount'),
        maxamt: script.data('maximum-amount'),
        minpct: script.data('minimum-passthru-percentage'),
        maxpct: script.data('maximum-passthru-percentage'),
        inc: script.data('incremenent'),
        initial_amount: script.data('initial-amount'),
        initial_passthru: script.data('initial-passthru'),
        theme: script.data('theme'),
        add_fees: script.data('donor-add-fees')
      },
      div = $('#giv2giv-button'),
      frm = $('#giv2giv-form'),
      dialog = $('#giv2giv-dialog'),
      amountSlider = $('#giv2giv-amount-slider'),
      passthruSlider = $('#giv2giv-passthru-slider'),
      amount = $('#giv2giv-amount'),
      passthru = $('#giv2giv-passthru-percent'),
      donationDetails = $('#giv2giv-donation-details'),
      addFeesLabel = $('#giv2giv-add-fees-label'),
      addFees = $('#giv2giv-add-fees'),
      charityPrefs = $.extend({
        charity_id: null,
        minamt: 5.00,
        maxamt: 10000,
        minpct: 0,
        maxpct: 100,
        inc: 1.00,
        initial_amount: 25,
        initial_passthru: 50,
        theme: "flick",
        add_fees: true
      }, charity_preferences);


      // Themes from jQueryUI http://jqueryui.com/themeroller/
      // ui-lightness, ui-darkness, smoothness, start, redmond, sunny, overcast, le-frog,
      // flick, pepper-grinder, eggplant, dark-hive, cupertino, south-street, blitzer, humanity
      // hot-sneaks, excite-bike, vader, dot-luv, mint-choc, black-tie, trontastic, swanky-purse
      
      var giv2givHead  = document.getElementsByTagName('head')[0];
      var giv2givLink  = document.createElement('link');
      giv2givLink.rel  = 'stylesheet';
      giv2givLink.type = 'text/css';
      giv2givLink.href = 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.3/themes/' + charityPrefs.theme + '/jquery-ui.css';
      giv2givLink.media = 'all';
      giv2givHead.appendChild(giv2givLink);
    
      div.css(
        {
          'border':'3px solid black',
          'height':50,
          'width':125
        }
      );

      addFees.prop("checked", charityPrefs.add_fees==true);

      if (charityPrefs.charity_id == null) {
        var div_html = "script tag missing data-charity-id=YOURCHARITYID";
        div.html(div_html);
        return;
      }



      // tabify bank account / credit card tabs
      $( "#giv2giv-tabs" ).tabs({
        activate: function() {
          donationDetails.empty().append(returnFormattedDonationDetails(amount, passthru, addFees));
          addFeesLabel.html(returnFormattedAmountDetails(amount));
        },
        create: function() {
          donationDetails.empty().append(returnFormattedDonationDetails(amount, passthru, addFees));
        }
      });


      var json_url = APIHOST + "/charity/"+charityPrefs.charity_id+"/widget_data.json";

      $.getJSON(json_url, function(charity) {
        var dialog = $( "#giv2giv-dialog" ).dialog({
          autoOpen: false,
          title: "Donate to " + charity.name + " through giv2giv.org",
          height: 'auto',
          width: '450px',
          modal: true,
          fluid: true,
          buttons: {
            Submit: function( event ){
              event.preventDefault();
              frm.find('button').prop('disabled', true);

              // increase amount if donor assuming fees
              charityPrefs.add_fees==true ? amount.val(parseStrToNum(amount.val())+calculateFee(amount)) : "";

              if (whichProcessor()=='dwolla') {
                 frm
                  .attr('action', APIHOST + '/charity/' + charity.id + '/dwolla.json')
                  .submit();
              } 
              else if (whichProcessor()=='stripe') { // is stripe
                // Disable the submit button to prevent repeated clicks

                Stripe.card.createToken(frm, function(status, response) {
                  if (response.error) {
                    // Show the errors on the form
                    $( "#giv2giv-results" ).text(response.error.message);
                    $( "#giv2giv-results" ).dialog( "open" );
                    frm.find('button').prop('disabled', false);
                  } else {
                    // charge success
                    // response contains id, token and card, which contains additional card details like last4
                    var token = response.id;

                    // Insert the token into the form so it gets submitted to the server
                    frm.append($('<input type="hidden" name="giv2giv-stripeToken" />').val(token));
                    //convert the donation string $52.34 to a number
                    amount.val(parseStrToNum(amount.val()));

                    $.ajax({
                      data: frm.serialize(),
                      url: APIHOST + '/charity/' + charity.id + '/' + whichProcessor() + '.json',
                      cache: false
                    }).done(function (response) {
                      console.log(response);
                      // Show the success on the form
                      $( "#giv2giv-results" ).dialog( "open" );
                    });

                  }

                });
              }
            },
            Cancel: function() {
              dialog.dialog( "close" );
            }
          },
          close: function() {
            amount.removeClass( "ui-state-error");
          }
        });

        // Show widget when button clicked
        div.button().on( "click", function() {
          dialog.dialog( "open" );
        });

        // Init the amount slider
        amountSlider.slider({
          animate: true,
          value: charityPrefs.initial_amount,
          min: charityPrefs.minamt,
          max: charityPrefs.maxamt,
          step: charityPrefs.inc,
          slide: function(event, ui) {
            amount
              .val("$" + ui.value) // Update donation amount
              .trigger('update'); // Parse, format, update
          }
        });

        // Init the passthru slider
        passthruSlider.slider({
          animate: true,
          value: charityPrefs.initial_passthru,
          min: charityPrefs.minpct,
          max: charityPrefs.maxpct,
          step: charityPrefs.inc,
          slide: function(event, ui) {
            passthru
              .val(ui.value+"%") // Update donation passthru
              .trigger('update'); // Parse, format, update
          }
        });

        // set Stripe key

        $.getScript("https://js.stripe.com/v2/", function() {
            Stripe.setPublishableKey(STRIPE_KEY);
        });

        // Attach listeners to the amount input fields to update the slider when amount is changed
        amount
          .on('keyup blur update', function(e) {
            // Parse input field
            var rawVal = parseStrToNum(amount.val());

            // Update slider amount, but only
            // if the update didn't originate 
            // from the manual slider change
            if(e.type !== 'update') {
              amountSlider.slider("value", rawVal);
            }

            // No need to format the amount
            // on every keystroke
            if(e.type !== 'keyup') {
              // Parse and format amount
              var rawVal = parseStrToNum(amount.val()) || charityPrefs.minamt,
                //val = rawVal.formatMoney(2, '.', ',');
                val = formatMoney(rawVal);
        
              // Update input field
              amount.val('$' + val);
            }

            // Update details
            donationDetails.html(returnFormattedDonationDetails(amount, passthru, addFees));
            addFeesLabel.html(returnFormattedAmountDetails(amount));
          })
          .on('click', function() {
            // Select all text in input field
            // when clicking inside it
            amount
              .focus()
              .select();
          });

          // Attach listeners to the amount input fields to update the slider when amount is changed
        passthru
          .on('keyup blur update', function(e) {
            // Parse input field
            var rawVal = parseStrToNum(passthru.val());

            // Update slider amount, but only
            // if the update didn't originate 
            // from the manual slider change
            if(e.type !== 'update') {
              passthruSlider.slider("value", rawVal);
            }

            // No need to format the amount
            // on every keystroke
            if(e.type !== 'keyup') {
              // Parse and format amount
              var rawVal = parseStrToNum(passthru.val()) || charityPrefs.minpct,
                val = rawVal;//.formatPercent(2, '.', ',');
        
              // Update input field
              passthru.val(val+'%');
            }

            // Update details
            donationDetails.html(returnFormattedDonationDetails(amount, passthru, addFees));

          })
          .on('click', function() {
            // Select all text in input field
            // when clicking inside it
            passthru
              .focus()
              .select();
          });

        // Manually update the field amount
        // to match the slider's initial amount
        // and trigger a blur event to update
        // the tooltips
        amount
          .val("$" + amountSlider.slider("value"))
          .trigger('update');

        passthru
          .val(passthruSlider.slider("value")+'%')
          .trigger('update');

        // Fee assumption toggle button
        addFees.change(function() {
          var el = $(this);
          charityPrefs.addFees = el.is(':checked');
          donationDetails.empty().append(returnFormattedDonationDetails(amount, passthru, addFees));
          addFeesLabel.html(returnFormattedAmountDetails(amount));
          amount.trigger('update'); // Update tooltips
          passthru.trigger('update'); // Update tooltips
        });

        // Validation
        $('.validate_form').each(function() {
           $(this).validate();
        });

        // Forms
        $('input')
          .on('focus', function() {
            $(this)
              .addClass('active')
              .parents('.input_wrapper')
                .addClass('active');
          })
          .on('blur', function() {
            $(this)
              .removeClass('active')
              .parents('.input_wrapper')
                .removeClass('active');
          });
        // Cool tooltips
        //$(document).tooltip( {
        //  content:function(){
        //    return this.getAttribute("title");
        //  }
        //});
        $( "#giv2giv-accordion" ).accordion({
          active: false,
          collapsible: true,
          heightStyle: "fill"

        });

        $( "#giv2giv-results" ).dialog({
          autoOpen: false,
          modal: true,
          buttons: {
            Ok: function() {
              $( this ).dialog( "close" );
              $( "#giv2giv-dialog" ).dialog( "close" );
            }
          },
          close: function() { 
            $( "#giv2giv-dialog" ).dialog( "close" );
          }
        });


//     Load the FB.ui JS library
      window.fbAsyncInit = function() {
        FB.init({
          appId      : '642257835904820',
          xfbml      : true,
          version    : 'v2.3'
        });
      };
      (function(d, s, id){
         var js, fjs = d.getElementsByTagName(s)[0];
         if (d.getElementById(id)) {return;}
          js = d.createElement(s); js.id = id;
          js.src = "//connect.facebook.net/en_US/sdk.js";
          fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));




//    Share on facebook code
     $('#fb-share').click(function() {
        FB.ui({
          method: 'feed',
          link: 'https://giv2giv.org/#charity/' + $('#giv2giv-script').attr('data-charity-id'),
          caption: 'I just donated to ' + charity.name + 'using Giv2Giv!',
        }, function(response){});

      })

     $('#twitter-share').attr("href", "https://twitter.com/intent/tweet?text=" + "I donated to a charity using Giv2Giv! Check it out here!&url=https://giv2giv.org/#charity/" + $('#giv2giv-script').attr('data-charity-id'))

      /*
        // Bind form enter key
        $("form").not('#frm-feedback').find("input").last().keydown(function(e) {
          if(e.keyCode == 13) {
            $(this).parents('form').submit();
          }
        });




        // Generate and update tooltips
        var rawVal = parseStrToNum(amount.val()) || gatewayOpts.min
        var stripeMoneyLeft = gatewayOpts.addFees ? rawVal : (rawVal - ((rawVal * 0.029) + 0.30)),
          dwollaMoneyLeft = gatewayOpts.addFees ? rawVal : (rawVal - (rawVal > 10 ? 0.25 : 0));

        stripePayBtn
          .data('tooltip', 'The nonprofit will receive <strong>$' + stripeMoneyLeft.formatMoney(2, '.', ',') + '</strong> (after fees) using this method');
          .tooltip('refresh');
        dwollaPayBtn
          .data('tooltip', 'The nonprofit will receive <strong>$' + dwollaMoneyLeft.formatMoney(2, '.', ',') + '</strong> (after fees) using this method');
          .tooltip('refresh');
      */

      }); // getJSON end


  } // end main()


/**
 * Returns an HTML string with the donations details
*/
var returnFormattedDonationDetails = function (amount, passthru, addFees) {
  var val, transactionAmount, amount_passthru, percent_passthru, amount_invested, net_amount=0, fee=0;

  if (addFees.is(':checked')) {
    transactionAmount = parseStrToNum(amount.val()) + calculateFee(amount);
  }
  else {
    transactionAmount = parseStrToNum(amount.val());
    fee = calculateFee(amount);
  }
  net_amount = transactionAmount - fee;

  percent_passthru = parseStrToNum(passthru.val()) / 100; // convert int to percent e.g. 50 to .5
  amount_passthru = net_amount * percent_passthru;
  amount_invested = net_amount - amount_passthru;

  val = "<h3>Summary:</h3>";
  val += "<li>$" + formatMoney(amount_passthru) + " will be immediately sent to the charity</li>";
  val += "<li>$" + formatMoney(amount_invested) + " will be invested to sustain the charity over time</li>";
  val += "</ul>";
  val += "<br />Your total donation today is: $" + formatMoney(transactionAmount);
  return val;
}

var returnFormattedAmountDetails = function (amount) {
  var fee = calculateFee(amount);
  return "Add transaction fee of "; + formatMoney(fee) + "?";
}


var whichProcessor = function() {
  //if ($('#giv2giv-tabs').tabs('option','active')==0)
//    return "dwolla";
//  else if ($('#giv2giv-tabs').tabs('option','active')==1)
    return "stripe";
}

/**
 * Returns fee (2-digit float) amount
*/
var calculateFee = function (amount) {
  var fee;
  var thisAmount = parseStrToNum(amount.val());
  switch (whichProcessor()) {
    case "stripe":
      fee = 0.3 + parseFloat((.029 * thisAmount).toFixed(2));
    break;
    case "dwolla":
      fee = 0.0
      //if (thisAmount > 10.0) {
        //fee = 0.25;
      //}
    break;
    default:
      fee = 0.0;
  }
  return fee;
}



/**
 * Parses a string into a number
 *
 * parseStrToNum('$0.01aab');
 * @desc removes all non-alpha numeric characters from the string
 *
 * @name parseStrToNum
 * @param {string} string to parse
 * @return {number} parsed number
*/
var parseStrToNum = function(str) {
  var num = +str.replace(/[^0-9\.]+/g, '');
  var dec = 2;
  var d = 1;
  for (var i=0; i<dec; i++){
    d += "0";
  }
  return Math.round(num * d) / d;

  //return val;
}


var formatMoney = function(n, c, d, t){
  var n = isNaN(n = Math.abs(n)) ? 0 : n, c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "." : d, t = t == undefined ? "," : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;

  return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
}

/**
 * Formats a number into currency standards
 *
 * .formatNumber(2, '.', ',');
 * @desc adds dots and commas to format a number into currency
 *       standards
 *
 * @name parseStrToNum
 * @param {string} string to parse
 * @return {number} parsed number

Number.prototype.formatMoney = function(c, d, t){
  var n = this, c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "," : d, t = t == undefined ? "." : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;

  return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
}
*/


/* Load jQuery */
loadScript("//ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js", function() {

  /* Restore $ and window.jQuery to their previous values and store the
     new jQuery in our local jQuery variables. */
  $ = jQuery = window.jQuery.noConflict(true);

  $('#giv2giv-button').load(HOST+'/button_contents.html');

  loadScript(HOST + "jquery-ui.min.js", function() { // load locally-modified JS
    initjQueryUIPlugin(jQuery);
    loadScript(HOST + "jquery.validate.min.js", function() {
      initjQueryValidatePlugin(jQuery);
      main(); // call our main function
    });
  });

});


}(window, document)); /* end IIFE */



