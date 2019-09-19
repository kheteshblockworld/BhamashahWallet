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

//Create request
describe('Create Request for money', function (){
    it("Request header not present", function(done){
        request(app) 
        api
        .post('/requestMoneyCreate')
        .set('Accept','/application/json')
        .send({'recipient_mobile':'8952070183',
               'amount':'20',
                'remark':'testing'
              })
        .expect(400)
        .end(function(err,res){
            expect(err).to.have.error.message('Request header not present');
            res.body.should.have.property('recipient_mobile');
            res.body.should.have.property('amount');
            res.body.should.have.property('remark');

        });
        done();
        });

    it("Missing input", function(done){
        request(app)
        api
        .post('/requestMoneyCreate')
        .set('Accept','/application/json')
        .set('access_token', '4ca884dbb134158c:mQ8MfHMObF6CEmHjKqbn8sbtH6XDcX7Sx_rMgNOAH_E6dcUvRnSjwbrQoyelHgFN')
        .set('user_language','en')
        .send({'recipient_mobile':'8952070183',
               'amount':'20',
                'remark':''
              })
        .expect(400)
        .end(function(err,res){
        });
        done();
        });

    it("Invalid User", function(done){
        request(app)
        api
        .post('/requestMoneyCreate')
        .set('Accept','/application/json')
        .set('user_language','en')
        .set('access_token', 'ca884dbb134158c:mQ8MfHMObF6CEmHjKqbn8sbtH6XDcX7Sx_rMgNOAH_E6dcUvRnSjwbrQoyelHgFN')
        .send({'recipient_mobile':'8952070183',
                'amount':'20',
                'remark':'testing'
                })
        .expect(400)
        .end(function(err,res){
        });
        done();
        });

    it("Your Request has been sent", function(done){
    request(app)
    api
    .post('/requestMoneyCreate')
    .set('Accept','/application/json')
    .set('user_language','en')
    .set('access_token', 'ca884dbb134158c:mQ8MfHMObF6CEmHjKqbn8sbtH6XDcX7Sx_rMgNOAH_E6dcUvRnSjwbrQoyelHgFN')
    .send({'recipient_mobile':'8952070183',
            'amount':'20',
            'remark':'testing'
            })
    .expect(200)
    .end(function(err,res){
    });
    done();
    });
})


//Delete request
describe('Delete request for money', function (){
    it("Request header not present", function(done){
        request(app) 
        api
        .post('/requestMoneyDelete')
        .set('Accept','/application/json')
        .send({
            'recipient_id': ''
        })
        .expect(400)
        .end(function(err,res){
            expect(err).to.have.error.message('Request header not present');
        });
        done();
        });

    it("Missing input", function(done){
        request(app) 
        api
        .post('/requestMoneyDelete')
        .set('Accept','/application/json')
        .set('user_language','en')
        .set('access_token', '43e3c8a8c82eb438:d5MII1qcYimLcc3VquC_W0xzcrX8EcRecSq7YytdOkwsR1aSX1Nve-Mzw0ub9zDW')
        .send({
            'recipient_id': ''
        })
        .expect(400)
        .end(function(err,res){
            res.body.should.have.property('recipient_id');
        });
        done();
        });

    it("Request deleted successfully", function(done){
        request(app) 
        api
        .post('/requestMoneyDelete')
        .set('user_language','en')
        .set('access_token', '43e3c8a8c82eb438:d5MII1qcYimLcc3VquC_W0xzcrX8EcRecSq7YytdOkwsR1aSX1Nve-Mzw0ub9zDW')
        .set('Accept','/application/json')
        .send({
            'recipient_id': '1'
        })
        .expect(200)
        .end(function(err,res){
            res.body.should.have.property('recipient_id');
        });
        done();
        });
})

//Remind request
describe('Request reminder', function (){
    it("Request header not present", function(done){
        request(app) 
        api
        .post('/requestMoneyReminder')
        .set('Accept','/application/json')
        .send({
            'recipient_id' : '8'
        })
        .expect(400)
        .end(function(err,res){
            res.body.should.have.property('recipient_id');
        });
        done();
        });

    it("Missing input", function(done){
        request(app) 
        api
        .post('/requestMoneyReminder')
        .set('user_language','en')
        .set('access_token', 'd17ade533dee4945:sHnWR1nh0PVjQcBmzfr4EP5iTgHwyTCkB2XnyqqKHjSCSd9WNhXXZsbz9QMdXnJq')
        .set('Accept','/application/json')
        .send({
            'recipient_id': ''
        })
        .expect(400)
        .end(function(err,res){
            res.body.should.have.property('recipient_id');
        });
        done();
        });

    it("Sent a reminder successfully", function(done){
        request(app) 
        api
        .post('/requestMoneyReminder')
        .set('user_language','en')
        .set('access_token', 'd17ade533dee4945:sHnWR1nh0PVjQcBmzfr4EP5iTgHwyTCkB2XnyqqKHjSCSd9WNhXXZsbz9QMdXnJq')
        .set('Accept','/application/json')
        .send({
            'recipient_id': '1'
        })
        .expect(200)
        .end(function(err,res){
            res.body.should.have.property('recipient_id');
        });
        done();
        });
})


//Recieve a request
describe('Recieve a request', function (){
    it("Request header not present", function(done){
        request(app) 
        api
        .get('/requestMoneyRecieved')
        .set('Accept','/application/json')
        .expect(400)
        .end(function(err,res){
            res.body.should.have.property('recipient_id');
        });
        done();
        });

    it("Sent a recieve request successfully", function(done){
        request(app) 
        api
        .get('/requestMoneyRecieved')
        .set('user_language','en')
        .set('access_token', 'd17ade533dee4945:sHnWR1nh0PVjQcBmzfr4EP5iTgHwyTCkB2XnyqqKHjSCSd9WNhXXZsbz9QMdXnJq')
        .set('Accept','/application/json')
        .expect(200)
        .end(function(err,res){
        });
        done();
        });
})



//Sent a request
describe('Sent a request', function (){
    it("Request header not present", function(done){
        request(app) 
        api
        .get('/requestMoneySent')
        .set('Accept','/application/json')
        .expect(400)
        .end(function(err,res){

        });
        done();
        });

    it("Request sent successfully", function(done){
        request(app) 
        api
        .get('/requestMoneySent')
        .set('user_language','en')
        .set('access_token', '43e3c8a8c82eb438:d5MII1qcYimLcc3VquC_W0xzcrX8EcRecSq7YytdOkwsR1aSX1Nve-Mzw0ub9zDW43e3c8a8c82eb438:d5MII1qcYimLcc3VquC_W0xzcrX8EcRecSq7YytdOkwsR1aSX1Nve-Mzw0ub9zDW')
        .set('Accept','/application/json')
        .expect(200)
        .end(function(err,res){
        });
        done();
        });
})


