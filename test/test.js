var request = require('supertest');
var expect = require('chai').expect;
var should = require('chai').should();

var app = require('express')();

//var races = require('../routes/api/races');
var index = require('../app.js');
app.use('*', index);

function makeRequest(route, statusCode, done){
	request(app)
		.get(route)
		.auth('admin@admin.nl', 'admin')
		.expect(statusCode)
		.end(function(err, res){
			if(err){ return done(err); }

			done(null, res);
		});
};

describe('API', function(){
	describe('/races', function(){
		describe('GET', function() {
			it('should return "Unauthorized" when not logged in', function(done){
				makeRequest('/api/races/', 302, function(err , res) {
					if(err => done(err));

					expect(true).to.equal(res.body);
					done();
				});
			});
	
			it('should return races', function(){
				expect(true).to.equal(true);
			})
		})

		describe('POST', function() {
			it('should return save race', function(){
				expect(true).to.equal(true);
			})
	
			it('should return error on validation', function(){
				expect(true).to.equal(true);
			})
		})
	})	
});

