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

function findPlaces(requiredOptions, optionalOptions){    
    return superagent.get(placesUrl+'nearbysearch/json')
        .query({
            location : requiredOptions.lat+','+requiredOptions.long,
            radius: requiredOptions.radius,
            key: api_key,
            ...optionalOptions
         });
}

function findSinglePlace(id){
    return superagent.get(placesUrl+'details/json')
        .query({
            key: api_key,
            placeid: id,
            fields: 'vicinity,name,photo' 
        });
}

function addPlace(place) {
    const newPlace = {
        ...place,
    };

    return new Place(newPlace)
        .save()
}

module.exports = {
    Place,
    findPlaces,
    addPlace,
    findSinglePlace,
}