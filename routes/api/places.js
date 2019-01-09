var express = require('express');
var _ = require('underscore');
var router = express();
var handleError;

const { findPlacesByQuery, findSinglePlace, findPlaces } = require('../../models/places');

router.route('/')
    .get((req, res, next) => {
        if(req.query.query){
            findPlacesByQuery(req.query.query)
            .end((err, result) => {
                if(err) { next(err); }
                
                res.status(200);
                res.json(result.body.candidates);
            });
        }
        else{
            findPlaces({lat: req.query.latitude, long: req.query.longitude, radius: req.query.radius}, {type: req.query.type})
                .end((err, result) => {
                    if(err) { next(err); }
                    
                    res.status(200);
                    res.json(result.body.results);
                });
        }
    })

router.route('/:id')
	.get((req, res, next) => {
        findSinglePlace(req.params.id)
            .end((err, result) => {
                if(err) { next(err); }
                
                if(result.body.result){
                    res.status(200);
                    res.json(result.body.result);
                }
                else{
                    res.status(404);
                    res.json({message: 'resource not found'});
                }
            });
	})

// Export
module.exports = function (errCallback){
	console.log('Initializing places routing module');
	
	handleError = errCallback;
	return router;
};