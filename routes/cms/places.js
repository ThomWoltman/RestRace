var express = require('express');
var router = express();
const key = require('../../config/places.js').key;
const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=<<API_KEY>>&location=<LAT, LONG>&radius=<<AFSTAND IN METERS>>&type=cafe';
const { findPlaces } = require('../../models/places');

router.get('/', (req, res, next) => {
    findPlaces(1, 1, 1)
        .end((err, result) => {
            if(err) { next(err); }
            console.log(result.body);
            console.log(result.body.url);
            res.render('places', { key } );
        });
});

// Export
module.exports = function (){
	return router;
};