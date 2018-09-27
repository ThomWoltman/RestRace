var express = require('express');
var _ = require('underscore');
var router = express();
var handleError;
var races = require('../../middleware/races');

var mongoose = require('mongoose');
Race = mongoose.model('Race');

router.param('user_id', (req, res, next, user_id) => {
	// sample user, would actually fetch from DB, etc...
	console.log('params:'+user_id);
	req.user_id = user_id;
	next();
});

// Routing

/**
 * @swagger
 * /api/races:
 *   get:
 *     description: Get list of all races
 *     parameters:
 *       - name: user_id
 *         required: true
 *         schema:
 *          type: string 
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: List of races
 * 		 	
 */

router.route('/')
	.get(races.getRaces, function(req, res, next) {
		return res.json(req.data);
	})
	.post(races.addRace, function(req, res, next) {
		res.status(201);
		res.json(req.data);
	});

// Export
module.exports = function (errCallback){
	console.log('Initializing races routing module');
	
	handleError = errCallback;
	return router;
};