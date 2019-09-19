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



describe('forgot MPIN', function() {
    it("OTP sent Successfully",function(done){
      request(app) 
      api
.post('/forgotMpin')
.send({"mobile":9876543210,
"mobile_type":"mobile",  
"lang":"en"
})
        .set("Accept",'application/json',{"lang":"en"})
        .expect(200)
        .end(function(err,res){
          res.status.should.equal(200);
          res.body.should.have.property('mobile');
        res.body.should.have.property('mobile_type');
        res.body.should.have.property('lang');
     
        
        });
        done();
});

it("fields should not be empty ",function(done){
request(app) 
api
.post('/forgotMpin')
          .send({"mobile":9876543210,
          "mobile_type":"",  
          "lang":"en"    
              })
          .set("Accept",'application/json',{"lang":"en"})
          .expect(401)
           .end(function(err,res){
            res.status.should.equal(401);
            res.body.should.have.property('mobile');
          res.body.should.have.property('mobile_type');
          res.body.should.have.property('lang');
     
});
done();
});

it("User not found",function(done){
    request(app) 
    api
    .post('/forgotpin')
              .send({ "mobile":9876543210,
              "mobile_type":"mobile",  
              "lang":"en"
                         
                  })
              .set("Accept",'application/json',{"lang":"en"})
              .expect(400)
              .end(function(err,res){
                res.status.should.equal(400);
                res.body.should.have.property('mobile');
                res.body.should.have.property('mobile_type');
                res.body.should.have.property('lang');
    });
    done();
    });
    it("Unable to send OTP",function(done){
        request(app) 
        api
        .post('/forgotpin')
                  .send({ "mobile":9876543210,
                  "mobile_type":"mobile",  
                  "lang":"en"
                             
                      })
                  .set("Accept",'application/json',{"lang":"en"})
                  .expect(400)
                  .end(function(err,res){
                    res.status.should.equal(400);
                    res.body.should.have.property('mobile');
                    res.body.should.have.property('mobile_type');
                    res.body.should.have.property('lang');
        });
        done();
        });
        it("User not found",function(done){
    request(app) 
    api
    .post('/forgotpin')
              .send({ "mobile":9876543210,
              "mobile_type":"mobile",  
              "lang":"en"
                         
                  })
              .set("Accept",'application/json',{"lang":"en"})
              .expect(400)
              .end(function(err,res){
                res.status.should.equal(400);
                res.body.should.have.property('mobile');
                res.body.should.have.property('mobile_type');
                res.body.should.have.property('lang');
    });
    done();
    });

})
