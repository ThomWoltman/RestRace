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

describe('Test', function(){
		it('should return true', function(done){
            expect(1).to.equal(1);
            done();
		});
	

		it('should return false');
	
});

