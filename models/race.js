// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

// define the schema for our user model
const raceSchema = mongoose.Schema({

    Name: {
        type: String,
        required: [true, "Name is required"]
    },
    Secret: {
        type: String,
        required: [true, "Secret is required"]
    },
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

function deleteRace(raceId, userId){
    return Race.remove({ _id: raceId, Owners: userId});
}

function findSingleRace(raceId) {
    return Race.findById(raceId);
}

function findSingleRaceByOwner(raceId, userId) {
    return Race.findOne({ _id: raceId, Owners: userId});
}

function updateRace(race, userId) {
    return Race.update({ _id: race._id, Owners: userId}, { $set: { ...race } }, {runValidators:true});
}

// create the model for users and expose it to our app
module.exports = mongoose.model('Race', raceSchema);

module.exports = {
    Race,
    findRaces,
    addRace,
    deleteRace,
    findSingleRace,
    findSingleRaceByOwner,
    updateRace,
}