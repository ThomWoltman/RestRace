var express = require('express');
var router = express.Router();

module.exports = function(app, passport){
  /* GET home page. */
router.get('/', isLoggedIn, function(req, res, next) {
  res.render('index', { title: 'Rest Race', user: req.user });
});

router.get('/hello', function(req, res, next) {
  res.send('Hello World!');
});

router.get('/signup', isNotLoggedIn, function(req, res, next) {
  // render the page and pass in any flash data if it exists
  res.render('signup', { title: 'Signup', message: req.flash('signupMessage') });
});

// process the signup form
router.post('/signup', passport.authenticate('local-signup', {
  successRedirect : '/profile', // redirect to the secure profile section
  failureRedirect : '/signup', // redirect back to the signup page if there is an error
  failureFlash : true // allow flash messages
}));

// show the login form
router.get('/login', isNotLoggedIn, function(req, res, next) {

  // render the page and pass in any flash data if it exists
  res.render('login', { title: 'Login', message: req.flash('loginMessage') }); 
});

router.post('/login', passport.authenticate('local-login', {
  successRedirect : '/profile', // redirect to the secure profile section
  failureRedirect : '/login', // redirect back to the signup page if there is an error
  failureFlash : true // allow flash messages
}));

router.get('/profile', isLoggedIn, function(req, res, next) {
  res.render('profile', {
      user : req.user // get the user out of session and pass to template
  });
});

// =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { 
      scope : ['public_profile', 'email']
    }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

// =====================================
    // LOGOUT ==============================
    // =====================================
router.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
});

  return router;
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated())
      return next();

  // if they aren't redirect them to the login page
  res.redirect('/login');
}

function isNotLoggedIn(req, res, next){
  if (req.isAuthenticated())
    res.redirect('/');

  return next();
}
