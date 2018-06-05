

var locationNumber = -1; // helps cycle through locations
var locations = 20; // array of all points
var numberOfPoints = 13;
var pointsLayer; // holds the layer for the points so we can open the info windows programattically

$.getJSON("/data/punicPoints.json", function (json) {

	createPlaceArray(json);
});


// callback function for the getJSON that gets the json data
function createPlaceArray(json) {

	locations = json;

}

// callback function that sets the layer into pointsLayer
function setPointsLayer(layerFromLayerArray) {
	pointsLayer = layerFromLayerArray;

}


// Choose center and zoom level
var options = {
	center: [36.8529, 10.3217], // Saguntum 39.6799° N, 0.2784° W
	zoom: 5
}

// Instantiate map on specified DOM element
var map_object = new L.Map(map, options);


window.onload = function () {

	// tabs
	$('.top.menu .item').tab();

	// Add a basemap to the map object just created
	L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png', {
		attribution: 'Stamen'
	}).addTo(map_object);

	var vizjson = 'https://olivierid.carto.com/api/v2/viz/b8f4c673-4ac7-47d5-ae41-6e6acadedfcc/viz.json';
	cartodb.createLayer(map_object, vizjson).addTo(map_object).done(function (layers) {
		// layer 0 is the base layer, layer 1 is cartodb layer

		console.log(locations.length);
		numberOfPoints = locations.length;
		console.log(numberOfPoints);
	}).on('error', function (err) {
		console.log("some error occurred: " + err);
	});


}


// when span link is clicked switch to figures tab
$('.ui.button')
	.on('click', function () {
		// programmatically activating tab
		$.tab('change tab', 'tab-name');
	});

// allows you to make a buton go right to figures tab
function switchToFiguresTab() {
	console.log("figures");
  $("#mapTab").removeClass('active');
  $("#figuresTab").addClass('active');
	$.tab('change tab', "figures");
}

// takes you to map tab from intro tab
function switchToMapTab() {
	console.log("figures");
  $("#introTab").removeClass('active');
  $("#mapTab").addClass('active');
	$.tab('change tab', "map");
}



// takes us to Philly
// used in case of an error
// because it's always sunny in Philadelphia

zoomToPhiladelphia = function () {

	map_object.setView([41.9028, 75.1652], 7);
	console.log("City of Brotherly love");

}

// takes us to Rome
// used in case of an error
// because it's always a good idea to go to Rome when things aren't working out

zoomToRome = function () {

	map_object.setView([39.9526, 12.4964], 7);
	console.log("the Eternal city");

}

function displayOrRemoveButtons(locationValue) {

	if (locationValue <= 0) {

	}

}

// checks if it already has a hidden class on it
function hasCertainClass(classToCheckFor, elementId) {
	var classList = $('#' + elementId).attr('class').split(/\s+/); // gets classes
	$.each(classList, function (index, item) {
		if (item === classToCheckFor) {
			//do something
			return true;
		}
	});
	return false;
}

// triggers on the next button
// first runs the navigate forward to move to the next location
// then opens the appropriate popup at the new location
function next() {
	locationNumber++; // increment so it will be the next place next time

	console.log("next " + locationNumber);

	navigateLocationsForward();


	var latlng = L.latLng(locations[locationNumber].latitude, locations[locationNumber].longitude);

	var title = locations[locationNumber].title;
	var text = locations[locationNumber].text;

	//popup options
	var popupOptions = {
		maxWidth: 300,
		maxHeight: 300,
		autoPan: false,
		keepInView: false
	}


	map_object.openPopup("<h3><center>" + title + "</center></h3>" + text, latlng, popupOptions);

}

function previous() {

	locationNumber -= 1; // decrement so it will be the next place next time

	console.log("previous " + locationNumber);
	navigateLocationsBackward();


	var latlng = L.latLng(locations[locationNumber].latitude, locations[locationNumber].longitude);

	var place = locations[locationNumber].place;
	var text = locations[locationNumber].text;

	//popup options
	var popupOptions = {
		maxWidth: 300,
		maxHeight: 300,
		autoPan: false,
		keepInView: false
	}


	map_object.openPopup("<h3><center>" + place + "</center></h3>" + text, latlng, popupOptions);


}

// for when they click the next button
// tries to cycle through the places given to it by the json object
function navigateLocationsForward() {
	// if we don't have data from locations, just go to Rome
	if (locations == null) {
		zoomToRome();
	} else {


		if (locationNumber >= locations.length) {
			// do nothing
		} else {

			// makes the back button visible as soon as there is a previous point to return to
			if (locationNumber >= 0) {

				$("#forwardText").text("Next");
			}
			if (locationNumber === 1) {
				$("#back").removeClass("hidden");
			}
			if (locationNumber === 12) {
				$("#forward").addClass("hidden");
			}


			$('.progress')
				.progress('increment');


			let latitude = locations[locationNumber].latitude;
			let longitude = locations[locationNumber].longitude;


			//map_object.setView([latitude, longitude], 7);
			map_object.panTo([latitude, longitude], 7);

			// this takes you back to the beginning once you've finished


		}
	}

}


// for when they click the back button
// tries to cycle backwards through the places given to it by the json object
function navigateLocationsBackward() {
	// if we don't have data from locations, just go to Rome
	if (locations == null) {
		zoomToRome();
	} else {

		if (locationNumber === 0) {

			// change next button to say "start" instead
			$("#forwardText").text("Start");

			// f() checks if there is already a hidden class on it
			// if there isn't we can add that class to the back button
			var className = "hidden",
				elementId = "back";

			var whetherClassIsPresent = hasCertainClass(className, elementId);

			console.log("present " + whetherClassIsPresent);

			if (whetherClassIsPresent === false) {
				$("#back").addClass("hidden");
			}
		}

		if (locationNumber === 11) {
			$("#forward").removeClass("hidden");
		}
		// decrement progress bar
		$('.progress')
			.progress('decrement');

		let latitude = locations[locationNumber].latitude;
		let longitude = locations[locationNumber].longitude;

		//  map_object.setView([latitude, longitude], 7);
		map_object.panTo([latitude, longitude], 7);
	}


}


// share to facebook




console.log(numberOfPoints);

// initialize progress bar
$('.progress').progress({
	total: numberOfPoints,
});

// tabs
$('.top.menu .item').tab();

$('.forMap').popup({
	on: 'hover'
});

//for titles (likely just for testing)
$('h3').popup({
	on: 'hover'
});
