var express = require('express');
var _ = require('underscore');
var router = express();
var handleError;
var races = require('../../middleware/races');

const { Race, findRaces, addRace } = require('../../models/race');

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
	.get((req, res, next) => {
		const user = req.user;

		findRaces(user._id)
			.then(races => {
				res.status(201);
				return res.json(races);
			})
			.fail(err => {
				res.status(err.status || 500);
				res.json(err);
			})
	})
	.post(races.addRace, function(req, res, next) {
		res.status(201);
		res.json(res.locals.data);
	});

// Export
module.exports = function (errCallback){
	console.log('Initializing races routing module');
	
	handleError = errCallback;
	return router;
};


// galaxysweeper.com/api/users/:userid/games

// GET kroegentocht.ninja/api/races 
// Authorization: bearer token_with_user_id
// ||
// Cookie: cookie_with_user_id

// - admin
//   - /api/races
//     - GET
//     - POST
//   - /api/races/:raceid
//     - GET
//     - PUT
//     - DELETE
//   - /api/races/:raceid/places
//     - GET
//     - POST
//   - /api/races/:raceid/places/:placeid
//     - DELETE
//   - /api/places/
//     - GET
//   - /api/places/:placeid
//     - GET
// - user
//   - /api/races/:raceid/join || /api/races/join
//     - POST { secret: "bla" }
//   - /api/races/
//     - GET
//   - /api/races/:raceid/places/:placeid/check-in

// - public
