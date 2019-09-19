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



describe('RegisterAadhar', function() {
    it(" Registered successfully",function(done){
      request(app) 
      api
.post('/registeraadharkyc')
.send({  
"auth_token":"f94882b3-fbac-4af9-998c-5726f412d224",
"aadhar_no" : "886035523300",
})
        .set("Accept",'application/json')
        .set('user_language','hi')
        .set('access_token', '4ca884dbb134158c:mQ8MfHMObF6CEmHjKqbn8sbtH6XDcX7Sx_rMgNOAH_E6dcUvRnSjwbrQoyelHgFN')
        .expect(200)
        .end(function(err,res){
          res.status.should.equal(200);
          res.body.should.have.property('access_token');
        res.body.should.have.property('user_language');
        res.body.should.have.property('auth_token');
        res.body.should.have.property('aadhar_no'); 
        });
        done();
});

it("fields should not be empty during Registeraadhar",function(done){
request(app) 
api
.post('/registeraadharkyc')
          .send({  
          "auth_token":"f94882b3-fbac-4af9-998c-5726f412d224",
          "aadhar_no" : "886035523300"        
              })
          .set("Accept",'application/json')
          .set('user_language','hi')
            .set('access_token', '')
          .expect(401)
           .end(function(err,res){
        res.status.should.equal(401);
        res.body.should.have.property('access_token');
        res.body.should.have.property('user_language');
        res.body.should.have.property('auth_token');
        res.body.should.have.property('aadhar_no'); 
     
});
done();
});

it("Token required to pass the new users",function(done){
    request(app) 
    api
    .post('/registeraadharkyc')
              .send({   
          "auth_token":"",
          "aadhar_no" : "886035523300"
                  })
              .set("Accept",'application/json')
              .set('user_language','en')
            .set('access_token', '4ca884dbb134158c:mQ8MfHMObF6CEmHjKqbn8sbtH6XDcX7Sx_rMgNOAH_E6dcUvRnSjwbrQoyelHgFN')
              .expect(401)
              .end(function(err,res){
                res.status.should.equal(401);
                res.body.should.have.property('access_token');
                res.body.should.have.property('user_language');
                res.body.should.have.property('auth_token');
                res.body.should.have.property('aadhar_no');   
    });
    done();
    });

})