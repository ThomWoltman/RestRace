var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');

//environment variables
require('dotenv').config();

//swagger docs
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
var options = { 
    swaggerDefinition: {
        swagger: "2.0", 
        info: {
            title: 'RestRace'
        },
        "securityDefinitions": {
            "basicAuth": {
              "type": "basic"
            }
          },
          "security": [
            {
              "basicAuth": []
            }
          ]
     },      
    apis: ['./models/*.js', './app.js', './routes/api/*.js','./docs/models/*.yaml', './docs/routes/*.yaml'],
};
var swaggerSpec = swaggerJSDoc(options);
// /swagger docs

// Data Access Layer
var mongoose = require('mongoose');
// /Data Access Layer

// authentication
var passport = require("passport");
// /authentication

var flash = require("connect-flash");
var session = require("express-session");

var configDB = require('./config/database.js');
mongoose.connect(configDB.url, { useNewUrlParser: true } );
mongoose.Promise = require('q').Promise;

require('./config/passport.js')(passport); // pass passport for configuration

//middleware
var login = require('./middleware/login');
var users = require('./middleware/role');
var authenticate = require('./middleware/authenticate');

function handleError(req, res, statusCode, message){
    console.log();
    console.log('-------- Error handled --------');
    console.log('Request Params: ' + JSON.stringify(req.params));
    console.log('Request Body: ' + JSON.stringify(req.body));
    console.log('Response sent: Statuscode ' + statusCode + ', Message "' + message + '"');
    console.log('-------- /Error handled --------');
    res.status(statusCode);
    res.json(message);
};

var app = express();

const isDevelopment = app.get('env') === 'development';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch', resave: false, saveUninitialized: false })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

//account
app.use('/', require('./routes/index')(app, passport, handleError));
//account

//cms
app.use('/cms/', login.isLoggedIn); //can only access cms when logged in

app.use('/cms/joinedraces', require('./routes/cms/joined_races')());

app.use('/cms/races', users.isAdmin, require('./routes/cms/races')());

app.use('/cms/users', users.isAdmin, require('./routes/cms/users')()); //can only access when admin

app.use('/cms/places', users.isAdmin, require('./routes/cms/places')());
//cms


//api
app.use('/api/', (req, res, next) => {
    passport.authenticate('basic', { session: false }, (err, user, info) => {
        if(err) { return next(err) }
        if(!user) { 
            res.status(401);
            res.json({ error: "Unauthorized" });
        }
        if(user) {
            req.login(user, next);
        }
    })(req, res, next);
});

app.use('/api/races', authenticate.isAdmin, require('./routes/api/races')(handleError));

app.use('/api/places', authenticate.isAdmin, require('./routes/api/places')(handleError));

app.use('/api/users', authenticate.isAdmin, require('./routes/api/users')(handleError));

app.use('/api/racesparticipated', require('./routes/api/races_participated')(handleError));
//api


//api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/api-docs.json", (req, res) => {
    res.send(swaggerSpec);
});
//api-docs


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
app.use('/api', (err, req, res, next) => {
    res.status(400);
    res.json({
        name: err.name,
        message: err.message,
        stack: isDevelopment && err.stack
    });
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var port = process.env.PORT || 8080;

app.listen(port, function () {
  console.log('Express server listening on port ' + port)
})


module.exports = app;
