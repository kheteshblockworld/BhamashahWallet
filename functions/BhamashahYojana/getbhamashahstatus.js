'use strict';
const Utils = require('../../util/utils');
var request = require('request');
var config = require('config');
var bhamashahservices = config.get('bhamashahservices')
exports.getbhamashahstatus = (lang, BHAMASHAH_ACK_ID,AADHAR_ID,MOBILE_NO, callback) =>{
//  return new Promise((resolve, reject) =>{
    // var SSOID = BHAMASHAH_ACK_ID;
    // var WSUserName = AADHAR_ID;
    // var WSPassword = MOBILE_NO
    // var bhamashah = {
    //   'Status': "BhamashaStatus",
    //     }

    // var options = {
    //     host : 'https://api.sewadwaar.rajasthan.gov.in',
    //     path : '/app/live/Bhamashah/Staging/service/HOF/get/{value1}/{Bhamashah_id}/{value2}/{value3}/{value4}',
    //     client_id : '%3cclient_id%3e' , 
    //     method : 'GET'
    // }

    // var options = {
    //     host : 'http://ssotest.rajasthan.gov.in:8888/',
    //     path : '/SSOREST/GetUserDetailJSON/' + SSOID + '/' + WSUserName + '/' + WSPassword + '/',
    //     method : 'GET'
    // }
var NILLDATA
 AADHAR_ID = NILLDATA
 MOBILE_NO = NILLDATA
 var is_Admin = true;
 var flag = 0;
    // var host = 'http://ssotest.rajasthan.gov.in:8888/';
    //   var  path = '/SSOREST/GetUserDetailJSON/' + SSOID + '/' + WSUserName + '/' + WSPassword + '/';
    var options = {
        // url: 'https://apitest.sewadwaar.rajasthan.gov.in/app/live/Bhamashah/Staging/service/getBhamashahStatus/' + is_Admin + '/' + BHAMASHAH_ACK_ID + '/' + AADHAR_ID + '/' + MOBILE_NO + '/' + flag + '?client_id=a53c453f-8a56-4d60-90ef-cb41c035a1ca',
        url: bhamashahservices.getBhamashahStatus + is_Admin + '/' + BHAMASHAH_ACK_ID + '/' + AADHAR_ID+ '/' + MOBILE_NO + '/' + flag + bhamashahservices.client_id,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    // var bhamashah = {
    //   'Status': "BhamashaStatus",
    //     }

    // var options = {
    //     host : 'https://api.sewadwaar.rajasthan.gov.in',
    //     path : '/app/live/Bhamashah/Staging/service/HOF/get/{value1}/{Bhamashah_id}/{value2}/{value3}/{value4}',
    //     client_id : '%3cclient_id%3e' , 
    //     method : 'GET'
    // }

    // var options = {
    //     host : 'http://ssotest.rajasthan.gov.in:8888/',
    //     path : '/SSOREST/GetUserDetailJSON/' + SSOID + '/' + WSUserName + '/' + WSPassword + '/',
    //     method : 'GET'
    // }

    // var host = 'http://ssotest.rajasthan.gov.in:8888/';
    //   var  path = '/SSOREST/GetUserDetailJSON/' + SSOID + '/' + WSUserName + '/' + WSPassword + '/';
    // var options = {
    //     url: 'http://ssotest.rajasthan.gov.in:8888/SSOREST/GetUserDetailJSON'+'/'+ SSOID + '/' + WSUserName + '/' + WSPassword ,
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     }
    // };

    // var options = {
    //     url: "http://ssotest.rajasthan.gov.in:8888/SSOREST/GetUserDetailJSON/ ",
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     }
    // };
// console.log(bhamashah,"bhamashah")

        //    return resolve({
        //         "status" : 200,
        //         "message": options
        //     // })
        // }).catch(err => {
        //         reject({
        //             "status": 500,
        //             "message": 'Something went wrong please try again later!!'
        //         });
        //     });
        // });

        // request(options, function (err, res, body) {
        
        
        //     if (res.body.valid == true) {
        //         callback("", res.body);
        //     } else {
        //         callback(res.body, "");
        //     }
    
        // });
        request(options, function (err, res, body) {
            // console.log(body);

            // if (!body) 
            if (!body){
                var getErrMsg = Utils.getErrorMessage(lang, "ERROR_EA00")
                var error = {
                    'success': false,
                    "status": 400,
                    'error': {
                        'code': getErrMsg.code,
                        'message': getErrMsg.message,
                        'status_type': '',
                        'status_popupmessage_type': ''
                    },
                   };
                   callback(error, ""); } 
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
// )
//     };
//     // exports.readData = (key) => {
    //     return new Promise((resolve, reject) => {
    //         bcSdk.readData(key)
    //         .then(function (result) {
    //             return resolve({
    //                 "status": 200,
    //                 "data": result.response
    //             })
    //         }).catch(err => {
    //             reject({
    //                 "status": 500,
    //                 "message": 'Something went wrong please try again later!!'
    //             });
    //         });
    //     });
    // }