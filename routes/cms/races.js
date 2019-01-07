var express = require('express');
var router = express();

const { findPlaces } = require('../../models/places');
const { findRaces, addRace, deleteRace, findSingleRaceByOwner, updateRace, addPlaces } = require('../../models/race');

router.get('/', (req, res, next) => {
	const user = req.user;

	findRaces(user._id)
		.then(races => {
			res.render('races', { 
				user, 
				races, 
				errorMessage: req.flash('raceErrorMessage'), 
				successMessage: req.flash('raceSuccessMessage'),
				name: req.flash('name')[0],
				secret: req.flash('secret')[0]
			});
		})
		.fail(err => next(err));
});

router.post('/', (req, res, next) => {
	addRace(req.body, req.user._id)
		.then(result => {
			req.flash('raceSuccessMessage', 'Race toegevoegd!');
			res.redirect('/cms/races');
		})
		.fail(err => {
			for(let error in err.errors){
				req.flash('raceErrorMessage', {'message': err.errors[error].message} );
			}
			req.flash('name', req.body.Name);
			req.flash('secret', req.body.Secret);
			
			res.redirect('/cms/races');
		});
})

router.get('/:id', (req, res, next) =>{
	findSingleRaceByOwner(req.params.id, req.user._id)
		.then(result => {
			if(result){
				res.render('races_detail', {
					race: result,
					errorMessage: req.flash('raceErrorMessage'),
					successMessage: req.flash('raceSuccessMessage')
				});
			}
			else{
				res.redirect('/');
			}
		})
		.fail(err => next(err))
})

router.get('/:id/places', (req, res, next) =>{
	findPlaces({ lat: 51.8380095, long: 5.8746107 }, { type : 'cafe', rankby: 'distance'})
        .end((err, result) => {
            if(err) { next(err); }
            console.log(result.body.results);
            console.log(result.body.url);
            res.render('places', { places : result.body.results, raceId : req.params.id } );
        });
})

router.post('/:id/places', (req, res, next) =>{
	let places = [];

    req.body.places.forEach(place => {
        place = JSON.parse(place);
        var newPlace = {};
        newPlace.name = place.name;
        newPlace.vicinity = place.vicinity;
        newPlace.place_id = place.place_id;
        places.push(newPlace);
    });
	
	if(places){
		addPlaces(places, req.params.id, req.user._id)
		.then(result => {
			req.flash('raceSuccessMessage', 'Race geüpdate!');
			res.redirect('/cms/races/'+req.params.id);
		})
		.fail(err => {
			next(err);
		})
	}
	else{
		req.flash('raceSuccessMessage', 'Geen places toegevoegd');
		res.redirect('/cms/races/'+req.params.id);
	}
})

router.post('/:id/delete', (req, res, next) => {
	deleteRace(req.params.id, req.user._id)
		.then(result => {
			req.flash('raceSuccessMessage', "Race succesvol verwijderd!");
			res.redirect('/cms/races');
		})
		.fail(err => {
			next(err);
		})
})

router.post('/:id/update', (req, res, next) => {
	updateRace(req.body, req.user._id)
		.then(result => {
			console.log(result);
			if(result.nModified > 0){
				req.flash('raceSuccessMessage', 'Race aangepast!');
				res.redirect('/cms/races');
			}
			else {
				req.flash('raceSuccessMessage', 'Race niet veranderd')
				res.redirect('/cms/races/');
			}
		})
		.fail(err => {
			for(let error in err.errors){
				req.flash('raceErrorMessage', {'message': err.errors[error].message} );
			}

			res.redirect('/cms/races/'+req.params.id);
		})
})

// Export
module.exports = function (){
	return router;
};