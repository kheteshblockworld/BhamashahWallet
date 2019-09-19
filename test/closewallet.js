'use strict';
const express = require('express');
const chai = require('chai');  
const expect = require('chai').expect;
chai.use(require('chai-http'));
const app = require('./../app');

var mlog=require('mocha-logger');
var empty = require('is-empty');
var assert = require('assert');
var should = require("should");

var sinon = require('sinon');
var http = require('http');
var request = require("supertest");

var config = require('config');
var TestIp = config.get('TestIp');

var api = request("http://"+TestIp.host+":4000")

describe('Closewallet', function() {
    it("wallet closed  Successfully",function(done){
      request(app) 
      api
.post('/closewallet')

        .set("Accept",'application/json')
        .set('user_language','en')
        .set('access_token', '4ca884dbb134158c:mQ8MfHMObF6CEmHjKqbn8sbtH6XDcX7Sx_rMgNOAH_E6dcUvRnSjwbrQoyelHgFN')
        .expect(200)
        .end(function(err,res){
        res.status.should.equal(200);
        res.body.should.have.property('access_token');
        res.body.should.have.property('user_language');
        res.body.should.have.property('otp');
        res.body.should.have.property('transaction_id');
        res.body.should.have.property('otp_transaction_id');

        });
        done();
});

it("fields should not be empty during closewallet",function(done){
request(app) 
api
.post('/closewallet')
          
          .set("Accept",'application/json')
          .set('user_language','en')
            .set('access_token', '')
          .expect(400)
           .end(function(err,res){
            res.status.should.equal(400);
            res.body.should.have.property('access_token');
            res.body.should.have.property('user_language');
});
done();
});
})