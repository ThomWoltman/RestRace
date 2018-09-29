//var mongoose = require('mongoose');
//Race = mongoose.model('Race');

const { Race, findRaces, addRace } = require('../models/race');

module.exports = {
    getRaces(req, res, next){
        var result = Race.find({ Owners: req.user_id });

        result
            .then(data => {
                res.locals.data = data;
                next();
            })
            .fail(err => next(err));
    },

    addRace(req, res, next){
        var race = new Race(req.body);
        race
            .save()
            .then(data => {
                req.locals.data = data;
                next();
            })
            .fail(err =>  next(err));
    }
}
