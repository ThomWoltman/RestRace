var express = require('express');
var router = express();
var login = require('../../middleware/login');
var races = require('../../middleware/races');
var handleError;

const { findRaces } = require('../../models/race');

router.get('/', login.isLoggedIn, function(req, res, next) {
	const user = req.user;

	findRaces(user._id)
		.then(races => {
			res.render('races', { user, races });
		})
		.fail(err => next(err));
});

// Export
module.exports = function (errCallback){
	console.log('Initializing books routing module');
	handleError = errCallback;
	return router;
};