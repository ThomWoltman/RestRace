const placesUrl = "https://maps.googleapis.com/maps/api/place/";
const superagent = require('superagent');
const api_key = require('../config/places.js').key;

// load the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// define the schema for our user model
const placeSchema = mongoose.Schema({

    Name: {
        type: String,
        required: [true, "Name is required"]
    },
    Address: {
        type: String,
        required: [true, "Adress is required"]
    }
});
const Place = mongoose.model('Place', placeSchema);

module.exports = {
    Place
}