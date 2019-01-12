// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String,
    },
    facebook         : {
        id           : String,
        token        : String,
        name         : String,
        email        : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    role : {
        type : String,
        enum : ['admin', 'normal'],
        default: 'normal'
    }
});

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

function updateRole(userId, role){
    return User.update({ _id: userId}, { $set: { role } }, {runValidators:true});
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

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

userSchema.methods.isAdmin = function() {
    return this.role === 'admin';
}

const User = mongoose.model('User', userSchema);

// create the model for users and expose it to our app
module.exports = {
    User,
    findUsers,
    deleteUser,
    findUser,
    addUser,
    getRole,
    updateRole,
}