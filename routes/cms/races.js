var express = require('express');
var router = express();

const { findPlaces, findPlacesByQuery, getNextPagePlaces } = require('../../controllers/PlaceController');
const { findRaces, addRace, deleteRace, findSingleRaceByOwner, updateRace, addPlaces, removePlace } = require('../../controllers/RaceController');

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
	let nextPageToken = req.query.nextPageToken;

	let query = req.query.query;
	let long = req.query.longitude;
	let lat = req.query.latitude;
	let radius = req.query.radius;

	let search;

	if(query) search = findPlacesByQuery(query);
	else if(long && lat && radius) search = findPlaces({ lat, long, radius }, { type: 'cafe'});
	else if(nextPageToken) search = getNextPagePlaces(nextPageToken);

	if(!search) res.render('places', { places: [], raceId : req.params.id });

	else{
		search
        .end((err, result) => {
			if(err) { next(err); }
			console.log(result.body);
            res.render('places', { 
				places : result.body.candidates || result.body.results, 
				raceId : req.params.id, 
				nextPageToken: result.body.next_page_token 
			});
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

router.post('/:id/places/:place_id/delete', (req, res, next) =>{
	removePlace(req.params.id, req.user._id, req.params.place_id)
		.then(result => {
			req.flash('raceSuccessMessage', 'Place verwijderd');
			res.redirect('/cms/races/'+req.params.id);
		})
		.catch(err => next(err));
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
	req.body.Started = req.body.Started || false;
	
	updateRace(req.body, req.user._id)
		.then(result => {
			console.log(result);
			if(result.nModified > 0){
				req.flash('raceSuccessMessage', 'Race aangepast!');
				res.redirect('/cms/races/'+req.params.id);
			}
			else {
				req.flash('raceSuccessMessage', 'Race niet veranderd')
				res.redirect('/cms/races/'+req.params.id);
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