var express = require('express');
var router = express();

const { addParticipant } = require('../../controllers/RaceController');
const { getRaces } = require('../../controllers/UserController');

router.get('/', (req, res, next) => {
    let checkins;
    getRaces(req.user._id)
        .then(races => {
            let checkins = [];
            
            races.forEach(race => {
                race.Participants.forEach(participant => {
                    if(participant.user_id == req.user._id+""){
                        checkins[race._id] = participant.checkins.length;
                    }
                });
            });
            console.log(races);
            res.render('joined_races', { 
                errorMessage: req.flash('raceErrorMessage'), 
                successMessage: req.flash('raceSuccessMessage'),
                races,
                checkins
            });
        })
        .fail(err => next(err));
});

router.post('/', (req, res, next) => {
    //add as participant to race
    addParticipant(req.body.raceId, req.user._id, req.body.secret)
        .then(result => {
            if(!result) {
                req.flash('raceErrorMessage', 'Race niet gevonden');
                res.redirect('/cms/joinedraces');
            }
            if(result.n > 0){
                req.flash('raceSuccessMessage', 'Race toegevoegd');
                res.redirect('/cms/joinedraces');
            }
            else {
                req.flash('raceErrorMessage', 'Secret niet correct');
                res.redirect('/cms/joinedraces');
            }
        })
        .fail(err => next(err));
})

// Export
module.exports = function (){
	return router;
};