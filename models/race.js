// load the things we need
var mongoose = require('mongoose');
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
    },
    //need validation on places
    //don't add duplicates
    Places: {
        type: [
            {
                type: String,
                validate: {
                    validator: function(id) {
                      return id.length === 27;
                    },
                    message: props => `${props.value} is not a valid place id!`
                  }
            }
        ]
    },
    Started: {
        type: Boolean,
        default: false
    },
    Participants:
        [
            {
                user_id: {
                    type: Schema.Types.ObjectId, 
                    ref: "User",
                },
                checkins: [
                    {
                        type: String,
                    }
                ]
            }
        ]
});

raceSchema.methods.validSecret = function(secret) {
    return this.secret === secret;
};

const Race = mongoose.model('Race', raceSchema);

module.exports = {
    Race
}