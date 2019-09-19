'use strict';

const Utils = require('../../util/utils');
var request = require('request');
var config = require('config');
var bhamashahservices = config.get('bhamashahservices')
exports.getDBTDetails = (lang, BHAMASHAH_ID, BHAMASHAH_ACK_ID,AADHAR_ID,MOBILE_NO, callback) =>{

var NILLDATA
var BHAMASHAH_ACK_ID = NILLDATA;
var is_Admin = true;
var familyid = BHAMASHAH_ID;
var AADHAR_ID = NILLDATA;
var MOBILE_NO = NILLDATA;

    var options = {
        url: bhamashahservices.getDBTDetails + is_Admin + '/' + familyid + '/' + BHAMASHAH_ACK_ID + '/' + AADHAR_ID + '/' + MOBILE_NO + bhamashahservices.client_id,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };
   
    request(options, function (err, res, body) {
        if (!body) {
            var getErrMsg = Utils.getErrorMessage(lang, "ERROR_EA00")
            var err = {
                'success': false,
                "status": 400,
                'error': {
                    'code': getErrMsg.code,
                    'message': getErrMsg.message,
                    'status_type': '',
                    'status_popupmessage_type': ''
                },
               };
               callback(err, ""); } 
               else {
         var getErrMsg = Utils.getErrorMessage(lang, "SUCCESS_SA00")
         var result = {
            'success': true,
            "status": 200,
            'error': {
                'code': getErrMsg.code,
                'message': getErrMsg.message,
                'data' : body,
                'status_type': '',
                'status_popupmessage_type': ''
            },
        };
        callback("", result); }
    });  
}