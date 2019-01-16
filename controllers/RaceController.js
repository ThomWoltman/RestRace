const { Race } = require('../models/race');
const { findSinglePlace } = require('../controllers/PlaceController');

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

function findRace(raceId, userId) {
    return Race.findOne({_id: raceId, Owners: userId});
}

function addPlaces(Places, raceId, userId){
    return Race.update({ _id: raceId, Owners: userId}, { $addToSet: { Places : { $each : Places} } }, {runValidators:true})
}

function updatePlaces(raceId, userId, Places) {
    return Race.update({ _id: raceId, Owners: userId}, { $set: { Places } }, {runValidators:true})
}

function removePlace(raceId, userId, placeId) {
    return new Promise((resolve, reject) => {
        findRace(raceId, userId)
            .then(result => {
                if(!result) resolve(result);
                result.Places = result.Places.filter(function(elementId) {
                    return elementId != placeId;
                })
                resolve(result.save());
            })
            .catch(err => reject(err));
    })
}

function findSingleRaceByOwner(raceId, userId) {
    return new Promise((resolve, reject) => {
        Race.findOne({ _id: raceId, Owners: userId}).populate('Owners').populate('Participants.user_id').lean().exec(function(err, race) {
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

function getParticipants(raceId, userId) {
    return Race.findOne({_id: raceId, Owners: userId}, 'Participants');
}

function addParticipant(raceId, userId, secret){
    return Race.update({_id: raceId, Secret: secret, 'Participants.user_id': { '$ne': userId }}, { $addToSet: { Participants: { user_id: userId } }});
}

function startRace(raceId, userId){
    return Race.update({_id: raceId, Owners: userId}, { $set: { Started: true} });
}

function getRacesAsParticipant(userId){
    return Race.find({ "Participants.user_id": userId }).lean();
}

function getRaceAsParticipant(userId, race_id){
    return Race.findOne({ "Participants.user_id": userId, _id: race_id }).lean();
}

function addCheckin(raceId, placeId, userId){
    return Race.update({ "Participants.user_id": userId, _id: raceId, Places: placeId }, { $addToSet: { "Participants.$.checkins": placeId } }, {runValidators:true})
}

module.exports = {
    findRaces,
    addRace,
    deleteRace,
    findSingleRace,
    findSingleRaceByOwner,
    updateRace,
    addPlaces,
    updatePlaces,
    removePlace,
    getParticipants,
    addParticipant,
    startRace,
    getPlaces,
    getRacesAsParticipant,
    getRaceAsParticipant,
    addCheckin
}