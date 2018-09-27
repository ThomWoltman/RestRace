var mongoose = require('mongoose');
Race = mongoose.model('Race');

module.exports = {
    getRaces(req, res, next){
        var result = Race.find({ Owners: req.query.user_id });

        result
            .then(data => {
                req.data = data;
                next();
            })
            .fail(err => next(err));
    },

    addRace(req, res, next){
        var race = new Race(req.body);
        race
            .save()
            .then(data => {
                req.data = data;
                next();
            })
            .fail(err =>  next(err));
    }
}
