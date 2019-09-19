'use strict';
const express = require('express');
const chai = require('chai');  
const expect = require('chai').expect;
chai.use(require('chai-http'));
const app = require('../app');

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


describe('actionBillPaymentVerify', function() {
    it("actionBillPaymentVerify",function(done){
      request(app) 
      api
.post('/actionBillPaymentVerify')
.send({"transaction_id":"hm0jnr0f61l"
})
        .set({"Accept":'application/json',
        'access_token':'x0T5sE22eBWdD-CTIZsKBG-4b6tsZoSDqV5UCyd7igxWevfB3b_AaCT76PCfBKZ',
        'user_language':'en'
      })
        .expect(200)
        .end(function(err,res){
          res.status.should.equal(200);
          res.body.should.have.property('transaction_id');
        });
        done();
});
})

describe('actionBillPayment', function() {
    it("actionBillPayment",function(done){
      request(app) 
      api
.post('/actionBillPayment')
.send({
"name":"qasd",
"mobile":"9600192672",
"email":"asdf@gmail.com",
"amount":"1.00",
"consumer_key":"123",
"service_id":"1214",
"office_code":"23456",
"lookupId":"123",
"bill_type":"1",
"bill_carrier":"2"
})
        .set({"Accept":'application/json',
        'access_token':'x0T5sE22eBWdD-CTIZsKBG-4b6tsZoSDqV5UCyd7igxWevfB3b_AaCT76PCfBKZ',
        'user_language':'en'})
        .expect(200)
        .end(function(err,res){
          res.status.should.equal(200);
          res.body.should.have.property('name');
          res.body.should.have.property('mobile');
          res.body.should.have.property('amount');
          res.body.should.have.property('consumer_key');
          res.body.should.have.property('service_id');
          res.body.should.have.property('office_code');
          res.body.should.have.property('lookupId');
          res.body.should.have.property('bill_type');
          res.body.should.have.property('bill_carrier');
        });
        done();
});
})

describe('recentBillHistory', function() {
  it("recentBillHistory",function(done){
    request(app) 
    api
.get('/recentBillHistory')
      .set({"Accept":'application/json',
      'access_token':'x0T5sE22eBWdD-CTIZsKBG-4b6tsZoSDqV5UCyd7igxWevfB3b_AaCT76PCfBKZ',
      'user_language':'en'})
      .expect(200)
      .end(function(err,res){
        res.status.should.equal(200);
      });
      done();
});
})

describe('fetchUserDetail', function() {
  it("fetchUserDetail",function(done){
    request(app) 
    api
.post('/fetchUserDetail')
.send({
"serviceId":"1214",
"searchKey":"9600192672"
})
      .set({"Accept":'application/json',
      'access_token':'x0T5sE22eBWdD-CTIZsKBG-4b6tsZoSDqV5UCyd7igxWevfB3b_AaCT76PCfBKZ',
      'user_language':'en'})
      .expect(200)
      .end(function(err,res){
        res.status.should.equal(200);
        res.body.should.have.property('serviceId');
        res.body.should.have.property('searchKey');
      });
      done();
});
})