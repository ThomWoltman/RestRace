var express = require('express');
var router = express();
var login = require('../../middleware/login');
var races = require('../../middleware/races');
var handleError;

router.get('/', login.isLoggedIn, function(req, res, next) {
	req.user_id = req.user._id;

	races.getRaces(req, res, () => {
		console.log(req.data);
		res.render('races', { user: req.user, races: req.data});
	})
});

// Export
module.exports = function (errCallback){
	console.log('Initializing books routing module');
	handleError = errCallback;
	return router;
};