const placesUrl = "https://maps.googleapis.com/maps/api/place/";
const superagent = require('superagent');
const api_key = require('../config/places.js').key;
const { Place } = require('../models/places');

function findPlaces(requiredOptions, optionalOptions){
    console.log(requiredOptions);    
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
            fields: 'vicinity,name,place_id',
        });
}

function findPlacesByQuery(query){
    return superagent.get(placesUrl+'findplacefromtext/json')
        .query({
            key: api_key,
            input: query,
            inputtype: 'textquery',
            fields: 'formatted_address,name,place_id', 
        })
}

function addPlace(place) {
    const newPlace = {
        ...place,
    };

    return new Place(newPlace)
        .save()
}

module.exports = {
    findPlaces,
    addPlace,
    findSinglePlace,
    findPlacesByQuery,
}