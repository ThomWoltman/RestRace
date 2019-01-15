module.exports = {
    isAdmin(req, res, next) {
        if(req.user.isAdmin()){
            next();
        }
        else{
            res.status(401);
            res.json({ message: "Not authorized to access /api/users"});
        }
    },
}