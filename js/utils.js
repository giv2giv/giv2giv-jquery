// ==================== //
// UTILITY FUNCTIONS    //
// AND GLOBAL CONSTANTS //
// ==================== //

// GLOBAL CONSTANTS
var GLOBAL = {};
GLOBAL.MIN_DONATION = 5; // $5.00 minimum donation
GLOBAL.SERVER_URL = "https://apitest.giv2giv.org";

// Setup Stripe
GLOBAL.STRIPE_PUB_KEY = "pk_test_d678rStKUyF2lNTZ3MfuOoHy";
Stripe.setPublishableKey(GLOBAL.STRIPE_PUB_KEY);


// Awesome Logging
// Only display console log output in debug mode, else nothing.
// @TODO - Send serious logs to server?
GLOBAL.DEBUG = true;
log = function() {
	if (GLOBAL.DEBUG && console && typeof console.log === "function") {
		for (var i = 0, ii = arguments.length; i < ii; i++) {
			console.log(arguments[i]);
		}
	}
};

// Bootstrap Growl Helpers
// Growl Error
function growlError(message) {
	$.bootstrapGrowl(message + "&nbsp;", {
		ele: "body", // which element to append to
		type: "danger", // (null, "info", "danger", "success")
		offset: {
			from: "top",
			amount: 20
		}, // "top", or "bottom"
		align: "center", // ("left", "right", or "center")
		width: "auto", // (integer, or "auto")
		delay: 5000,
		allow_dismiss: true,
		stackup_spacing: 10 // spacing between consecutively stacked growls.
	});
}

// Growl Success
function growlSuccess(message) {
	$.bootstrapGrowl(message + "&nbsp;", {
		ele: "body", // which element to append to
		type: "success", // (null, "info", "danger", "success")
		offset: {
			from: "top",
			amount: 20
		}, // "top", or "bottom"
		align: "center", // ("left", "right", or "center")
		width: "auto", // (integer, or "auto")
		delay: 5000,
		allow_dismiss: true,
		stackup_spacing: 10 // spacing between consecutively stacked growls.
	});
}

function balanceGraph(data, DOMnode, titleText, series, label) {
	var balance = [];

	var zeroData = false;
	if (typeof data.donor_balance_history !== 'undefined' &&
		typeof data.donor_current_balance !== 'undefined') {
		if (data.donor_balance_history.length === 0 &&
			data.donor_current_balance === 0) {
			zeroData = true;
		}
	}

	if (series !== 'global_balance_history' &&
		series !== 'global_projected_balance' && zeroData) {
		DOMnode.html(
			'<h3>' + titleText + '</h3>' +
			'<p>You haven\'t subscribed to any endowments yet.</p>' +
			'<p><a href="/" class="btn btn-primary find-endowment-btn">Find an Endowment</a></p>'
		);
	} else {
		var content = data[series];
		for (var i = 0; i < content.length; i++) {
			balance[i] = {};
			balance[i].x = new Date(content[i].date);
			balance[i].y = content[i][label];
			balance[i].donations = content[i].total_donations || null;
			balance[i].fees = content[i].total_fees || null;
			balance[i].grants = content[i].total_grants || null;
		}

		DOMnode.highcharts({
			chart: {
				type: 'spline',
				backgroundColor: '#fbfbfb'
			},
			title: { text: titleText },
			xAxis: {
				type: 'datetime',
				title: {
					text: 'Date'
				}
			},
			yAxis: {
				title: {
					text: '($ USD)'
				},
				min: 0
			},
			series: [{
				name: '$',
				data: balance
			}],
			legend: {
				enabled: false
			},
			tooltip: {
				formatter: function() {
					// The following regex formats stuff to a correct currency value
					// .toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
					// via http://stackoverflow.com/a/14428340
					var donations = '';
					var fees = '';
					var grants = '';
					var balance = '<br/>Balance: $' + this.point.y.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
					if (this.point.donations) {
						donations += '<br/>Donations: $' + this.point.donations.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
					}
					if (this.point.fees) {
						fees += '<br/>Fees: $' + this.point.fees.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
					}
					if (this.point.grants && this.point.y !== this.point.grants) {
						grants += '<br/>Grants: $' + this.point.grants.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
					} else {
						balance = '<br/>Balance: $' + this.point.y.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
					}
					var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
					var month = months[this.point.x.getMonth() - 1];
					return month + ' ' + this.point.x.getDate() + ', ' + this.point.x.getFullYear() + donations + grants + fees + balance;
				}
			},
			credits: { enabled: false }
		});
	}
}

// Highcharts colors
Highcharts.setOptions({
	colors: [
		"#2DC940",
		"#2697A1",
		"#FF9639",
		"#FF4339",
		"#009913",
		"#016E78",
		"#C55D00",
		"#C50A00",
		"#97F9A3",
		"#95ECF4",
		"#FFCA9A",
		"#FF9F9A",
		"#00780F",
		"#01565E",
		"#9B4900",
		"#9B0800"
	]
});

// Google Plus Sign-In
// (function() {
// 	var po = document.createElement('script');
// 	po.type = 'text/javascript';
// 	po.async = true;
// 	po.src = 'https://plus.google.com/js/client:plusone.js?onload=start';
// 	var s = document.getElementsByTagName('script')[0];
// 	s.parentNode.insertBefore(po, s);
// })();


/**
 * Return a timestamp with the format "m/d/yy h:MM:ss TT"
 * @type {Date}
 */
 
function prettify_timestamp(stamp) {
	 
// Create an array with the current month, day and time
	var date = [ stamp.getMonth() + 1, stamp.getDate(), stamp.getFullYear() ];
 
// Create an array with the current hour, minute and second
	var time = [ stamp.getHours(), stamp.getMinutes(), stamp.getSeconds() ];
 
// Determine AM or PM suffix based on the hour
	var suffix = ( time[0] < 12 ) ? "AM" : "PM";
 
// Convert hour from military time
	time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;
 
// If hour is 0, set it to 12
	time[0] = time[0] || 12;
 
// If seconds and minutes are less than 10, add a zero
	for ( var i = 1; i < 3; i++ ) {
		if ( time[i] < 10 ) {
			time[i] = "0" + time[i];
		}
	}
 
// Return the formatted string
	return date.join("/") + " " + time.join(":") + " " + suffix;
}

String.prototype.titleize = function() {
  var words = this.split(' ')
  var array = []
  for (var i=0; i<words.length; ++i) {
    array.push(words[i].charAt(0).toUpperCase() + words[i].toLowerCase().slice(1))
  }
  return array.join(' ')
}