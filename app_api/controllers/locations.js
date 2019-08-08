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
    const maxDist = parseFloat(req.query.maxDistance); //input in km
    const near = {
        type: "Point",
        coordinates: [lng, lat]
    };
    if ((!req.query.lng) || (!req.query.lat) || (!req.query.maxDistance) ){
        // at least one of the query strings was not inputted
        return res
            .status(404)
            .json({
                "message": "lng and lat query parameters are required"
            });
    }
    const geoOptions = {
        distanceField: "distance.calculated",
        spherical: true, // true since search index in MongoDB is a 2dsphere
        maxDistance: maxDist*1000, // circular distance, in meters
        limit: 10 // show user max 10 closest locations
    };
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
                distance: `${result.distance.calculated.toFixed()}`
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

/**
 * PUT request handler - updating a location
 * @param {*} req 
 * @param {*} res 
 */
function locationsUpdateOne(req, res) {
    //Steps: 1 find document, 2 update it, 3 save it, 4 return updated document
    if (!req.params.locationid) {
        return res
            .status(404)
            .json({
                "message": "Not found, locationid is required"
            });
    }
    Loc
        .findById(req.params.locationid)
        .select('-reviews -rating') // don't retreive the reviews and rating fields
        .exec((err, location) => {
            if (!location) {
                return res
                    .json(404)
                    .status({
                        "message": "locationid not found"
                    });
            } else if (err) {
                return res
                    .status(400)
                    .json(err);
            }
            // update location document with received data
            location.name = req.body.name;
            location.address = req.body.address;
            location.facilities = req.body.facilities.split(',');
            location.coords = [
                parseFloat(req.body.lng),
                parseFloat(req.body.lat)
            ];
            location.openingTimes = [{
                days: req.body.days1,
                opening: req.body.opening1,
                closing: req.body.closing1,
                closed: req.body.closed1,
            }, {
                days: req.body.days2,
                opening: req.body.opening2,
                closing: req.body.closing2,
                closed: req.body.closed2,
            }];
            // save updated document
            location.save((err, location) => {
                if (err) {
                    res
                        .status(404)
                        .json(err);
                } else {
                    Res
                        .status(200)
                        .json(location); // return updated document as a confirmation
                }
            });
        }
        );
};

/**
 * DELETE request handler - deletes a location
 * @param {*} req 
 * @param {*} res 
 */
function locationsDeleteOne(req, res) {
    const { locationid } = req.params; // req.params.locationid
    if (locationid) {
        //TODO convert all mongoose callbacks into thenables or awaits instead of callbacks
        Loc
            .findByIdAndRemove(locationid)
            .exec((err, location) => {
                if (err) {
                    //mongo error
                    return res
                        .status(404)
                        .json(err);
                }
                res
                    .status(204) //204 is a 'no content'
                    .json(null);
            }
            );
    } else {
        res
            .status(404)
            .json({
                "message": "No Location"
            });
    }
}

module.exports = {
    locationsListByDistance,
    locationsCreate,
    locationsReadOne,
    locationsUpdateOne,
    locationsDeleteOne
};