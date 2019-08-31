const express = require('express');
const router = express.Router();

const jwt = require('express-jwt');
// 'auth' is middleware that validates the supplied JWT extracts the payload data
const auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload' // this will add the JWT's payload data to req.payload
    // the token is sent in the http request as the 'Authorization' header with the value of 'Bearer {token}'
});

const ctrlLocations = require('../controllers/locations');
const ctrlReviews = require('../controllers/reviews');
const ctrlAuth = require('../controllers/authentication');

// authentication routes
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

// locations
router
    .route('/locations')
    .get(ctrlLocations.locationsListByDistance)
    .post(ctrlLocations.locationsCreate);
router
    .route('/locations/:locationid') // we can specifiy paramters such as id's using the colon notation
    .get(ctrlLocations.locationsReadOne)
    .put(ctrlLocations.locationsUpdateOne)
    .delete(ctrlLocations.locationsDeleteOne);
// reviews
router
    .route('/locations/:locationid/reviews')
    .post(auth, ctrlReviews.reviewsCreate); // authenticated route
router
    .route('/locations/:locationid/reviews/:reviewid')
    .get(ctrlReviews.reviewsReadOne)
    .put(auth, ctrlReviews.reviewsUpdateOne) // authenticated
    .delete(auth, ctrlReviews.reviewsDeleteOne); // authenticated
module.exports = router;