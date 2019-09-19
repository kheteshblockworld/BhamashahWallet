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


describe('Enrollment Details', function() {
    it("Enrollment Details available",function(done){
      request(app) 
      api
.post('/getenrollmentdetails')
.send({"BHAMASHAH_ACK_ID":"9999-NKUO-00209",
"AADHAR_ID":"123456789012",
"MOBILE_NO": ""
})
        .set("Accept",'application/json')
        .expect(200)
        .end(function(err,res){
        //  res.status.should.equal(200);
        //   res.body.should.have.property('Bhamashah ID');
        // res.body.should.have.property('Aadhar ID');
        // res.body.should.have.property('Mobile No.');

        // console.log("test");
        // var status = ErrorCode.SUCCESS_SA08
        // var message = ErrorMsg.SUCCESS_SA08
        // return res = {
        //   status, message
        // }
        // console.log('1')
        });
        done();
});

it("Enrollment Details available 2",function(done){
    request(app) 
    api
.post('/getenrollmentdetails')
.send({"BHAMASHAH_ACK_ID":"9999-NKUO-00209",
"AADHAR_ID":"",
"MOBILE_NO": "1234567890"
})
      .set("Accept",'application/json')
      .expect(200)
      .end(function(err,res){
      res.status.should.equal(200);
      //   res.body.should.have.property('Bhamashah ID');
      // res.body.should.have.property('Aadhar ID');
      // res.body.should.have.property('Mobile No.');


      // console.log("test");
      // var status = ErrorCode.SUCCESS_SA08
      // var message = ErrorMsg.SUCCESS_SA08
      // return res = {
      //   status, message
      // }
    //   console.log('2')
      });
      done();
});

it("Please enter your Bhamashah Ack ID to get Enrollment Details",function(done){
    request(app) 
    api
.post('/getenrollmentdetails')
.send({"BHAMASHAH_ACK_ID":"",
"AADHAR_ID":"123456789012",
"MOBILE_NO": "1234567890"
})
      .set("Accept",'application/json')
      .expect(400)
      .end(function(err,res){
      //   res.status.should.equal(401);
      //   res.body.should.have.property('Bhamashah ID');
      // res.body.should.have.property('Aadhar ID');
      // res.body.should.have.property('Mobile No.');


      // console.log("test");
      // var status = ErrorCode.SUCCESS_SA08
      // var message = ErrorMsg.SUCCESS_SA08
      // return res = {
      //   status, message
      // }
    //   console.log('3')
      });
      done();
});

it("Please enter your Mobile No. or Aadhar ID to get Enrollment Details",function(done){
    request(app) 
    api
.post('/getenrollmentdetails')
.send({"BHAMASHAH_ACK_ID":"9999-NKUO-00209",
"AADHAR_ID":"",
"MOBILE_NO": ""
})
      .set("Accept",'application/json')
      .expect(400)
      .end(function(err,res){
      //   res.status.should.equal(400);
      //   res.body.should.have.property('Bhamashah ID');
      // res.body.should.have.property('Aadhar ID');
      // res.body.should.have.property('Mobile No.');

      // console.log("test");
      // var status = ErrorCode.SUCCESS_SA08
      // var message = ErrorMsg.SUCCESS_SA08
      // return res = {
      //   status, message
      // }
    //   console.log('4')
      });
      done();
});

it("Please enter correct details",function(done){
    request(app) 
    api
.post('/getenrollmentdetails')
.send({"BHAMASHAH_ACK_ID":"9999-NKUO-00290",
"AADHAR_ID":"123456789012-",
"MOBILE_NO": "1234567890s"
})
      .set("Accept",'application/json')
      .expect(400)
      .end(function(err,res){
      //   res.status.should.equal(401);
      //   res.body.should.have.property('Bhamashah ID');
      // res.body.should.have.property('Aadhar ID');
      // res.body.should.have.property('Mobile No.');

      // console.log("test");
      // var status = ErrorCode.SUCCESS_SA08
      // var message = ErrorMsg.SUCCESS_SA08
      // return res = {
      //   status, message
      // }
    //   console.log('5')
      });
      done();
});

          });
