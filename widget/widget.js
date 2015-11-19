(function(window, document) {
    "use strict"; /* Wrap code in an IIFE */

    var jQuery, $; // Localize jQuery variables

    var HOST = 'https://giv2giv.org/widget/'; // also set host in widget_example.html
    var APIHOST = 'https://api.giv2giv.org/api';
    var STRIPE_KEY = 'pk_test_d678rStKUyF2lNTZ3MfuOoHy';

    var charity_glob = '';

    function loadScript(url, callback) {

        /* Load script from url and calls callback once it's loaded */
        var scriptTag = document.createElement('script');
        scriptTag.setAttribute("type", "text/javascript");
        scriptTag.setAttribute("src", url);
        if (typeof callback !== "undefined") {
            if (scriptTag.readyState) {
                /* For old versions of IE */
                scriptTag.onreadystatechange = function() {
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

            /* The main logic of our widget is here */
            /* We should have fully loaded jquery, jquery-ui and all plugins */

            var script = $('#giv2giv-script'),

                charity_preferences = {
                    charity_id: script.data('charity-id'),
                    minamt: script.data('minimum-amount'),
                    maxamt: script.data('maximum-amount'),
                    inc: script.data('incremenent'),
                    initial_amount: script.data('initial-amount'),
                    initial_passthru: script.data('initial-passthru'),
                    theme: script.data('theme'),
                    add_fees: script.data('donor-add-fees'),
                    share_info: script.data('donor-share-info'),
                    mode: script.data('mode'),
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
                    inc: 1.00,
                    initial_amount: 25,
                    initial_passthru: 50,
                    theme: "flick",
                    add_fees: true,
                    share_info: true,
                    mode: "test",
                }, charity_preferences);

            if (charityPrefs.mode != 'live');
            charityPrefs.mode = 'test';



            // Themes from jQueryUI http://jqueryui.com/themeroller/
            // ui-lightness, ui-darkness, smoothness, start, redmond, sunny, overcast, le-frog,
            // flick, pepper-grinder, eggplant, dark-hive, cupertino, south-street, blitzer, humanity
            // hot-sneaks, excite-bike, vader, dot-luv, mint-choc, black-tie, trontastic, swanky-purse

            var giv2givHead = document.getElementsByTagName('head')[0];
            var giv2givLink = document.createElement('link');
            giv2givLink.rel = 'stylesheet';
            giv2givLink.type = 'text/css';
            giv2givLink.href = 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.3/themes/' + charityPrefs.theme + '/jquery-ui.css';
            giv2givLink.media = 'all';
            giv2givHead.appendChild(giv2givLink);

            div.css({
                'display': 'block',
                'border': '3px solid black',
                'height': 50,
                'width': 125
            });


            /*addFees.prop("checked", charityPrefs.add_fees==true);*/
            //$("giv2giv-share-email-label1").prop("checked", true);
            //$("giv2giv-recurring-label1").prop("checked", true);

            if (charityPrefs.charity_id == null) {
                var div_html = "script tag missing data-charity-id=YOURCHARITYID";
                div.html(div_html);
                return;
            }

            // tabify bank account / credit card tabs
            $("#giv2giv-tabs").tabs({
                activate: function() {
                    //donationDetails.empty().append(returnFormattedDonationDetails(amount, passthru, addFees));
                    //addFeesLabel.html(returnFormattedAmountDetails(amount));
                },
                create: function() {
                    //donationDetails.empty().append(returnFormattedDonationDetails(amount, passthru, addFees));
                }
            });

            var json_url = APIHOST + "/charity/" + charityPrefs.charity_id + "/widget_data.json";

            $.getJSON(json_url, function(charity) {
                charity_glob = charity.name;
                $("#giv2giv-share-info-label").text('Share my info with ' + charity.name + '?');
                var dialog = $("#giv2giv-dialog").dialog({
                    autoOpen: false,
                    title: "Donate to " + charity.name + " through giv2giv.org",
                    height: 'auto',
                    width: '450px',
                    modal: true,
                    fluid: true,
                    buttons: {
                        'Donate Now!': function(event) {
                            event.preventDefault();

                            var expgroup = $("#giv2giv-expiry").val();
                            var expArray = expgroup.split('/');
                            var expmm = parseInt(expArray[0]);
                            var expyy = parseInt(expArray[1]);

                            frm.find('button').prop('disabled', true);


                            // increase amount if donor assuming fees
                            //charityPrefs.add_fees==true ? amount.val(parseStrToNum(amount.val())+calculateFee(amount)) : "";

                            if (whichProcessor() == 'dwolla') {
                                frm
                                    .attr('action', APIHOST + '/charity/' + charity.id + '/dwolla.json')
                                    .submit();
                            } else if (whichProcessor() == 'stripe') { // is stripe
                                // Disable the submit button to prevent repeated clicks

                                $('.pleasewait').css({
                                    'display': 'block'
                                });

                                Stripe.card.createToken({
                                    number: $('#giv2giv-number').val(),
                                    exp_month: expmm,
                                    exp_year: expyy,
                                    cvc: $('#giv2giv-cvc').val()
                                }, function(status, response) {
                                    if (response.error) {
                                        // Show the errors on the form
                                        $('.pleasewait').css({
                                            'display': 'none'
                                        });
                                        $("#giv2giv-resultsfail").text(response.error.message);
                                        $("#giv2giv-resultsfail").dialog("open");
                                        frm.find('button').prop('disabled', false);
                                    } else {

                                        // response contains id, token and card, which contains additional card details like last4
                                        var token = response.id;

                                        // Insert the token into the form so it gets submitted to the server
                                        frm.append($('<input type="hidden" name="giv2giv-stripeToken" id="giv2giv-stripeToken" />').val(token));
                                        frm.append($('<input type="hidden" name="giv2giv-mode" id="giv2giv-mode" />').val(charityPrefs.mode));

                                        // Don't send CC number to giv2giv
                                        $('#giv2giv-number').val('');

                                        //convert the donation string $52.34 to a number
                                        amount.val(parseStrToNum(amount.val()));
                                        var frmserialize = frm.serialize();

                                        if ($('#giv2giv-recurring-label1').is(':checked')) {

                                            frmserialize = frmserialize.replace('giv2giv-recurring=nil&', '');

                                        }
                                        if ($('#giv2giv-share-info-label1').is(':checked')) {

                                            frmserialize = frmserialize.replace('giv2giv-share-info=nil&', '');

                                        }

                                        $.ajax({
                                            data: frmserialize,
                                            url: APIHOST + '/charity/' + charity.id + '/' + whichProcessor() + '.json',
                                            beforeSend: function() {
                                                $('.pleasewait').show();
                                            },
                                            complete: function() {
                                                $('.pleasewait').hide();
                                            },
                                            cache: false
                                        }).done(function(response) {
                                            // Clear out the form
                                            $('.pleasewait').css({
                                                'display': 'none'
                                            });
                                            frm.trigger('reset');
                                            $('#giv2giv-stripeToken').remove();
                                            $('#giv2giv-mode').remove();
                                            $('#giv2giv-amount').val("$" + charityPrefs.initial_amount).trigger('update');

                                            // Show the success on the form
                                            $("#giv2giv-results").dialog("open");
                                        });
                                    }
                                });
                            }
                        },
                        Cancel: function() {
                            dialog.dialog("close");
                        }
                    },
                    close: function() {
                        amount.removeClass("ui-state-error");
                    }
                });

                // Show widget when button clicked
                div.button().on("click", function() {
                    dialog.dialog("open");
                });

                // Init the amount slider
                amountSlider.slider({
                    animate: true,
                    min: charityPrefs.minamt,
                    max: charityPrefs.maxamt,
                    step: charityPrefs.inc,
                    slide: function(event, ui) {
                        amount
                            .val("$" + ui.value) // Update donation amount
                            .trigger('update'); // Parse, format, update
                    },
                    create: function(event, ui) {
                        $(this).slider('value', charityPrefs.initial_amount);
                        $('#giv2giv-amount').val("$" + charityPrefs.initial_amount).trigger('update');
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
                            .val(ui.value + "%") // Update donation passthru
                            .trigger('update'); // Parse, format, update

                        $('#makeimpact-percent').text(ui.value + '%');
                        var remainningPercent = 100 - parseInt(ui.value);
                        $('#sustainamission-percent').text(remainningPercent + '%');
                    },
                    create: function(event, ui) {
                        $(this).slider('value', charityPrefs.initial_passthru);
                        $('#makeimpact-percent').text(charityPrefs.initial_passthru + '%');
                        var remainningPercent = 100 - parseInt(charityPrefs.initial_passthru);
                        $('#sustainamission-percent').text(remainningPercent + '%');
                    }
                });

                // set Stripe key

                $.getScript("https://js.stripe.com/v2/", function() {
                    Stripe.setPublishableKey(STRIPE_KEY);
                });
                //$.getScript("https://ws.sharethis.com/button/buttons.js", function() {

                //});

                // Attach listeners to the amount input fields to update the slider when amount is changed
                amount
                    .on('keyup blur update', function(e) {
                        // Parse input field
                        var rawVal = parseStrToNum(amount.val());

                        // Update slider amount, but only
                        // if the update didn't originate 
                        // from the manual slider change
                        if (e.type !== 'update') {
                            amountSlider.slider("value", rawVal);
                        }

                        // No need to format the amount
                        // on every keystroke
                        if (e.type !== 'keyup') {
                            // Parse and format amount
                            var rawVal = parseStrToNum(amount.val()) || charityPrefs.minamt,
                                //val = rawVal.formatMoney(2, '.', ',');
                                val = formatMoney(rawVal);

                            // Update input field
                            amount.val('$' + val);

                            if (charityPrefs.add_fees == true) {
                                $("#totaldonation-value").text('Total Donation: $' + val);
                            }
                        }

                        // Update details
                        donationDetails.html(returnFormattedDonationDetails(amount, passthru, addFees));
                        //addFeesLabel.html(returnFormattedAmountDetails(amount));

                        updateShareText(amount);

                    })
                    .on('click', function() {
                        // Select all text in input field
                        // when clicking inside it
                        amount
                            .focus()
                            .select();
                    });

                $('#giv2giv-amount').val("$" + charityPrefs.initial_amount).trigger('update');


                var rel = charityPrefs.initial_amount;
                $('.choose-donate-amount li').removeClass('active');
                $(".choose-donate-amount li[rel='" + rel + "']").addClass('active');

                $('.choose-donate-amount li').click(function() {
                    $('.choose-donate-amount li').removeClass('active');
                    $(this).addClass('active');
                    var vval = $(this).attr('rel');
                    if ($(this).hasClass('other-input')) {
                        $('.giv2giv-amount-slider-wrapper,#giv2giv-amount').show('fast');
                    } else {
                        $('.giv2giv-amount-slider-wrapper,#giv2giv-amount').hide('fast');
                    }
                    $('#giv2giv-amount').val("$" + vval).trigger('update');
                });
                $('.st_linkedin_large,.st_twitter_large,.st_pinterest_large,.st_googleplus_large,.st_reddit_large,.st_email_large,.st_facebook_large').attr('st_url', window.location.href);


                // Attach listeners to the amount input fields to update the slider when amount is changed
                passthru
                    .on('keyup blur update', function(e) {
                        // Parse input field
                        var rawVal = parseStrToNum(passthru.val());

                        // Update slider amount, but only
                        // if the update didn't originate 
                        // from the manual slider change
                        if (e.type !== 'update') {
                            passthruSlider.slider("value", rawVal);
                        }

                        // No need to format the amount
                        // on every keystroke
                        if (e.type !== 'keyup') {
                            // Parse and format amount
                            var rawVal = parseStrToNum(passthru.val()) || charityPrefs.minpct,
                                val = rawVal; //.formatPercent(2, '.', ',');

                            // Update input field
                            passthru.val(val + '%');
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
                    .val(passthruSlider.slider("value") + '%')
                    .trigger('update');
                /*
                                    // Fee assumption toggle button
                                    addFees.change(function() {
                                            var el = $(this);
                                            charityPrefs.addFees = el.is(':checked');
                                            donationDetails.empty().append(returnFormattedDonationDetails(amount, passthru, addFees));
                                            addFeesLabel.html(returnFormattedAmountDetails(amount));
                                            amount.trigger('update'); // Update tooltips
                                            passthru.trigger('update'); // Update tooltips
                                        });
                */
                $('#giv2giv-form').card({
                    // a selector or DOM element for the container
                    // where you want the card to appear
                    container: '.card-wrapper', // *required*
                    formSelectors: {
                        numberInput: '#giv2giv-number', // optional — default input[name="number"]
                        expiryInput: '#giv2giv-expiry', // optional — default input[name="expiry"]
                        cvcInput: '#giv2giv-cvc', // optional — default input[name="cvc"]
                        nameInput: '#giv2giv-name' // optional - defaults input[name="name"]
                    },

                    width: 200, // optional — default 350px
                    formatting: true, // optional - default true

                    // Strings for translation - optional
                    messages: {
                        validDate: 'valid\ndate', // optional - default 'valid\nthru'
                        monthYear: 'mm/yyyy', // optional - default 'month/year'
                    },
                    // if true, will log helpful messages for setting up Card
                    debug: true // optional - default false

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
                $("#giv2giv-accordion").accordion({
                    active: false,
                    collapsible: true,
                    heightStyle: "fill"

                });

                $("#giv2giv-resultsfail").dialog({
                    autoOpen: false,
                    modal: true,
                    buttons: {
                        Ok: function() {
                            $(this).dialog("close");
                        }
                    }

                });
                $("#giv2giv-results").dialog({
                    autoOpen: false,
                    modal: true,
                    buttons: {
                        Ok: function() {
                            $(this).dialog("close");
                            $("#giv2giv-dialog").dialog("close");
                        }
                    },
                    close: function() {
                        $("#giv2giv-dialog").dialog("close");
                    }
                });


                //     Load the FB.ui JS library
                window.fbAsyncInit = function() {
                    FB.init({
                        appId: '642257835904820',
                        xfbml: true,
                        version: 'v2.3'
                    });
                };
                (function(d, s, id) {
                    var js, fjs = d.getElementsByTagName(s)[0];
                    if (d.getElementById(id)) {
                        return;
                    }
                    js = d.createElement(s);
                    js.id = id;
                    js.src = "//connect.facebook.net/en_US/sdk.js";
                    fjs.parentNode.insertBefore(js, fjs);
                }(document, 'script', 'facebook-jssdk'));



                /*
                                    //    Share on facebook code
                                    $('#fb-share').click(function() {
                                            FB.ui({
                                                    method: 'feed',
                                                    link: 'https://giv2giv.org/#charity/' + $('#giv2giv-script').attr('data-charity-id'),
                                                    caption: 'I just donated to ' + charity.name + 'using Giv2Giv!',
                                                }, function(response){});

                                        })

                                    $('#twitter-share').attr("href", "https://twitter.com/intent/tweet?text=" + "I donated to a charity using Giv2Giv! Check it out here!&url=https://giv2giv.org/#charity/" + $('#giv2giv-script').attr('data-charity-id'))
                */
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
    var returnFormattedDonationDetails = function(amount, passthru, addFees) {
        var val, transactionAmount, amount_passthru, percent_passthru, amount_invested, net_amount = 0,
            fee = 0;

        /*
                    if (addFees.is(':checked')) {
                        transactionAmount = parseStrToNum(amount.val()) + calculateFee(amount);
                    }
                    else {
                        transactionAmount = parseStrToNum(amount.val());
                        fee = calculateFee(amount);
                    }
                    */
        transactionAmount = parseStrToNum(amount.val());
        net_amount = transactionAmount - fee;

        percent_passthru = parseStrToNum(passthru.val()) / 100; // convert int to percent e.g. 50 to .5

        amount_passthru = (Math.ceil(net_amount * percent_passthru * 100) / 100).toFixed(2);
        amount_invested = net_amount - amount_passthru;

        val = "<h3>Summary:</h3>";
        val += "<li>$" + formatMoney(amount_passthru) + " will be immediately sent to " + charity_glob + " the charity</li>";
        val += "<li>$" + formatMoney(amount_invested) + " will be invested to sustain  the charity over time</li>";
        val += "</ul>";
        val += "<br />Your total donation today is: $" + formatMoney(transactionAmount);

        var textSum1 = "$" + formatMoney(amount_passthru) + " will be sent directly to " + charity_glob + " for an immediate impact";
        var textSum2 = "$" + formatMoney(amount_invested) + " will be invested to sustain the mission of " + charity_glob + " by making grants over time";
        $('#makeimpact-badge').attr('data-tooltip', textSum1);
        $('#sustainamission-badge').attr('data-tooltip', textSum2);

        $('#makeimpact-value').text("$" + formatMoney(amount_passthru) + "");
        $('#sustainamission-value').text("$" + formatMoney(amount_invested) + "");
        return val;
    }

    var returnFormattedAmountDetails = function(amount) {
        // console.log(amount.val());
        var tmpfee = formatMoney(calculateFee(amount));
        return "Add transaction fee of $" + tmpfee + "?";
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
    var calculateFee = function(amount) {
        var fee;
        var thisAmount = parseStrToNum(amount.val());
        switch (whichProcessor()) {
            case "stripe":
                fee = 0.3 + parseFloat((.022 * thisAmount).toFixed(2));

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
        for (var i = 0; i < dec; i++) {
            d += "0";
        }
        return Math.round(num * d) / d;

        //return val;
    }

    var updateShareText = function(amount) {

        var returntext = "I give to a sustainable fund for " + charity_glob + " through giv2giv.org. Help make a difference at " + window.location.href + " !";
        $('.st_linkedin_large,.st_twitter_large,.st_pinterest_large,.st_googleplus_large,.st_reddit_large,.st_email_large,.st_facebook_large').attr('st_title', returntext);
    }


    /**
     * function to load a given css file
     */
    var loadCSS = function(href) {
        var cssLink = $("<link rel='stylesheet' type='text/css' href='" + href + "'>");
        $("head").append(cssLink);
    };

    var formatMoney = function(n, c, d, t) {
        var n = isNaN(n = Math.abs(n)) ? 0 : n,
            c = isNaN(c = Math.abs(c)) ? 2 : c,
            d = d == undefined ? "." : d,
            t = t == undefined ? "," : t,
            s = n < 0 ? "-" : "",
            i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
            j = (j = i.length) > 3 ? j % 3 : 0;

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
    loadScript("https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js", function() {

        /* Restore $ and window.jQuery to their previous values and store the
                new jQuery in our local jQuery variables. */
        $ = jQuery = window.jQuery.noConflict(true);

        $('#giv2giv-button').load(HOST + '/button_contents.html');

        loadScript(HOST + "jquery-ui.min.js", function() { // load locally-modified JS
            initjQueryUIPlugin(jQuery);
            //load touchpunch.js file which provides touch events to work with JQuery UI components like slider, drandrop etc
            loadScript(HOST + "touchpunch.js", function() {
                initTouchPunchPlugin(jQuery);
                loadScript(HOST + "package.js", function() {
                    initPlugins(jQuery);

                    main(); // call our main function
                    var switchTo5x = true;
                    stLight.options({
                        publisher: "c8d282c1-3c5a-4364-bd98-2edde663f4ee",
                        shorten: false
                    });
                });
            });

        });

    });

}(window, document)); /* end IIFE */
