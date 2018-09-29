// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

// define the schema for our user model
const raceSchema = mongoose.Schema({

    Name: String,
    Secret: String,
    Owners: {
        type: [
            {
                type: Schema.Types.ObjectId, 
                ref: "User",
            }
        ]
    }
});
const Race = mongoose.model('Race', raceSchema);

function findRaces(userId) {
    return Race.find({ Owners: userId});
}

function addRace(race, userId) {
    const newRace = {
        ...race,
        Owners: [
            { "_id": userId }
        ]
    };

    return new Race(newRace)
        .save()
}

// create the model for users and expose it to our app
module.exports = mongoose.model('Race', raceSchema);

module.exports = {
    Race,
    findRaces,
    addRace,
}