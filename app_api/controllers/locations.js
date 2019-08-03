const mongoose = require('mongoose');
const Loc = mongoose.model('Location'); // model will have been compiled by the time this file is required as 
// db.js is required in root app.js first

// in each of these functions, we need to send back a status code, and a json response

function locationsListByDistance(req, res) {
    res
        .status(200)
        .json({ "status": "success" });
};

function locationsCreate(req, res) {
    res
        .status(200)
        .json({ "status": "success" });
};

function locationsReadOne(req, res) {
    res
        .status(200)
        .json({ "status": "success" });
};

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