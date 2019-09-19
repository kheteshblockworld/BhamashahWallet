/**
@author: Harinishree
@Version: 1.0.2
@Date: 23/10/2018
@description: DOIT BlockChain project
**/
'use strict';
const express = require('express');
const chai = require('chai');  
const expect = require('chai').expect;
chai.use(require('chai-http'));
const app = require('../app');

const router = express.Router();
require('../routes')(router);
app.use('/', router);
var mlog=require('mocha-logger')
var empty = require('is-empty');
var assert = require('assert');
var should = require("should");

var sinon = require('sinon');
var http = require('http');
var request = require("supertest");

var config = require('config');
var TestIp = config.get('TestIp');

var api = request("http://"+TestIp.host+":3000")



/*
*test case for Registeraadhar
*/  
describe('Registeraadhar', function() {
    it("should registers aadhar detail",function(done){
      /**calling addBMI api */
      request(app) 
      api.post('/registeraadharkyc')
        .send({       
                "auth_token":"d3555539-f9f9-4c58-8387-1707524a2341",
                "aadhar_no":"886035523300"
              })
        .set("Accept",'application/json')
        .expect(req).to.have.header('access_token')
        .expect(req).to.have.header('user_language')
        .expect(200)
        .end(function(err,res){
          res.status.should.equal(200);
          res.body.should.have.property('auth_token');
          res.body.should.have.property('aadhar_no');
          res.body.data.should.equal(result.message);
      
        });
        done();
      });
      
    })
    