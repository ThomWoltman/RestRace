var express = require('express');
var _ = require('underscore');
var router = express(); 
var handleError;

const authenticate = require('../../middleware/authenticate');
const { findUsers, findUser, deleteUser, addUser, getRole, updateUser } = require('../../controllers/UserController');
const { addParticipant, getPlaces, getRaceAsParticipant, getRacesAsParticipant, addCheckin } = require('../../controllers/RaceController');

router.route('/', authenticate.isAdmin)
    .get((req, res, next) => {
        findUsers()
            .then(users => {
                res.status(200);
                res.json(users);
            })
            .fail(err => next(err));  
    })
    .post((req, res, next) => {
        addUser(req.body.email, req.body.password)
            .then(result => {
                res.status(200);
                res.json(result);
            })
            .fail(err => next(err));
    })

router.route('/:id', authenticate.isAdmin)
    .get((req, res, next) => {
        findUser(req.params.id)
            .then(user => {
                if(user){
                    res.status(200);
                    res.json(user);
                }
                else{
                    res.status(404);
                    res.json({ message: 'user not found' });
                }
            })
            .fail(err => next(err)); 
    })
    .delete((req, res, next) => {
        deleteUser(req.params.id)
            .then(result => {
                if(result.result.n > 0) {
                    res.status(200);
                    res.json(result);
                }
                else {
                    res.status(404);
                    res.json({ message: 'user not found' });
                }
            })
            .fail(err => next(err));
    })   

    router.route('/:id/role', authenticate.isAdmin)
    .get((req, res, next) => {
        getRole(req.params.id)
            .then(role => {
                if(role){
                    res.status(200);
                    res.json(role);
                }
                else{
                    res.status(404);
                    res.json({ message: 'user not found' });
                }
            })
            .fail(err => next(err)); 
    })
    .patch((req, res, next) => {
        updateUser(req.params.id, { role: req.body.role })
            .then(result => {
                res.status(200);
                res.json(result);
            })
            .fail(err => next(err));
    })

    router.route('/:id/racesparticipated')
    .get((req, res, next) => {
        getRacesAsParticipant(req.user._id)
            .then(result => {
                if(!result){
                    res.status(404);
                    res.json({ message: "Resource not found"});
                }
                else {
                    res.status(200);
                    res.json(result);
                }
            })
            .fail(err => next(err));
    })
    .post((req, res, next) => {
        addParticipant(req.body.raceId, req.user._id, req.body.secret)
            .then(result => {
                if(!result) {
                    res.status(404);
                    res.send({ message: "race id or secret is wrong"});
                }
                else{
                    res.status(201);
                    res.json(result);
                }
            })
            .fail(err => next(err));
    })

    router.route('/:id/racesparticipated/:race_id')
    .get((req, res, next) => {
        getRaceAsParticipant(req.user._id, req.params.race_id)
            .then(result => {
                if(!result){
                    res.status(404);
                    res.send({ message: "race not found" });
                }
                else {
                    res.status(200);
                    res.send(result);
                }
            })
            .fail(err => next(err));
    })

    router.route('/:id/racesparticipated/:race_id/places')
    .get((req, res, next) => {
        getRaceAsParticipant(req.user._id, req.params.race_id)
            .then(result => {
                if(!result){
                    res.status(404);
                    res.send({ message: "race not found" });
                }
                else {
                    getPlaces(result.Places)
                        .then(places => {
                            res.status(200);
                            res.send(places);
                        })
                        .catch(err => next(err));
                }
            })
            .fail(err => next(err));
    })

    router.route('/:id/racesparticipated/:race_id/checkins')
    .get((req, res, next) => {
        getRaceAsParticipant(req.user._id, req.params.race_id)
            .then(result => {
                let checkins = [];
                result.Participants.forEach(Participant => {
                    if(Participant.user_id == req.user._id+""){
                        checkins = Participant.checkins;
                    }
                });
                res.status(200);
                res.json(checkins);
            })
            .fail(err => next(err));
    })
    .post((req, res, next) => {
        addCheckin(req.params.race_id, req.body.place_id, req.user._id)
            .then(result => {
                if(!result) {
                    res.status(404);
                    res.json({ message: "not found"});
                }
                else{
                    res.status(200);
                    res.json(result);
                }
            })
            .fail(err => next(err));
    })

// Export
module.exports = function (errCallback){
	console.log('Initializing users routing module');
	
	handleError = errCallback;
	return router;
};