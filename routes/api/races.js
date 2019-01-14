var express = require('express');
var _ = require('underscore');
var router = express();
var handleError;

const { findRaces, addRace, deleteRace, findSingleRace, updateRace, findSingleRaceByOwner, addPlaces, updatePlaces, removePlace, getParticipants, addParticipant } = require('../../controllers/RaceController');
const { findSinglePlace } = require('../../controllers/PlaceController');

let user;

router.all('*', (req, res, next) => {
	user = req.user;
	next();
})

// Routing
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
		req.body._id = req.params.id;
		updateRace(req.body, user._id)
			.then(race => {
					res.status(200);
					res.json(race);
			})
			.fail(err => next(err));
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

	router.route('/:id/places')
	.get((req, res, next) => {
		findSingleRaceByOwner(req.params.id, user._id)
			.then(race => {
				if(race){
					res.status(200);
					res.json(race.Places);
				}
				else{
					res.status(404);
					res.json({ message: 'resource not found'});
				}
			})
			.catch(err => next(err));
	})

	.post((req, res, next) => {
		addPlaces(req.body, req.params.id, user._id)
			.then(result => {
				res.status(200);
				res.json(result);
			})
			.fail(err => next(err));
	})

	.put((req, res, next) => {
		updatePlaces(req.params.id, user._id, req.body)
		.then(result => {
			res.status(200);
			res.json(result);
		})
		.fail(err => next(err));
	})

	router.route('/:id/places/:place_id')
	.get((req, res, next) => {
		findSinglePlace(req.params.place_id)
			.end((err, place) => {
				if(err) { next(err); }
				
				if(place.body.result) {
					res.status(200);
					res.json(place.body.result);
				}
				else {
					res.status(404);
					res.json({message: 'resource not found'})
				}
			});
	})

	.delete((req, res, next) => {
		removePlace(req.params.id, user._id, req.params.place_id)
			.then(result => {
				if(result){
					res.status(200);
					res.json(result);
				}
				else{
					res.status(404);
					res.json({message: 'resource not found'});
				}
			})
			.catch(err => next(err))
	})

	router.route('/:id/participants')
	.get((req, res, next) => {
		getParticipants(req.params.id, user._id)
			.then(participants => {
				res.status(200);
				res.json(participants);
			})
			.fail(err => next(err));
	})

	.post((req, res, next) => {
		addParticipant(req.params.id, user._id, req.body.secret)
			.then(result => {
				if(result.n > 0){
					res.status(200);
					res.json(result);
				}
				else{
					res.status(401);
					res.json({ message: 'Wrong secret' });
				}
			})
			.fail(err => next(err));
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
