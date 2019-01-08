// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

const { findSinglePlace } = require('../models/places');

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
    },
    Places: {
        type: [
            {
                type: String
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

function addPlaces(Places, raceId, userId){
    return Race.update({ _id: raceId, Owners: userId}, { $push: { Places : { $each : Places} } }, {runValidators:true})
}

function findSingleRaceByOwner(raceId, userId) {
    return new Promise((resolve, reject) => {
        Race.findOne({ _id: raceId, Owners: userId}).populate('Owners').lean().exec(function(err, race) {
            if(err) {
                reject(err);
            }    
    
            getPlaces(race.Places)
                .then(places => {
                    let resultRace = createRaceWithPlacesObject(race, places);
                    resolve(resultRace);
                })
                .catch(err => {
                    reject(err);
                    }); 
        });
    });
}

function getPlaces(placeids){
    return new Promise((resolve, reject) => {
        let promises = [];
        
        let places = [];
        placeids.forEach(placeid => {
            let promise = new Promise((resolve1, reject1) => {
                findSinglePlace(placeid)
                .end((err, place) => {
                    if(err) reject1(err);
                    places.push(place.body.result);
                    resolve1();
                })
            })
            promises.push(promise);
        });
        Promise.all(promises).then(result => resolve(places)).catch(err => reject(err));
    });
}

function createRaceWithPlacesObject(race, places){
    let newPlaces = [];

    places.forEach(place => {
        var newPlace = {};
        newPlace.name = place.name;
        newPlace.vicinity = place.vicinity;
        newPlace.place_id = place.place_id;
        newPlaces.push(newPlace);
    });

    race.Places = newPlaces;

    return race;
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
    addPlaces
}