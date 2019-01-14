var express = require('express');
var router = express();
const { findPlaces } = require('../../controllers/PlaceController');

router.get('/', (req, res, next) => {
    findPlaces({ lat: 51.8380095, long: 5.8746107 }, { type : 'cafe', rankby: 'distance'})
        .end((err, result) => {
            if(err) { next(err); }
            console.log(result.body.results);
            console.log(result.body.url);
            res.render('places', { places : result.body.results } );
        });
});

// Export
module.exports = function (){
	return router;
};