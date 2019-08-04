const mongoose = require('mongoose');
const Loc = mongoose.model('Location'); // model will have been compiled by the time this file is required as 
// db.js is required in root app.js first
// in each of these functions, we need to send back a status code, and a json response

/**
 * GET request to list closest locations
 * @param {*} req 
 * @param {*} res 
 */
async function locationsListByDistance(req, res) {
    // get requester's longitude and latitude from query string 
    // ex. api/locations?lng=-0.7992599&lat=51.378091
    const lng = parseFloat(req.query.lng);
    const lat = parseFloat(req.query.lat);
    const near = {
        type: "Point",
        coordinates: [lng, lat]
    };
    const geoOptions = {
        distanceField: "distance.calculated",
        spherical: true, // true since search index in MongoDB is a 2dsphere
        maxDistance: 20000, // circular distance, in meters
        limit: 10 // show user max 10 closest locations
    };
    if (!lng || !lat) {
        // at least one of the query strings was not inputted
        return res
            .status(404)
            .json({
                "message": "lng and lat query parameters are required"
            });
    }
    try {
        const results = await Loc.aggregate([{ $geoNear: { near, ...geoOptions } }]); // three dots expand the object
        //create array of locations with data needed, from the query result
        const locations = results.map(result => {
            return {
                _id: result._id,
                name: result.name,
                address: result.address,
                rating: result.rating,
                facilities: result.facilities,
                distance: `${result.distance.calculated.toFixed()}m`
            }
        });
        // send back locations as response
        return res
            .status(200)
            .json(locations);
    } catch (err) {
        // aggregation query returned an error
        console.log(err);
        res
            .status(404)
            .json(err);
    }
};

/**
 * POST request to create a new location
 * @param {*} req 
 * @param {*} res 
 */
function locationsCreate(req, res) {
    // data validation is done through mongoose schema
    // when testing with postman, set data type to x-www-form-urlencoded
    Loc.create({
        name: req.body.name,
        address: req.body.address,
        facilities: req.body.facilities.split(","),
        coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
        openingTimes: [{
            //TODO: create a loop to check for the correct number of openingTimes inputted
            days: req.body.days1,
            opening: req.body.opening1,
            closing: req.body.closing1,
            closed: req.body.closed1,
        }, {
            days: req.body.days2,
            opening: req.body.opening2,
            closing: req.body.closing2,
            closed: req.body.closed2,
        }]
        // rating is defaulted to 0 in the schema
    }, (err, location) => {
        if (err) {
            res
                .status(400)
                .json(err);
        } else {
            res
                .status(201) // 'created' status code
                .json(location); // send back the created document, as a post request should
        }
    });
};

/**
 * GET request for a single location
 * @param {*} req 
 * @param {*} res 
 */
function locationsReadOne(req, res) {
    //unsuccessful get request is a 404
    // req.params.locationid is the :locationid
    Loc
        .findById(req.params.locationid)
        .exec((err, location) => {
            if (!location) {
                // no location found for given locationid
                return res
                    .status(404)
                    .json({
                        "message": "location not found"
                    });
            } else if (err) {
                // query returned an error
                return res
                    .status(404)
                    .json(err);
            }
            res
                .status(200)
                .json(location);
        });
}

function locationsUpdateOne(req, res) {
    res
        .status(200)
        .json({ "status": "success" });
};

function locationsDeleteOne(req, res) {
    res
        .status(200)
        .json({ "status": "success" });
};

module.exports = {
    locationsListByDistance,
    locationsCreate,
    locationsReadOne,
    locationsUpdateOne,
    locationsDeleteOne
};