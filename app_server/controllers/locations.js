const request = require('request'); // node module to make requests to the created REST API

const apiOptions = {
    server: 'http://localhost:3000'
};
// change server for api if in production mode
if (process.env.NODE_ENV === 'production') {
    apiOptions.server = 'https://manning-getting-mean.herokuapp.com/';
}

/* GET 'home' page -> lists all nearby locations */
function homelist(req, res) {
    //make a request to our api for all nearby locations
    const path = '/api/locations';
    const requestOptions = {
        url: `${apiOptions.server}${path}`, // server host plus route path
        method: 'GET', // method of HTTP request
        json: {}, // data (body) to send... sending an empty json object ensures response body is also json
        qs: { // query strings  
            lng: -80.500930, //hardcode some values for now
            lat: 43.433176,
            maxDistance: 20 // in km
        }
    };
    //
    request(
        requestOptions,
        (err, { statusCode }, body) => {
            //body returned by api is array of locations
            let data = {};
            if (statusCode === 200) {// if no locations are found, api still returns 200 status code
                //formating distance:
                data = [];
                if (body.length) {
                    data = body.map((item) => {
                        item.distance = formatDistance(item.distance);
                        return item
                    });
                }
            }
            renderHomepage(req, res, data);
        }
    );
}

/**
 * Renders the homepage
 * Created this function to decouple rendering from logic
 * @param {*} req 
 * @param {*} res 
 */
function renderHomepage(req, res, responseBody) {
    let message = null;
    console.log("Is instance of Array?: " + (responseBody instanceof Array))
    if (!(responseBody instanceof Array)) {
        // api response did not have a 200 status code
        message = "API lookup error";
        responseBody = []; // set as empty array to avoid pug from throwing error
    } else {
        // response from API was 200 status code, but empty array since no locations found
        if (!responseBody.length) {
            message = "No places found nearby";
        }
    }

    res.render('locations-list', {
        title: 'Loc8r - find a place to work with wifi',
        pageHeader: {
            title: 'Loc8r',
            strapline: 'Find places to work with wifi near you!'
        },
        locations: responseBody,
        message
    });
}

/**
 * Formats distance inputted as a string, to display on the homepage
 * @param {Number} distance 
 */
function formatDistance(distance) {
    let thisDistance = 0;
    let unit = 'm';
    if (distance > 1000) { //if distance over 1km, display as km
        thisDistance = parseFloat(distance / 1000).toFixed(1);
        unit = 'km';
    } else {
        thisDistance = Math.floor(distance);
    }
    return thisDistance + unit;
};

/* GET 'Location info' page */
const locationInfo = function (req, res) {
    res.render('location-info', {
        title: 'Starcups',
        pageHeader: { title: 'Starcups' },
        sidebar: {
            context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
            callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
        },
        location: {
            name: 'Starcups',
            address: '125 High Street, Reading, RG6 1PS',
            rating: 3,
            facilities: ['Hot drinks', 'Food', 'Premium wifi'],
            coords: { lat: 43.437851, lng: -80.526112 },
            openingTimes: [{
                days: 'Monday - Friday',
                opening: '7:00am',
                closing: '7:00pm',
                closed: false
            }, {
                days: 'Saturday',
                opening: '8:00am',
                closing: '5:00pm',
                closed: false
            }, {
                days: 'Sunday',
                closed: true
            }],
            reviews: [{
                author: 'Simon Holmes',
                rating: 5,
                timestamp: '16 July 2013',
                reviewText: 'What a great place. I can\'t say enough good things about it.'
            }, {
                author: 'Charlie Chaplin',
                rating: 3,
                timestamp: '16 June 2013',
                reviewText: 'It was okay. Coffee wasn\'t great, but the wifi was fast.'
            }]
        }
    });
};
/* GET 'Add review' page */
const addReview = function (req, res) {
    res.render('location-review-form', {
        title: 'Review Starcups on Loc8r',
        pageHeader: { title: 'Review Starcups' }
    });
};
module.exports = {
    homelist,
    locationInfo,
    addReview
};