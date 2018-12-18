var express = require('express');
var router = express();
const key = require('../../config/places.js').key;
const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=<<API_KEY>>&location=<LAT, LONG>&radius=<<AFSTAND IN METERS>>&type=cafe';


router.get('/', (req, res, next) => {
    res.render('places', { key } );
});

// Export
module.exports = function (){
	return router;
};