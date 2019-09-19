'use strict';

const Utils = require('../../util/utils');
var request = require('request');
var config = require('config');
var bhamashahservices = config.get('bhamashahservices')
exports.getEnrollmentDetails = (lang, BHAMASHAH_ACK_ID,AADHAR_ID,MOBILE_NO, callback) =>{
//  return new Promise((resolve, reject) =>{
//     console.log("entering")

// var EnrollmentDetails = {
//     "BHAMASHAHID": "VKWPJJP",
//     "PATIENT_NAME": "Himmat Singh",
//     "MEMBER_ID": "7928196",
//     "DATE_OF_BIRTH": "01/01/1999",
//     "GENDER": "Male",
//     "AADHAR_NO": "",
//     "PHOTO": "null",
//     "MOBILE_NUMBER": "",
//     "EMAIL": "",
//     "ADDRESS": "",
//     "ACK_ID": "2034-G0TU-16491",
//     "FATHERS_NAME_ENGLISH": "Gordhan Singh",
//     "MOTHERS_NAME_ENGLISH": "Om Kanwar Rajput",
//     "SPOUSE_NAME_ENGLISH": "",
//     "PAN_NO": "",
//     "BLOOD_GROUP": "",
//      "DISABILITY_STATUS": "",
//      "DISABILITY_TYPE": "",
//    "SSO_ID": "",
//    "BMID": "VKWPJJP_7928196_",
//    "EHRID": "VKWPJJP_jm9bvzik"
//         }
// // console.log(bhamashah,"bhamashah")
//            return resolve({
//                 "status" : 200,
//                 "message": EnrollmentDetails
//             // })
//         }).catch(err => {
//                 reject({
//                     "status": 500,
//                     "message": 'Something went wrong please try again later!!'
//                 });
//             });
//         });
//     }

// if(AADHAR_ID = null) {
//     AADHAR_ID = NILLDATA
// }

// if(MOBILE_NO = null) {
//     AADHAR_ID = NILLDATA
// }
var NILLDATA
var is_Admin = true;
var familyid = NILLDATA;
var AADHAR_ID = NILLDATA;
var MOBILE_NO = NILLDATA;
//  var flag = 0;
    // var host = 'http://ssotest.rajasthan.gov.in:8888/';
    //   var  path = '/SSOREST/GetUserDetailJSON/' + SSOID + '/' + WSUserName + '/' + WSPassword + '/';
    var options = {
        url: bhamashahservices.getEnrollmentDetails + is_Admin + '/' + familyid + '/' + BHAMASHAH_ACK_ID + '/' + AADHAR_ID + '/' + MOBILE_NO + bhamashahservices.client_id,
        // url: bhamashahservices.GetEnrollmentDetails,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    // https://apitest.sewadwaar.rajasthan.gov.in/app/live/Bhamashah/Staging/service/HOF/get/true/NILLDATA/1067-DOLD-29187/NILLDATA/NILLDATA?client_id=9b84ae62-32eb-476f-b7b9-cb0b7b7105ed
    request(options, function (err, res, body) {
        // console.log(body);
// console.log(err)
// console.log(res.body)
// console.log(body)
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