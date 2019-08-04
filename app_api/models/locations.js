const mongoose = require('mongoose');

// Schema for Hours of the location
// shows which day of the week this instance is valid for
const openingTimeSchema = new mongoose.Schema({
    days: {
        type: String,
        required: true
    },
    opening: String,
    closing: String,
    closed: {
        type: Boolean,
        required: true
    }
});

// Schema for a Review
const reviewSchema = new mongoose.Schema({
    author: String,
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    reviewText: String,
    createdOn: {
        type: Date,
        'default': Date.now
    }
});

const locationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: String,
    rating: {
        type: Number,
        'default': 0,
        min: 0,
        max: 5
    },
    facilities: [String],
    // store location data in GeoJSON format
    // [longitude, latitude]
    coords: {
        type: { type: String },
        coordinates: [Number]
    },
    openingTimes: [openingTimeSchema], // array for multiple days (e.g. Mon-Fri, Sat, Sun)
    reviews: [reviewSchema]
});

// index location based on coords
// allows for fast lookups based on location
locationSchema.index({ coords: '2dsphere' });

//Compile the schema
mongoose.model('Location', locationSchema);