var express = require('express');
var router = express();
const key = require('../../config/places.js').key;
const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=<<API_KEY>>&location=<LAT, LONG>&radius=<<AFSTAND IN METERS>>&type=cafe';
const { findPlaces } = require('../../models/places');

router.get('/', (req, res, next) => {
    findPlaces({ lat: 51.8380095, long: 5.8746107 }, { type : 'cafe', rankby: 'distance'})
        .end((err, result) => {
            if(err) { next(err); }
            console.log(result.body.results);
            console.log(result.body.url);
            res.render('places', { key, places : result.body.results } );
        });
});

// Export
module.exports = function (){
	return router;
};