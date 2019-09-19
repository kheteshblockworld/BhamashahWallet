'use strict';
const express = require('express');
const chai = require('chai');  
const expect = require('chai').expect;
chai.use(require('chai-http'));
const app = require('../../app');

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



describe('MPIN Login', function() {
    it("Login Successful",function(done){
      request(app) 
      api
.post('/MPINLogin')
.send({
"mpinCode":1234,  
"deviceId" : "wvuwwey12123yuvc",
"oneSignalId" : "cuvccd22bedb",
"lang":"en"
})
        .set("Accept",'application/json',{"lang":"en"})
        .expect(200)
        .end(function(err,res){
          res.status.should.equal(200);
          res.body.should.have.property('mpinCode');
        res.body.should.have.property('deviceId');
        res.body.should.have.property('oneSignalId');
        res.body.should.have.property('lang');
       
     
        
        });
        done();
});

it("fields should not be empty during login MPIN",function(done){
request(app) 
api
.post('/MPINLogin')
          .send({"mpinCode":1234,  
          "deviceId" : "wvuwwey12123yuvc",
          "oneSignalId" : "",
          "lang":"en"     
              })
          .set("Accept",'application/json',{"lang":"en"})
          .expect(401)
           .end(function(err,res){
            res.status.should.equal(401);
            res.body.should.have.property('mpinCode');
          res.body.should.have.property('deviceId');
          res.body.should.have.property('lang');
        res.body.should.have.property('oneSignalId');
     
});
done();
});

it("Invalid Pin",function(done){
    request(app) 
    api
    .post('/MPINLogin')
              .send({ 
                "mpinCode":1234,  
                "deviceId" : "wvuwwey12123yuvc",
                "oneSignalId" : "cuvccd22bedb",
                "lang":"en"
                         
                  })
              .set("Accept",'application/json',{"lang":"en"})
              .expect(400)
              .end(function(err,res){
                res.status.should.equal(400);
                res.body.should.have.property('mpinCode');
                res.body.should.have.property('lang');
              res.body.should.have.property('deviceId');
              res.body.should.have.property('oneSignalId');
     
       
    });
    done();
    });

})
