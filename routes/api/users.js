var express = require('express');
var _ = require('underscore');
var router = express(); 
var handleError;

const { findUsers, findUser, deleteUser, addUser, getRole, updateUser } = require('../../controllers/UserController');

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
        updateUser(req.params.id, { role: req.body.role })
            .then(result => {
                res.status(200);
                res.json(result);
            })
            .fail(err => next(err));
    })

    router.route('/:id/racesparticipated')
    .get((req, res, next) => {
        
    })
    .post((req, res, next) => {
        //participate in race
        //if correct
        //  add to racesparticipated
        //else
        //  return json('message: wrong secret')
    })

// Export
module.exports = function (errCallback){
	console.log('Initializing users routing module');
	
	handleError = errCallback;
	return router;
};