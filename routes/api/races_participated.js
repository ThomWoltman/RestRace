var express = require('express');
var _ = require('underscore');
var router = express();
let handleError;

const { addParticipant, getPlaces, getRaceAsParticipant, getRacesAsParticipant, addCheckin } = require('../../controllers/RaceController');

    router.route('/')
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
                if(result.n > 0) {
                    res.status(201);
                    res.json(result);
                }
                else{
                    res.status(400);
                    res.send({ message: "bad request"});
                }
            })
            .fail(err => next(err));
    })

    router.route('/:race_id')
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

    router.route('/:race_id/places')
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

    router.route('/:race_id/checkins')
    .get((req, res, next) => {
        getRaceAsParticipant(req.user._id, req.params.race_id)
            .then(result => {
                let checkins = [];
                result.Participants.forEach(Participant => {
                    if(Participant.user_id == req.user._id+""){
                        checkins = Participant.checkins;
                    }
                });
                getPlaces(checkins)
                    .then(result => {
                        res.status(200);
                        res.json(result);
                    })
                    .catch(err => next(err));
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
                    if(result.nModified > 0){
                        res.status(200);
                        res.json(result);
                    }
                    else {
                        res.status(400);
                        res.json({message: "Er is al ingecheckt op deze locatie"});
                    }
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