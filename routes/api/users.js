var express = require('express');
var _ = require('underscore');
var router = express(); 
var handleError;
const { findUsers, findUser, deleteUser, addUser, getRole, updateRole } = require('../../models/user');

router.route('/')
    .get((req, res, next) => {
        findUsers()
            .then(users => {
                res.status(200);
                res.json(users);
            })
            .fail(err => next(err));  
    })
    .post((req, res, next) => {
        addUser(req.body.email, req.body.password)
            .then(result => {
                res.status(200);
                res.json(result);
            })
            .fail(err => next(err));
    })

router.route('/:id')
    .get((req, res, next) => {
        findUser(req.params.id)
            .then(user => {
                if(user){
                    res.status(200);
                    res.json(user);
                }
                else{
                    res.status(404);
                    res.json({ message: 'user not found' });
                }
            })
            .fail(err => next(err)); 
    })
    .delete((req, res, next) => {
        deleteUser(req.params.id)
            .then(result => {
                if(result.result.n > 0) {
                    res.status(200);
                    res.json(result);
                }
                else {
                    res.status(404);
                    res.json({ message: 'user not found' });
                }
            })
            .fail(err => next(err));
    })   

    router.route('/:id/role')
    .get((req, res, next) => {
        getRole(req.params.id)
            .then(role => {
                if(role){
                    res.status(200);
                    res.json(role);
                }
                else{
                    res.status(404);
                    res.json({ message: 'user not found' });
                }
            })
            .fail(err => next(err)); 
    })
    .patch((req, res, next) => {
        updateRole(req.params.id, req.body.role)
            .then(result => {
                res.status(200);
                res.json(result);
            })
            .fail(err => next(err));
    })


// Export
module.exports = function (errCallback){
	console.log('Initializing places routing module');
	
	handleError = errCallback;
	return router;
};