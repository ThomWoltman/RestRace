var express = require('express');
var router = express();

const { findRaces, addRace, deleteRace, findSingleRaceByOwner, updateRace } = require('../../models/race');

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
				});
			}
			else{
				res.redirect('/');
			}
		})
		.fail(err => next(err))
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