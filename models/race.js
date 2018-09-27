// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

// define the schema for our user model
var raceSchema = mongoose.Schema({

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

// create the model for users and expose it to our app
module.exports = mongoose.model('Race', raceSchema);