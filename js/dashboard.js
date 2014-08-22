// Dashboard UI
// Bill Mei, 2014

// Signal Hook
var DashboardUI = {
	start : new signals.Signal() 
};

// Add Listener
DashboardUI.start.add(onStart);

// (Re)Start Dashboard UI
function onStart() {
	fetchDonorData();
}

function fetchDonorData() {
	$.ajax({
		url: server_url + '/api/donors/subscriptions.json',
		type: 'GET',
		contentType: 'application/json',
		dataType: 'json'
	})
	.done(function(data) {
		displayPie(data);
	})
	.fail(function(data) {
		log(data);
		growlError('An error occured while loading the dashboard.');
	});

	$.ajax({
		url: server_url + '/api/donors/balance_information.json',
		type: 'GET',
		contentType: 'application/json',
		dataType: 'json'
	})
	.done(function(data) {
		console.log(data)
		displayBar(data);
	})
	.fail(function(data) {
		log(data);
		growlError('An error occured while loading the dashboard.');
	});
}

function displayBar(data) {

}

// @param subs is an array of endowment objects
function displayPie(subs) {
	var endowmentData = [];

	var colors = [
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
	];
	var colorsLight = [
		"#47e35a",
		"#40b1bb",
		"#ffb053",
		"#ff5d53",
		"#1ab32d",
		"#1b8892",
		"#df771a",
		"#df241a",
		"#b1ffbd",
		"#afffff",
		"#ffe4b4",
		"#ffb9b4",
		"#1a9229",
		"#1b7078",
		"#b5631a",
		"#b5221a"
	];

	for (var i = 0; i < subs.length; i++) {
		endowmentData[i] = {};
		endowmentData[i].label = subs[i].name;
		endowmentData[i].value = subs[i].my_balances.my_endowment_balance;
		endowmentData[i].color = colors[i % colors.length];
		endowmentData[i].highlight = colorsLight[i % colorsLight.length];
	}

	options = {};
	var ctx = $('#endowmentPie').get(0).getContext('2d');
	var endowmentPie = new Chart(ctx).Pie(endowmentData, options);
}
