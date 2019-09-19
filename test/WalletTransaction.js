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
//wallettowallet
describe("wallettowallet", function(){
    it("Missing Input", function(done){
        request(app)
        api
        .post('/wallettowallet')
        .send({ "amount":"2",
                "tag_name":"",
                "beneficiary_mobile":"9768135452"        
              })
        .set('Accept','/application/json')
        .set('user_language','en')
        .set('access_token', 'a1b2c345678defgh')
        .expect(400)
        .end(function(err,res){
            
            expect(err).to.have.error.message('Missing Input');
         
        });
        done();
        });
   
    it("Transferred amount successfully", function(done){
        request(app)
        api
        .post('/wallettowallet')
        .send({ "amount":"2",
                "tag_name":"load",
                "beneficiary_mobile":"9768135452"     
                })
        .set('Accept','/application/json')
        .set('user_language','en')
        .set('access_token', 'a1b2c345678defgh')
        .expect(200)
        .end(function(err,res){
            res.hearder.should.have.property('user_language');
            res.hearder.should.have.property('access_token');
            res.body.should.have.property('amount');
            res.body.should.have.property('tag_name');
            res.body.should.have.property('beneficiary_mobile');
        });
        done();
        });
})
//wallettobank
