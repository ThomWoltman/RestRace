var express = require('express');
var _ = require('underscore');
var router = express();
var handleError;

const { Race, findRaces, addRace, deleteRace, findSingleRace } = require('../../models/race');

let user;

router.all('*', (req, res, next) => {
	user = req.user;
	next();
})

// Routing

/**
 * @swagger
 * /api/races:
 *   get:
 *     description: Get list of all races
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: List of races
 * 		 	
 */



router.route('/')
	.get((req, res, next) => {
		findRaces(user._id)
			.then(races => {
				res.status(200);
				res.json(races);
			})
			.fail(err => next(err))
	})
	.post((req, res, next) => {
		addRace(req.body, user._id)
			.then(race => {
				res.status(201);
				res.json(race);
			})
			.fail(err => next(err))
	})

router.route('/:id')
	.get((req, res, next) => {
		findSingleRace(req.params.id)
			.then(result => {
					res.status(200);
					res.json(result);
			})
			.fail(err => next(err))
	})
	.put((req, res, next) => {

	})
	.delete((req, res, next) => {
		deleteRace(req.params.id, user._id)
			.then(result => {
				if(result.result.n > 0){
					res.status(200);
					res.json(result);
				}
				else{
					res.status(405);
					res.json({message: 'not allowed', result});
				}
			})
			.fail(err => next(err))
	})

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
