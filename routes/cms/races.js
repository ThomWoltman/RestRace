var express = require('express');
var router = express();
var login = require('../../middleware/login');
var races = require('../../routes/api/races');
var handleError;

router.get('/', login.isLoggedIn, function(req, res, next) {	
    res.render('races', {user: req.user });
});

// Export
module.exports = function (errCallback){
	console.log('Initializing books routing module');
	handleError = errCallback;
	return router;
};