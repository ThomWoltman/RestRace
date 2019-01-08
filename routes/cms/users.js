var express = require('express');
var router = express();

const { findUsers, deleteUser } = require('../../models/user');

router.get('/', (req, res, next) => {
    findUsers()
    .then(users => {
        console.log(users);
        res.render('users', { 
            users,
            successMessage: req.flash('userSuccessMessage'),
        });
    })
    .fail(err => next(err));
});

router.post('/:id/delete', (req, res, next) => {
	deleteUser(req.params.id)
		.then(result => {
            req.flash('userSuccessMessage', 'User "'+req.params.id+'" successfully deleted!');
			res.redirect('/cms/users');
		})
		.fail(err => {
			next(err);
		})
})

// Export
module.exports = function (){
	return router;
};