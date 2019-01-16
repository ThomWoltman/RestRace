var request = require('supertest');
var expect = require('chai').expect;
var should = require('chai').should();

var app = require('express')();

//var races = require('../routes/api/races');
var index = require('../app.js');
app.use('*', index);

let { Race } = require('../models/race');

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

					expect(true).to.equal(true);
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

describe('Models', function() {
	describe('Race', function(){
		it('Secret should be required', function(done){
			let race = new Race();
			race.Name = "bla";
	
			race.save(function(err) {
				if(err){
					expect(err.name).to.equal('ValidationError');
					expect(err.errors.Secret.path).to.equal('Secret');
					expect(err.errors.Secret.message).to.equal('Secret is required');
					done();
				}
			})
		})
		it('Name should be required', function(done){
			let race = new Race();
			race.Secret = "bla";
	
			race.save(function(err) {
				if(err){
					
					expect(err.name).to.equal('ValidationError');
					expect(err.errors.Name.path).to.equal('Name');
					expect(err.errors.Name.message).to.equal('Name is required');
					done();
				}
			})
		})
	})
})

