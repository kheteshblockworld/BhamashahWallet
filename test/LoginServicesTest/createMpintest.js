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



describe('Create MPIN', function() {
    it("MPIN Created Successfully",function(done){
      request(app) 
      api
.post('/createMPIN')
.send({"userId":10,
"mpin":1234,  
"confirmMpin":1234,
"deviceId" : "wvuwwey12123yuvc",
"oneSignalId" : "cuvccd22bedb"
})
        .set("Accept",'application/json',{"lang":"en"})
        .expect(200)
        .end(function(err,res){
          res.status.should.equal(200);
          res.body.should.have.property('userId');
        res.body.should.have.property('mpin');
        res.body.should.have.property('confirmMpin');
        res.body.should.have.property('deviceId');
        res.body.should.have.property('oneSignalId');
     
        
        });
        done();
});

it("fields should not be empty during create MPIN",function(done){
request(app) 
api
.post('/createMPIN')
          .send({"userId":10,
          "mpin":1234,  
          "confirmMpin":1234,
          "deviceId" : "wvuwwey12123yuvc",
          "oneSignalId" : ""  ,        
              })
          .set("Accept",'application/json',{"lang":"en"})
          .expect(401)
           .end(function(err,res){
            res.status.should.equal(401);
            res.body.should.have.property('userId');
          res.body.should.have.property('mpin');
          res.body.should.have.property('confirmMpin');
        res.body.should.have.property('deviceId');
        res.body.should.have.property('oneSignalId');
     
});
done();
});

it("Invalid Pin",function(done){
    request(app) 
    api
    .post('/createMPIN')
              .send({ "userId":10,
              "mpin":1234,  
              "confirmMpin":1234,
              "deviceId" : "wvuwwey12123yuvc",
              "oneSignalId" : "sivaca6wqf57" ,
                         
                  })
              .set("Accept",'application/json',{"lang":"en"})
              .expect(401)
              .end(function(err,res){
                res.status.should.equal(401);
                res.body.should.have.property('userId');
                res.body.should.have.property('mpin');
                res.body.should.have.property('confirmMpin');
              res.body.should.have.property('deviceId');
              res.body.should.have.property('oneSignalId');
     
       
    });
    done();
    });

})
