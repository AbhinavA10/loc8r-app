const mongoose = require('mongoose');
const Loc = mongoose.model('Location');  // see comment in app_api/controllers/locations.js
const User = mongoose.model('User'); // for the getAuthor function

/**
 * POST request to add a new review for a given location
 * @param {*} req 
 * @param {*} res 
 */
function reviewsCreate(req, res) {
    console.log('authenticated');
    getAuthor(req, res,
        (req, res, userName) => {
            console.log("in callback")
            // to create a subdocument: find parent document, add a new subdocument, then save the parent documents
            //finding the parent document
            const locationId = req.params.locationid;
            if (locationId) {
                Loc
                    .findById(locationId)
                    .select('reviews')
                    .exec((err, location) => {
                        if (err) {
                            res
                                .status(400)
                                .json(err);
                        } else {
                            // add a new review
                            doAddReview(req, res, location, userName);
                        }
                    });
            } else {
                res
                    .status(404)
                    .json({ "message": "Location not found" });
            }
        });
};

/**
 * Add a new review to the parent location document
 * @param {*} req 
 * @param {*} res 
 * @param {Location} location 
 * @param {string} username
 */
function doAddReview(req, res, location, author) {
    if (!location) {
        // query never returned a result
        res
            .status(404)
            .json({ "message": "Location not found" });
    } else {
        //get data from post request
        const { rating, reviewText } = req.body;
        //console.log(req.body);
        // add a new review to the array of reviews in the parent location document
        location.reviews.push({
            author, // author comes i.e. from JWT
            rating,
            reviewText
        });
        // if we make changes to the instance returned by a mongoose query, and then save it
        // Mongoose will update the original document in the database
        location.save((err, location) => { // use mongoose's save() method
            if (err) {
                res
                    .status(400)
                    .json(err);
            } else {
                // added a new review, now update the location's avg rating asynchronously
                updateAverageRating(location._id);
                // return result of POST request
                const thisReview = location.reviews.slice(-1).pop(); // get the just-added review
                res
                    .status(201) // review created
                    .json(thisReview);
            }
        });
    }
};

/**
 * Wrapper to update the average rating of a location document
 * @param {mongoose.Schema.Types.ObjectId} locationId 
 */
function updateAverageRating(locationId) {
    Loc.findById(locationId)
        .select('rating reviews')
        .exec((err, location) => {
            if (!err) {
                doSetAverageRating(location);
            }
        });
};

/**
 * Calculate and update average rating of a location document
 * @param {Location} location 
 */
function doSetAverageRating(location) {
    if (location.reviews && location.reviews.length > 0) {
        const count = location.reviews.length;
        const total = location.reviews.reduce((acc, { rating }) => {
            return acc + rating;
        }, 0);
        location.rating = parseInt(total / count, 10);
        location.save(err => {
            if (err) {
                console.log(err);
            } else {
                console.log(`Average rating updated to ${location.rating}`);
            }
        });
    }
};

/**
 * GET request for a single review
 * @param {*} req 
 * @param {*} res 
 */
function reviewsReadOne(req, res) {
    // To find a subdocument, we first need to find the parent document, and then the sub-document
    Loc
        .findById(req.params.locationid)
        .select('name reviews') // limit mongo document returned to only these fields
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
            if (location.reviews && location.reviews.length > 0) {
                const review = location.reviews.id(req.params.reviewid);
                if (!review) {
                    // requested review found
                    return res
                        .status(404)
                        .json({
                            "message": "review not found"
                        });
                } else {
                    // review found
                    response = {
                        location: {
                            name: location.name,
                            id: req.params.locationid
                        },
                        review
                    };
                    return res
                        .status(200)
                        .json(response);
                }
            } else {
                // no reviews found, in general
                return res
                    .status(404)
                    .json({
                        "message": "No reviews found"
                    });
            }
        });
};

function reviewsUpdateOne(req, res) {
    // 1 Find parent document, 2 find subdoc, 3 update it, 4 save parent doc, 5 send review doc as confirmation
    if (!req.params.locationid || !req.params.reviewid) {
        return res
            .status(404)
            .json({
                "message": "Not found, locationid and reviewid are both required"
            });
    }
    Loc
        .findById(req.params.locationid) // find parent document
        .select('reviews')
        .exec((err, location) => {
            if (!location) {
                return res
                    .status(404)
                    .json({
                        "message": "Location not found"
                    });
            } else if (err) {
                return res
                    .status(400)
                    .json(err);
            }
            if (location.reviews && location.reviews.length > 0) {
                const thisReview = location.reviews.id(req.params.reviewid); // get subdoc
                if (!thisReview) {
                    res
                        .status(404)
                        .json({
                            "message": "Review not found"
                        });
                } else {
                    // make changes to the review
                    thisReview.author = req.body.author;
                    thisReview.rating = req.body.rating;
                    thisReview.reviewText = req.body.reviewText;
                    location.save((err, location) => { // save parent document
                        if (err) {
                            res
                                .status(404)
                                .json(err);
                        } else {
                            updateAverageRating(location._id); // need to update average rating in case rating was changed in updated review
                            res
                                .status(200)
                                .json(thisReview);
                        }
                    });
                }
            } else {
                res
                    .status(404)
                    .json({
                        "message": "No review to update"
                    });
            }
        }
        );
}

/**
 * DELETE request handler to delete a single review
 * @param {*} req 
 * @param {*} res 
 */
function reviewsDeleteOne(req, res) {
    const { locationid, reviewid } = req.params;
    if (!locationid || !reviewid) {
        return res
            .status(404)
            .json({ 'message': 'Not found, locationid and reviewid are both required' });
    }
    // find the parent location
    Loc
        .findById(locationid)
        .select('reviews')
        .exec((err, location) => {
            if (!location) {
                return res
                    .status(404)
                    .json({ 'message': 'Location not found' });
            } else if (err) {
                return res
                    .status(400)
                    .json(err);
            }
            //if there are reviews
            if (location.reviews && location.reviews.length > 0) {
                if (!location.reviews.id(reviewid)) {
                    return res
                        .status(404)
                        .json({ 'message': 'Review not found' });
                } else {
                    location.reviews.id(reviewid).remove(); // remove the review
                    location.save(err => { // save parent document
                        if (err) {
                            return res
                                .status(404)
                                .json(err);
                        } else {
                            updateAverageRating(location._id); // update avg rating since a review was deleted
                            res
                                .status(204)
                                .json(null);
                        }
                    });
                }
            } else {
                res
                    .status(404)
                    .json({ 'message': 'No Review to delete' });
            }
        });
};

/**
 * Validate that the user exists in the database and return the user’s name for use in the controller
 * @param {*} req 
 * @param {*} res 
 * @param {*} callback 
 */
function getAuthor(req, res, callback) {
    // console.log(req.payload); // shows the payload of the JWT, and that we are able to decode the jwt.
    if (req.payload && req.payload.email) { // data from JWT
        User.findOne({ email: req.payload.email }) // use email address to find a user
            .exec((err, user) => {
                console.log("result");
                if (!user) {
                    return res
                        .status(404)
                        .json({ "message": "User not found" });
                } else if (err) {
                    console.log(err);
                    return res
                        .status(404)
                        .json(err);
                }
                callback(req, res, user.name); // user was found, so return the name of the user to the callback
            });
    } else {
        return res
            .status(404)
            .json({ "message": "User not found" });
    }
};

module.exports = {
    reviewsCreate,
    reviewsReadOne,
    reviewsUpdateOne,
    reviewsDeleteOne
};