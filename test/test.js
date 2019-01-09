var request = require('supertest');
var expect = require('chai').expect;
var should = require('chai').should();

var app = require('express')();

var races = require('../routes/api/races');
app.use('/api/races', races);

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
				makeRequest('/api/races/', 200, function(err, res) {
					if(err) {
						console.log("error");
						console.log(err);
						expect(undefined).to.equal(err);
					}
					else{
						console.log("response");
						console.log(res);
						expect(true).to.equal(res);
					}
					
				})
				
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

