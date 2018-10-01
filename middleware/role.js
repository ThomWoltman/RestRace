module.exports = {
    isAdmin(req, res, next) {

        // if user is authenticated in the session, carry on 
        if (req.user && req.user.isAdmin())
            return next();
    
        // if they aren't redirect them to the login page
        res.redirect('/');
    }
}
