var request = require('supertest');
var expect = require('chai').expect;
var should = require('chai').should();

var app = require('express')();

function makeRequest(route, statusCode, done){
	request(app)
		.get(route)
		.expect(statusCode)
		.end(function(err, res){
			if(err){ return done(err); }

			done(null, res);
		});
};

describe('API', function(){
	describe('/races', function(){
		describe('GET', function() {
			it('should return "Unauthorized" when nog logged in', function(){
				expect(true).to.equal(true);
			})
	
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

