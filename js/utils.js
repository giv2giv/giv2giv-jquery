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
GLOBAL.DEBUG = false;
log = function () {
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
		}

		DOMnode.highcharts({
			chart: {
				type: 'line',
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
					var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
					var month = months[this.point.x.getMonth() - 1];
					return month + ' ' + this.point.x.getDate() + ', ' + this.point.x.getFullYear() + '<br/>$' + this.point.y.toFixed(2);
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
// (function () {
// 	var po = document.createElement('script');
// 	po.type = 'text/javascript';
// 	po.async = true;
// 	po.src = 'https://plus.google.com/js/client:plusone.js?onload=start';
// 	var s = document.getElementsByTagName('script')[0];
// 	s.parentNode.insertBefore(po, s);
// })();

