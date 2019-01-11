var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//environment variables
require('dotenv').config();

//swagger docs
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
var options = { swaggerDefinition: { /* swaggerDefinition */ },    apis: ['./models/*.js', './routes/api/*.js', './app.js'] };
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
mongoose.connect(configDB.url, { useMongoClient: true } );
mongoose.Promise = require('q').Promise;

require('./config/passport.js')(passport); // pass passport for configuration

//middleware
var login = require('./middleware/login');
var users = require('./middleware/role');

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

app.use('/', require('./routes/index')(app, passport, handleError));

app.use('/cms/', login.isLoggedIn); //can only access cms when logged in

app.use('/cms/races', require('./routes/cms/races')());

app.use('/cms/users', users.isAdmin, require('./routes/cms/users')()); //can only access when admin

app.use('/cms/places', users.isAdmin, require('./routes/cms/places')());

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

app.use('/api/races', require('./routes/api/races')(handleError));
app.use('/api/places', require('./routes/api/places')(handleError));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
app.use('/api', (err, req, res, next) => {
    res.status(500);
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

app.listen(8080, () => console.log('Example app listening on port 8080!'))

module.exports = app;
