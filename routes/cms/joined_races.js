var express = require('express');
var router = express();

const { addParticipant } = require('../../controllers/RaceController');
const { addRace, findUser, getRaces } = require('../../controllers/UserController');

router.get('/', (req, res, next) => {
    getRaces(req.user._id)
        .then(races => {
            console.log(races);
            res.render('joined_races', { 
                errorMessage: req.flash('raceErrorMessage'), 
                successMessage: req.flash('raceSuccessMessage'),
                races
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
                addRace(req.body.raceId, req.user._id)
                    .then(result => {
                        req.flash('raceSuccessMessage', 'Race toegevoegd');
                        res.redirect('/cms/joinedraces');
                    })
                    .fail(err => next(err));
            }
            else {
                req.flash('raceErrorMessage', 'Secret niet correct');
                res.redirect('/cms/joinedraces');
            }
        })
        .fail(err => next(err));
    //if secret is correct
    // add to your own user page
    //else
    //  message: incorrect id or secret
})

// Export
module.exports = function (){
	return router;
};