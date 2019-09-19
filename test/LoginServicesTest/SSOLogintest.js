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



describe('SSO Login', function() {
    it("SSO Login successful",function(done){
      request(app) 
      api
.post('/authenticateSSOID')
.send({"UserName":"goverdhansingh123",
"Password":"padawas@123",  
"Application":"Bhamashah",
"BhamashahID" : "ABCDEFG",
"BhamashahMID" : "ABCD123"
})
        .set("Accept",'application/json',{"lang":"en"})
        .expect(200)
        .end(function(err,res){
          res.status.should.equal(200);
          res.body.should.have.property('UserName');
        res.body.should.have.property('Password');
        res.body.should.have.property('Application');
        res.body.should.have.property('BhamashahID');
        res.body.should.have.property('BhamashahMID');
        // console.log("test");
        // var status = ErrorCode.SUCCESS_SA08
        // var message = ErrorMsg.SUCCESS_SA08
        // return res = {
        //   status, message
        // }
        
        });
        done();
});

it("fields should not be empty during SSO Login",function(done){
request(app) 
api
.post('/authenticateSSOID')
          .send({ "UserName":"goverdhansingh123",
          "Password":"" ,  
          "Application":"Bhamashah"  ,        
              })
          .set("Accept",'application/json',{"lang":"en"})
          .expect(401)
           .end(function(err,res){
            res.status.should.equal(401);
            res.body.should.have.property('UserName');
          res.body.should.have.property('Password');
          res.body.should.have.property('Application');
        res.body.should.have.property('BhamashahID');
        res.body.should.have.property('BhamashahMID');
        //   var status = ErrorCode.ERROR_EA01
        // var message = ErrorMsg.ERROR_EA01
        // return res = {
        //   status, message
        // }
});
done();
});

it("Cannot Login : Ivalid UserName or Password",function(done){
    request(app) 
    api
    .post('/authenticateSSOID')
              .send({ "UserName":"goverdhansingh123",
              "Password":"padawas@321" ,  
              "Application":"Bhamashah",
                         
                  })
              .set("Accept",'application/json',{"lang":"en"})
              .expect(401)
              .end(function(err,res){
                res.status.should.equal(401);
                res.body.should.have.property('UserName');
              res.body.should.have.property('Password');
              res.body.should.have.property('Application');
     
        //       var status = ErrorCode.ERROR_EA08
        // var message = ErrorMsg.ERROR_EA08
        // return res = {
        //   status, message
        // }
    });
    done();
    });

  it("Bhamahshah ID does not exists for the user",function(done){
    request(app) 
    api
    .post('/authenticateSSOID')
              .send({ "UserName":"goverdhansingh123",
              "Password":"padawas@123" ,  
              "Application":"Bhamashah",
              "BhamashahID" : "",
              "BhamashahMID" : "ABCD123"            
                  })
              .set("Accept",'application/json',{"lang":"en"})
              .expect(401)
              .end(function(err,res){
                res.status.should.equal(401);
                res.body.should.have.property('UserName');
              res.body.should.have.property('Password');
              res.body.should.have.property('Application');
        res.body.should.have.property('BhamashahID');
        res.body.should.have.property('BhamashahMID');
        //       var status = ErrorCode.ERROR_EA08
        // var message = ErrorMsg.ERROR_EA08
        // return res = {
        //   status, message
        // }
    });
    done();
    });
  
    it("Bhamahshah MID does not exists for the user",function(done){
      request(app) 
      api
      .post('/authenticateSSOID')
                .send({ "UserName":"goverdhansingh123",
                "Password":"padawas@123" ,  
                "Application":"Bhamashah",
                "BhamashahID" : "ABCDEFG",
                "BhamashahMID" : ""            
                    })
                .set("Accept",'application/json',{"lang":"en"})
                .expect(401)
                .end(function(err,res){
                res.status.should.equal(401);
                res.body.should.have.property('UserName');
                res.body.should.have.property('Password');
                res.body.should.have.property('Application');
                res.body.should.have.property('BhamashahID');
                res.body.should.have.property('BhamashahMID');
          //       var status = ErrorCode.ERROR_EA08
          // var message = ErrorMsg.ERROR_EA08
          // return res = {
          //   status, message
          // }
      });
      done();
      });

      it("Bhamahshah ID and MID does not exists for the user",function(done){
        request(app) 
        api
        .post('/authenticateSSOID')
                  .send({ "UserName":"goverdhansingh123",
                  "Password":"padawas@123" ,  
                  "Application":"Bhamashah",
                  "BhamashahID" : "",
                  "BhamashahMID" : ""            
                      })
                  .set("Accept",'application/json',{"lang":"en"})
                  .expect(401)
                  .end(function(err,res){
                    res.status.should.equal(401);
                    res.body.should.have.property('UserName');
                  res.body.should.have.property('Password');
                  res.body.should.have.property('Application');
                  res.body.should.have.property('BhamashahID');
                  res.body.should.have.property('BhamashahMID');
            //       var status = ErrorCode.ERROR_EA08
            // var message = ErrorMsg.ERROR_EA08
            // return res = {
            //   status, message
            // }
        });
        done();
        });
    })



