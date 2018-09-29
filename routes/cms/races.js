var express = require('express');
var router = express();
var login = require('../../middleware/login');
var handleError;

const { findRaces, addRace } = require('../../models/race');

router.get('/', login.isLoggedIn, (req, res, next) => {
	const user = req.user;

	findRaces(user._id)
		.then(races => {
			res.render('races', { user, races, errorMessage: req.flash('addRaceErrorMessage'), message: req.flash('addRaceMessage') });
		})
		.fail(err => next(err));
});

router.post('/', login.isLoggedIn, (req, res, next) => {
	addRace(req.body, req.user._id)
		.then(result => {
			req.flash('addRaceMessage', 'Race toegevoegd!');
			res.redirect('/cms/races');
		})
		.fail(err => {
			for(let error in err.errors){
				req.flash('addRaceErrorMessage', err.errors[error].message);
			}
			
			res.redirect('/cms/races');
		});
})

// Export
module.exports = function (errCallback){
	console.log('Initializing books routing module');
	handleError = errCallback;
	return router;
};