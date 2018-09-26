module.exports = {
    isLoggedIn(req, res, next) {

        // if user is authenticated in the session, carry on 
        if (req.isAuthenticated())
            return next();
    
        // if they aren't redirect them to the login page
        res.redirect('/login');
    },
    
    isNotLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            res.redirect('/');
    
        return next();
    }
}
