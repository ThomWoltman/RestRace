var express = require('express');
var router = express();

const { findPlaces, findPlacesByQuery } = require('../../models/places');
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
				console.log(result);
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
		.catch(err => next(err));
})

router.get('/:id/places', (req, res, next) =>{
	let query = req.query.query;

	if(!query) res.render('places', { places: [], raceId : req.params.id });

	else{
		findPlacesByQuery(query)
        .end((err, result) => {
			if(err) { next(err); }
			console.log(result.body);
            res.render('places', { places : result.body.candidates, raceId : req.params.id } );
        });
	}
})

router.post('/:id/places', (req, res, next) =>{
	if(req.body.places){
		addPlaces(req.body.places, req.params.id, req.user._id)
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

router.post('/:id/places/search', (req, res, next) =>{
	let query = req.body.query;

	if(!query) res.redirect('/cms/races/'+req.params.id+'/places');
	else res.redirect('/cms/races/'+req.params.id+'/places?query='+query);

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