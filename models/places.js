const placesUrl = "https://maps.googleapis.com/maps/api/place/";
const superagent = require('superagent');
const api_key = require('../config/places.js').key;

function findPlaces(long, lat, radius){
    //https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=1500&type=restaurant&keyword=cruise&key=YOUR_API_KEY
    return superagent.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=51.8380095,5.8746107&radius=1500&type=restaurant')
        .query({ key: api_key });
}

module.exports = {
    findPlaces,
}