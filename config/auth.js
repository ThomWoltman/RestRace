const express = require('express');
const app = express();

// config/auth.js
const facebookCallBackUrl = app.get('env') === 'development' ? 'http://localhost:8080/auth/facebook/callback' : 'https://restracethom.herokuapp.com/auth/facebook/callback';

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : '2265306607089262', // your App ID
        'clientSecret'  : '0231a9b812ad0af2f4101ce9a0cb0354', // your App Secret
        'callbackURL'   : facebookCallBackUrl,
        'profileURL'    : 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
        'profileFields' : ['id', 'email', 'name'] // For requesting permissions from Facebook API
    },

    'twitterAuth' : {
        'consumerKey'       : 'your-consumer-key-here',
        'consumerSecret'    : 'your-client-secret-here',
        'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : 'your-secret-clientID-here',
        'clientSecret'  : 'your-client-secret-here',
        'callbackURL'   : 'http://localhost:8080/auth/google/callback'
    }

};