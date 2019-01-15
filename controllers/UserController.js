const { User } = require('../models/user');
const { Race } = require('../models/race');

let defaultRacePopulate = {
    path: 'racesParticipated.raceId', 
    select: 'Name Places _id'
}

function findUsers() {
    return User.find();
}

function deleteUser(userId){
    return User.remove({ _id: userId});
}

function findUser(userId){
    return User.findOne({ _id: userId});
}

function getRole(userId){
    return User.findOne({ _id: userId}, 'role');
}

function updateUser(userId, fields){
    return User.update({ _id: userId }, { $set: { ...fields }}, { runValidators:true });
}

function addUser(email, password, role='normal') {
    const user = {
        local: {
            email,
            password,
        },
        role
    };

    return new User(user)
        .save()
}

function getRaces(userId){
    return Race.find({ "Participants.user_id": userId }).lean();
}

function getRace(userId, race_id){
    return Race.findOne({ "Participants.user_id": userId, _id: race_id }).lean();
}

function addCheckin(raceId, placeId, userId){
    return Race.update({ "Participants.user_id": userId, _id: raceId }, { $push: { "Participants.$.checkins": placeId } }, {runValidators:true})
}

// create the model for users and expose it to our app
module.exports = {
    findUsers,
    deleteUser,
    findUser,
    addUser,
    getRole,
    updateUser,
    getRaces,
    getRace,
    addCheckin
}