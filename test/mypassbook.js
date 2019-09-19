'use strict';
const express = require('express');
const chai = require('chai');  
const expect = require('chai').expect;
chai.use(require('chai-http'));
const app = require('./../app');

var mlog=require('mocha-logger')
var empty = require('is-empty');
var assert = require('assert');
var should = require("should");

var sinon = require('sinon');
var http = require('http');
var request = require("supertest");

var config = require('config');
var TestIp = config.get('TestIp');

var api = request("http://"+TestIp.host+":4000")

describe('readpassbook', function() {
    it("fetch transaction history of user",function(done){
      request(app) 
      api
.post('/readpassbook')
.send({ 
"days":"0",
"page":"1"
})
.set('user_language','en')
.set('access_token', 'b006720f32f04754:Qq4RBovSz99F1nAf_mWkTCoFaBEFRlQnwjV1TrANCsfZasPqpyXCLZvAcdajLE_F')
        .set("Accept",'application/json')
        .expect(200)
        .end(function(err,res){
        res.status.should.equal(200);
        res.body.should.have.property('access_token');
        res.body.should.have.property('user_language');
        res.body.should.have.property('days');
        res.body.should.have.property('page');
        });
        done();
});

it("fields should not be empty during readpassbook",function(done){
request(app) 
api
.post('/readpassbook')
          .send({ 
          "days":"0",
            "page":"1"        
              })
          .set("Accept",'application/json')
          .set('user_language','en')
            .set('access_token', 'b006720f32f04754:Qq4RBovSz99F1nAf_mWkTCoFaBEFRlQnwjV1TrANCsfZasPqpyXCLZvAcdajLE_F')
          .expect(400)
           .end(function(err,res){
            res.status.should.equal(400);
            res.body.should.have.property('access_token');
            res.body.should.have.property('user_language');
            res.body.should.have.property('days');
            res.body.should.have.property('page');
});
done();
});
})