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



describe('change MPIN', function() {
    it("MPIN Changed Successfully",function(done){
      request(app) 
      api
.post('/changeMpin')
.send({"old_mpin":1234,
"new_mpin":5678,  
"confirm_mpin":5678
})
        .set("Accept",'application/json',{"access_token":"x0T5sE22eBWdD-CTIZsKBG-4b6tsZoSDqV5UCyd7igxWevfB3b_AaCT76PCfBKZ","lang":"en"})
        .expect(200)
        .end(function(err,res){
          res.status.should.equal(200);
          res.body.should.have.property('old_mpin');
        res.body.should.have.property('new_mpin');
        res.body.should.have.property('confirm_mpin');
     
        
        });
        done();
});

it("fields should not be empty ",function(done){
request(app) 
api
.post('/changeMpin')
          .send({"old_mpin":1234,
          "new_mpin":5678,  
          "confirm_mpin":5678
              })
          .set("Accept",'application/json',{"access_token":"x0T5sE22eBWdD-CTIZsKBG-4b6tsZoSDqV5UCyd7igxWevfB3b_AaCT76PCfBKZ","lang":"en"})
          .expect(401)
           .end(function(err,res){
            res.status.should.equal(401);
            res.body.should.have.property('old_mpin');
          res.body.should.have.property('new_mpin');
          res.body.should.have.property('confirm_mpin');
     
});
done();
});

it("Invalid current MPIN",function(done){
    request(app) 
    api
    .post('/changeMpin')
              .send({ "old_mpin":1234,
              "new_mpin":5678,  
              "confirm_mpin":5678
                         
                  })
              .set("Accept",'application/json',{"access_token":"x0T5sE22eBWdD-CTIZsKBG-4b6tsZoSDqV5UCyd7igxWevfB3b_AaCT76PCfBKZ","lang":"en"})
              .expect(400)
              .end(function(err,res){
                res.status.should.equal(400);
                res.body.should.have.property('old_mpin');
                res.body.should.have.property('new_mpin');
                res.body.should.have.property('confirm_mpin');
    });
    done();
    });
    it("New and Confirm MPIN mismatched",function(done){
        request(app) 
        api
        .post('/changeMpin')
                  .send({ "old_mpin":1234,
                  "new_mpin":5678,  
                  "confirm_mpin":5678
                             
                      })
                  .set("Accept",'application/json',{"access_token":"x0T5sE22eBWdD-CTIZsKBG-4b6tsZoSDqV5UCyd7igxWevfB3b_AaCT76PCfBKZ","lang":"en"})
                  .expect(400)
                  .end(function(err,res){
                    res.status.should.equal(400);
                    res.body.should.have.property('old_mpin');
                    res.body.should.have.property('new_mpin');
                    res.body.should.have.property('confirm_mpin');
        });
        done();
        });

})
