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

var api = request("http://"+TestIp.host+":4000");


//Add Beneficiary
describe("Add Beneficiary", function(){
    it("Missing Input", function(done){
        request(app)
        api
        .post('/addBeneficiary')
        .send({'beneficiary_name': 'Shesh',
                'identifier_type': 'mobile',
                'account_number': '8952070183',
                'ifsc_code': 'ABHY0065016',
                'mobile_no':'8585858585',
                'email': 'sheshnath.a@gmail.com'        
              })
        .set('Accept','/application/json')
        .expect(400)
        .end(function(err,res){
            
            expect(err).to.have.error.message('Missing Input');
         
        });
        done();
        });
    it("Failed to New Add Beneficiary", function(done){
        request(app)
        api
        .post('/addBeneficiary')
        .send({"beneficiary_name": "Shesh",
        "identifier_type": "mobile",
        "account_number": "8952070183",
        "ifsc_code": "ABHY0065016",
        "mobile_no":"8585858585",
        "email": "sheshnath.a@gmail.com"       
                })
        .set('Accept','/application/json')
        .set('user_language','en')
        .set('access_token', '4ca884dbb134158c:mQ8MfHMObF6CEmHjKqbn8sbtH6XDcX7Sx_rMgNOAH_E6dcUvRnSjwbrQoyelHgFN')
        .expect(400)
        .end(function(err,res){
            res.hearder.should.have.property('user_language');
            res.hearder.should.have.property('access_token');
            res.body.should.have.property('beneficiary_name');
            res.body.should.have.property('identifier_type');
            res.body.should.have.property('account_number');
            res.body.should.have.property('ifsc_code');
            res.body.should.have.property('mobile_no');
            res.body.should.have.property('email');
        });
        done();
        });
    it("Beneficiary added succesfully", function(done){
        request(app)
        api
        .post('/addBeneficiary')
        .send({"beneficiary_name": "Shesh",
        "identifier_type": "mobile",
        "account_number": "8952070183",
        "ifsc_code": "ABHY0065016",
        "mobile_no":"8585858585",
        "email": "sheshnath.a@gmail.com"       
                })
        .set('Accept','/application/json')
        .set('user_language','en')
        .set('access_token', '4ca884dbb134158c:mQ8MfHMObF6CEmHjKqbn8sbtH6XDcX7Sx_rMgNOAH_E6dcUvRnSjwbrQoyelHgFN')
        .expect(200)
        .end(function(err,res){
            res.hearder.should.have.property('user_language');
            res.hearder.should.have.property('access_token');
            res.body.should.have.property('beneficiary_name');
            res.body.should.have.property('identifier_type');
            res.body.should.have.property('account_number');
            res.body.should.have.property('ifsc_code');
            res.body.should.have.property('mobile_no');
            res.body.should.have.property('email');
        });
        done();
        });
})


//Fetch Beneficiary
describe("Fetch Beneficiary", function(){
    it("Missing Input", function(done){
        request(app)
        api
        .post('/fetchBeneficiary')
        .set('Accept','/application/json')
        .send({'beneficiary_id': '21201'})
        .expect(400)
        .end(function(err,res){
            expect(err).to.have.error.message('Missing Input');
            res.body.should.have.property('beneficiary_id');
        });
        done();
        });

    it("Fetch Beneficiary succesfully", function(done){
        request(app)
        api
        .post('/fetchBeneficiary')
        .set('Accept','/application/json')
        .set('user_language','en')
        .set('access_token', '4ca884dbb134158c:mQ8MfHMObF6CEmHjKqbn8sbtH6XDcX7Sx_rMgNOAH_E6dcUvRnSjwbrQoyelHgFN')
        .send({'beneficiary_id': '21201'      
                })
        .expect(200)
        .end(function(err,res){
            res.body.should.have.property('beneficiary_id');
        });
        done();
        });
})


//Delete Beneficiary
describe("Delete Beneficiary", function(){
    it("Missing Input", function(done){
        request(app)
        api
        .post('/deleteBeneficiary')
        .set('Accept','/application/json')
        .send({'beneficiary_id': '21201'        
              })
        .expect(400)
        .end(function(err,res){
            expect(err).to.have.error.message('Missing Input');
            res.body.should.have.property('beneficiary_id');
        });
        done();
        });

    it("Delete Beneficiary succesfully", function(done){
        request(app)
        api
        .post('/deleteBeneficiary')
        .set('Accept','/application/json')
        .set('user_language','en')
        .set('access_token', '4ca884dbb134158c:mQ8MfHMObF6CEmHjKqbn8sbtH6XDcX7Sx_rMgNOAH_E6dcUvRnSjwbrQoyelHgFN')
        .send({'beneficiary_id': '21201'      
                })
        .expect(200)
        .end(function(err,res){
            res.body.should.have.property('beneficiary_id');
        });
        done();
        });
})


//List Beneficiary
describe("List Beneficiary", function(){
    it("Missing Input", function(done){
        request(app)
        api
        .post('/listBeneficiary')
        .set('Accept','/application/json')
        .send({'beneficiary_type': 'mobile'       
              })
        .expect(400)
        .end(function(err,res){
            expect(err).to.have.error.message('Missing Input');
            res.body.should.have.property('beneficiary_type');
        });
        done();
        });

    it("List Beneficiary succesfully", function(done){
        request(app)
        api
        .post('/listBeneficiary')
        .set('Accept','/application/json')
        .set('user_language','en')
        .set('access_token', '4ca884dbb134158c:mQ8MfHMObF6CEmHjKqbn8sbtH6XDcX7Sx_rMgNOAH_E6dcUvRnSjwbrQoyelHgFN')
        .send({'beneficiary_type': 'mobile'      
                })
        .expect(200)
        .end(function(err,res){
            res.body.should.have.property('beneficiary_type');
        });
        done();
        });
})


//Add own bank account
describe("Add own bank account", function(){
    it("Missing Input", function(done){
        request(app)
        api
        .post('/addOwnBankAccount')
        .set('Accept','/application/json')
        .send({'account_no': '8437179922',
               'ifsc_code':'mobile'        
              })
        .expect(400)
        .end(function(err,res){
            expect(err).to.have.error.message('Missing Input');
            res.body.should.have.property('account_no');
            res.body.should.have.property('ifsc_code');
        });
        done();
        });

    it("Add own bank account succesfully", function(done){
        request(app)
        api
        .post('/addOwnBankAccount')
        .set('Accept','/application/json')
        .set('user_language','en')
        .set('access_token', '4ca884dbb134158c:mQ8MfHMObF6CEmHjKqbn8sbtH6XDcX7Sx_rMgNOAH_E6dcUvRnSjwbrQoyelHgFN')
        .send({'account_no': '8437179922',
               'ifsc_code':'mobile'      
                })
        .expect(200)
        .end(function(err,res){
            res.body.should.have.property('account_no');
            res.body.should.have.property('ifsc_code');
        });
        done();
        });
})


//Verify own bank account
describe("Verify own bank account", function(){
    it("Missing Input", function(done){
        request(app)
        api
        .post('/verifyOwnBankAccount')
        .set('Accept','/application/json')
        .send({'amount': '20'       
              })
        .expect(400)
        .end(function(err,res){
            expect(err).to.have.error.message('Missing Input');
            res.body.should.have.property('amount');
        });
        done();
        });

    it("Verify own bank account succesfully", function(done){
        request(app)
        api
        .post('/verifyOwnBankAccount')
        .set('Accept','/application/json')
        .set('user_language','en')
        .set('access_token', '4ca884dbb134158c:mQ8MfHMObF6CEmHjKqbn8sbtH6XDcX7Sx_rMgNOAH_E6dcUvRnSjwbrQoyelHgFN')
        .send({'amount': '20'      
              })
        .expect(200)
        .end(function(err,res){
            res.body.should.have.property('amount');
        });
        done();
        });
})


//Modify own bank account
describe("Modify own bank account", function(){
    it("Missing Input", function(done){
        request(app)
        api
        .post('/modifyOwnBankAccount')
        .set('Accept','/application/json')
        .send({'account_no': '843717992270',
               'ifsc_code':'mobile'         
              })
        .expect(400)
        .end(function(err,res){
            expect(err).to.have.error.message('Missing Input');
            res.body.should.have.property('account_no');
            res.body.should.have.property('ifsc_code');
        });
        done();
        });

    it("Modify own bank account succesfully", function(done){
        request(app)
        api
        .post('/modifyOwnBankAccount')
        .set('Accept','/application/json')
        .set('user_language','en')
        .set('access_token', '4ca884dbb134158c:mQ8MfHMObF6CEmHjKqbn8sbtH6XDcX7Sx_rMgNOAH_E6dcUvRnSjwbrQoyelHgFN')
        .send({'account_no': '843717992270',
               'ifsc_code':'mobile'       
                })
        .expect(200)
        .end(function(err,res){
            res.body.should.have.property('account_no');
            res.body.should.have.property('ifsc_code');
        });
        done();
        });
})