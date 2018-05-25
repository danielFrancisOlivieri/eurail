var locationNumber = -1; // helps cycle through locations
var locations = 20; // array of all points
var pointsLayer; // holds the layer for the points so we can open the info windows programattically

$.getJSON("/data/punicPoints.json", function(json) {
    console.log(json); // this will show the info it in firebug console
    createPlaceArray(json);
});


// callback function for the getJSON that gets the json data
function createPlaceArray(json) {

    locations = json;

}

// callback function that sets the layer into pointsLayer
function setPointsLayer(layerFromLayerArray) {
    pointsLayer = layerFromLayerArray;
    console.log(pointsLayer);
}


// Choose center and zoom level
var options = {
    center: [36.8529, 10.3217], // Saguntum 39.6799° N, 0.2784° W
    zoom: 7
}

// Instantiate map on specified DOM element
var map_object = new L.Map(map, options);



window.onload = function() {
    console.log("we're loading at least");
    // tabs
    $('.top.menu .item').tab();

    // Add a basemap to the map object just created
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Stamen'
    }).addTo(map_object);
    console.log("we've gotten this far");
    var vizjson = 'https://olivierid.carto.com/api/v2/viz/b8f4c673-4ac7-47d5-ae41-6e6acadedfcc/viz.json';
    cartodb.createLayer(map_object, vizjson).addTo(map_object).done(function(layers) {
        // layer 0 is the base layer, layer 1 is cartodb layer
        console.log(layers);

    }).on('error', function(err) {
        console.log("some error occurred: " + err);
    });


}



// takes us to Philly
// used in case of an error
// because it's always sunny in Philadelphia

zoomToPhiladelphia = function() {

    map_object.setView([41.9028, 75.1652], 7);
    console.log("City of Brotherly love");

}

// takes us to Rome
// used in case of an error
// because it's always a good idea to go to Rome when things aren't working out

zoomToRome = function() {

    map_object.setView([39.9526, 12.4964], 7);
    console.log("the Eternal city");

}

// for when they click the next button
// tries to cycle through the places given to it by the json object
function navigateLocationsForward() {
    // if we don't have data from locations, just go to Rome
    if (locations == null) {
        zoomToRome();
    } else {
      console.log(locations.length);
      console.log(locationNumber);

        if (locationNumber >= locations.length) {
            // do nothing
        }
        else {

            locationNumber++; // increment so it will be the next place next time

        $('.progress')
            .progress('increment');

        console.log(locations.length);
        console.log(locationNumber);

        let latitude = locations[locationNumber].latitude;
        let longitude = locations[locationNumber].longitude;

        console.log(latitude + " " + longitude);
        //map_object.setView([latitude, longitude], 7);
        map_object.panTo([latitude, longitude], 7);

        // this takes you back to the beginning once you've finished


    }
  }

    map_object.on("locationfound", function(){

      var latlng = L.latLng(locations[locationNumber].latitude, locations[locationNumber].longitude);

      var place = locations[locationNumber].place;
      var text = locations[locationNumber].text;

      map_object.openPopup("<b><center data-content='Add users to your feed' >" + place + "</center></b><br/>" + text ,  latlng)

    })

}



// for when they click the back button
// tries to cycle backwards through the places given to it by the json object
function navigateLocationsBackward() {
    // if we don't have data from locations, just go to Rome
    if (locations == null) {
        zoomToRome();
    } else {

        if (locationNumber <= 0) {
            // do nothing
        }

        else {
            locationNumber -= 1; // decrement so it will be the next place next time
            console.log(locationNumber);

            // decrement progress bar
            $('.progress')
                .progress('decrement');

            let latitude = locations[locationNumber].latitude;
            let longitude = locations[locationNumber].longitude;

            map_object.setView([latitude, longitude], 7);
            map_object.panTo([latitude, longitude], 7);
        }



    }

    map_object.on("moveend", function(){

      var latlng = L.latLng(locations[locationNumber].latitude, locations[locationNumber].longitude);

      var place = locations[locationNumber].place;

      var text = locations[locationNumber].text;

      map_object.openPopup("<b><center><span title='this is a place' >" + place + "</span></center></b><br/>" + text ,  latlng)

    })

}



// initialize progress bar
$('.progress').progress({
    total: 13
});

// tabs
$('.top.menu .item').tab();
