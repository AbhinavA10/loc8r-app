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

/**
 * Renders the location-info page 
 * @param {*} req 
 * @param {*} res 
 */
function renderDetailPage(req, res, location) {
    console.log(location);
    res.render('location-info', {
        title: location.name,
        pageHeader: {
            title: location.name
        },
        sidebar: {
            context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
            callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
        },
        location // pass full location object to view (api response with some formatting changes)
    });
}
/* GET 'Location info' page  - page containing details of a single location*/
function locationInfo(req, res) {
    getLocationInfo(req, res,
        (req, res, responseData) => renderDetailPage(req, res, responseData)
    );
};

/**
 *
 * Makes API request for a single location
 * @param {*} req 
 * @param {*} res 
 * @param {*} callback Function to call after api returns valid response
 */
function getLocationInfo(req, res, callback) {
    const path = `/api/locations/${req.params.locationid}`;
    const requestOptions = {
        url: `${apiOptions.server}${path}`,
        method: 'GET',
        json: {}
        //no query strings needed
    };
    request(
        requestOptions,
        (err, { statusCode }, body) => {
            const data = body;
            if (statusCode === 200) { // we expect 200 status code if successful GET request
                data.coords = { // view needs coordinates as a key-value pair instead of array
                    lng: body.coords[0],
                    lat: body.coords[1]
                };
                callback(req, res, data);
            }
            else { showError(req, res, statusCode); }
        }
    );
}

/**
 * Function to render a page when an api returns a !200 status code
 * @param {*} req 
 * @param {*} res 
 * @param {statusCode} status 
 */
function showError(req, res, status) {
    let title = '';
    let content = '';
    if (status === 404) {
        title = '404, page not found';
        content = 'Oh dear. Looks like we can\'t find this page. Sorry.';
    } else {
        title = `${status}, something's gone wrong`;
        content = 'Something, somewhere, has gone just a little bit wrong.';
    }
    res.status(status);
    res.render('generic-text', {
        title,
        content
    });
};

/* GET 'Add review' page */
function addReview(req, res) {
    getLocationInfo(req, res,
        (req, res, responseData) => renderReviewForm(req, res, responseData)
    );
};

/**
 * Renders the pug template of the add-review form
 * @param {*} req 
 * @param {*} res 
 * @param {json}
 */
function renderReviewForm(req, res, {name}) { // {name} will get only the response.name value.
    res.render('location-review-form', {
        title: `Review ${name} on Loc8r`,
        pageHeader: { title: `Review ${name}` }
    });
}
/* POST 'Add review' page */
function doAddReview(req, res) {

};

module.exports = {
    homelist,
    locationInfo,
    addReview,
    doAddReview
};