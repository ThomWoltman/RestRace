const { User } = require('../models/user');

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

// create the model for users and expose it to our app
module.exports = {
    findUsers,
    deleteUser,
    findUser,
    addUser,
    getRole,
    updateUser
}