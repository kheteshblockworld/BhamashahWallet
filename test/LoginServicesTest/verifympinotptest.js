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



describe('verify OTP for MPIN', function() {
    it("OTP verified Successfully",function(done){
      request(app) 
      api
.post('/verifyMpinOTP')
.send({"lang":"en",
"otp":1234,  
"ref_no":2649629929
})
        .set("Accept",'application/json',{"lang":"en"})
        .expect(200)
        .end(function(err,res){
          res.status.should.equal(200);
          res.body.should.have.property('lang');
        res.body.should.have.property('otp');
        res.body.should.have.property('ref_no');
     
        
        });
        done();
});

it("fields should not be empty ",function(done){
request(app) 
api
.post('/verifyMpinOTP')
          .send({"lang":"en",
          "otp":1234,  
          "ref_no":2649629929 
              })
          .set("Accept",'application/json',{"lang":"en"})
          .expect(401)
           .end(function(err,res){
            res.status.should.equal(401);
            res.body.should.have.property('lang');
          res.body.should.have.property('otp');
          res.body.should.have.property('ref_no');
     
});
done();
});

it("Invalid OTP/OTP Reference/More then 30 mins",function(done){
    request(app) 
    api
    .post('/verifyMpinOTP')
              .send({ "lang":"en",
              "otp":1234,  
              "ref_no":2649629929 
                         
                  })
              .set("Accept",'application/json',{"lang":"en"})
              .expect(400)
              .end(function(err,res){
                res.status.should.equal(400);
                res.body.should.have.property('lang');
                res.body.should.have.property('otp');
                res.body.should.have.property('ref_no');
    });
    done();
    });
  

})
