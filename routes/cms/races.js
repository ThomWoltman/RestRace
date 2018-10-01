var express = require('express');
var router = express();

const { findRaces, addRace } = require('../../models/race');

router.get('/', (req, res, next) => {
	const user = req.user;

	findRaces(user._id)
		.then(races => {
			res.render('races', { 
				user, 
				races, 
				errorMessage: req.flash('addRaceErrorMessage'), 
				message: req.flash('addRaceMessage'),
				name: req.flash('name')[0],
				secret: req.flash('secret')[0]
			});
		})
		.fail(err => next(err));
});

router.post('/', (req, res, next) => {
	addRace(req.body, req.user._id)
		.then(result => {
			req.flash('addRaceMessage', 'Race toegevoegd!');
			res.redirect('/cms/races');
		})
		.fail(err => {
			for(let error in err.errors){
				req.flash('addRaceErrorMessage', {'message': err.errors[error].message} );
			}
			req.flash('name', req.body.Name);
			req.flash('secret', req.body.Secret);
			
			res.redirect('/cms/races');
		});
})

// Export
module.exports = function (){
	return router;
};