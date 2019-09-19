'use strict';
const getBhamashahStatus = require('../functions/BhamashahYojana/getbhamashahstatus');
const getEnrollmentDetails = require('../functions/BhamashahYojana/getEnrollmentDetails');
const getDBTDetails = require('../functions/BhamashahYojana/getDBTDetails');
var validator = require('validator');
var Utils = require('../util/utils');

module.exports = {
    bhamashahstatusValidation : bhamashahstatusValidation,
    enrollmentValidation: enrollmentValidation,
    getDBTvalidation : getDBTvalidation
}

function bhamashahstatusValidation(req, callback) {
    
  const BHAMASHAH_ACK_ID = req.body.BHAMASHAH_ACK_ID; 
    // console.log("nererer",req.body.VAR1)
    // const BHAMASHAH_ACK_ID = req.body.BHAMASHAH_ACK_ID;
  var AADHAR_ID = req.body.AADHAR_ID;
  var MOBILE_NO = req.body.MOBILE_NO;
  const ACK_ID1 = BHAMASHAH_ACK_ID.substring(0,4);
  const ACK_ID2 = BHAMASHAH_ACK_ID.substring(4,5);
  const ACK_ID3 = BHAMASHAH_ACK_ID.substring(5,9);
  const ACK_ID4 = BHAMASHAH_ACK_ID.substring(9,10);
  const ACK_ID5 = BHAMASHAH_ACK_ID.substring(10);
  const h_lang = req.headers.user_language;
  if(h_lang=="en" || h_lang=="hi"){
    var lang = h_lang;
   }else{
       var lang = ""; 
   }
   
  // if(!((BHAMASHAH_ACK_ID && BHAMASHAH_ACK_ID.trim() && validator.isNumeric(ACK_ID1) && 
  //  validator.isLength(ACK_ID1, {min:4 , max: 4}) && validator.isAlphanumeric(ACK_ID3) && validator.isLength(ACK_ID3, {min:4 , max: 4}) && 
  //  validator.isUppercase(ACK_ID3) && validator.isNumeric(ACK_ID5) && validator.matches(ACK_ID2, '-') && 
  //  validator.matches(ACK_ID4, '-') && validator.isLength(ACK_ID5, {min:5 , max: 5})) && (((AADHAR_ID && AADHAR_ID.trim()) && validator.isNumeric(AADHAR_ID) && 
  //  validator.isLength(AADHAR_ID, {min:12 , max: 12})) || ((MOBILE_NO && MOBILE_NO.trim() && validator.isNumeric(MOBILE_NO) && 
  //  validator.isLength(MOBILE_NO, {min:10 , max: 10})))))) {

  
    if(!((BHAMASHAH_ACK_ID && BHAMASHAH_ACK_ID.trim() && validator.isNumeric(ACK_ID1) && 
    validator.isLength(ACK_ID1, {min:4 , max: 4}) && validator.isAlphanumeric(ACK_ID3) && validator.isLength(ACK_ID3, {min:4 , max: 4}) && 
    validator.isUppercase(ACK_ID3) && validator.isNumeric(ACK_ID5) && validator.matches(ACK_ID2, '-') && 
    validator.matches(ACK_ID4, '-') && validator.isLength(ACK_ID5, {min:5 , max: 5})))) {
   var getErrMsg = Utils.getErrorMessage(lang, "ERROR_EA25")
   var error = {
       'success': false,
       "status": 400,
       'error': {
          //  'code': 400,
          //  'message': 'Please check Bhamashah Ack ID',
           'code': getErrMsg.code,
           'message': getErrMsg.message,
           'status_type': '',
           'status_popupmessage_type': ''
       },
      };
   callback(error, "");
   }
   else if(!(((AADHAR_ID && AADHAR_ID.trim()) && validator.isNumeric(AADHAR_ID) && 
   validator.isLength(AADHAR_ID, {min:12 , max: 12})) || ((MOBILE_NO && MOBILE_NO.trim() && validator.isNumeric(MOBILE_NO) && 
   validator.isLength(MOBILE_NO, {min:10 , max: 10}))))) { 
  var getErrMsg = Utils.getErrorMessage(lang, "ERROR_EA26")
   var error = {
       'success': false,
       "status": 400,
       'error': {
          //  'code': 400,
          //  'message': 'Please check Aadhar ID or Mobile No.',
           'code': getErrMsg.code,
           'message': getErrMsg.message,
           'status_type': '',
           'status_popupmessage_type': ''
       },
      };
   callback(error, "");}
   else {
      getBhamashahStatus.getbhamashahstatus(lang, BHAMASHAH_ACK_ID, AADHAR_ID, MOBILE_NO, function ( error, result ) { 
          console.log(result)
            if (error) {
              callback(error, "")
            } else {
             callback("", result)
            }
          }); 
        }
}


 // var params= req.body;///////
  //  if ( !BHAMASHAH_ID || !BHAMASHAH_ID.trim() )
  
  // if (!BHAMASHAH_ACK_ID || !BHAMASHAH_ACK_ID.trim() || !validator.isNumeric(ACK_ID1) || 
  //  !validator.isLength(ACK_ID1, {min:4 , max: 4}) || !validator.isAlphanumeric(ACK_ID3) || !validator.isLength(ACK_ID3, {min:4 , max: 4}) || 
  //  !validator.isUppercase(ACK_ID3) || !validator.isNumeric(ACK_ID5) || !validator.matches(ACK_ID2, '-') || 
  //  !validator.matches(ACK_ID4, '-') || !validator.matches(ACK_ID4, '-') || !validator.isLength(ACK_ID5, {min:5 , max: 5})) {
  // if (!BHAMASHAH_ID || !BHAMASHAH_ID.trim() || !validator.isUppercase(BHAMASHAH_ID) || !validator.isAlpha(BHAMASHAH_ID) ||
  //  !validator.isLength(BHAMASHAH_ID, {min:7 , max: 7})) 
  
  // var params= req.body;

  // if (!BHAMASHAH_ID || !BHAMASHAH_ID.trim() || !validator.isUppercase(BHAMASHAH_ID) || !validator.isAlpha(BHAMASHAH_ID) ||
  //  !validator.isLength(BHAMASHAH_ID, {min:7 , max: 7})) 
   
  //  if ( !BHAMASHAH_ID || !BHAMASHAH_ID.trim() )
  // if (!BHAMASHAH_ACK_ID || !BHAMASHAH_ACK_ID.trim() || !validator.isNumeric(ACK_ID1) || 
  // !validator.isLength(ACK_ID1, {min:4 , max: 4}) || !validator.isAlphanumeric(ACK_ID3) || !validator.isLength(ACK_ID3, {min:4 , max: 4}) || 
  // !validator.isUppercase(ACK_ID3) || !validator.isNumeric(ACK_ID5) || !validator.matches(ACK_ID2, '-') || 
  // !validator.matches(ACK_ID4, '-') || !validator.matches(ACK_ID4, '-') || !validator.isLength(ACK_ID5, {min:5 , max: 5})) {
//  if (!BHAMASHAH_ID || !BHAMASHAH_ID.trim() || !validator.isUppercase(BHAMASHAH_ID) || !validator.isAlpha(BHAMASHAH_ID) ||
//   !validator.isLength(BHAMASHAH_ID, {min:7 , max: 7})) 
// if ((!BHAMASHAH_ACK_ID || !BHAMASHAH_ACK_ID.trim() || !validator.isNumeric(ACK_ID1) || 
//   !validator.isLength(ACK_ID1, {min:4 , max: 4}) || !validator.isAlphanumeric(ACK_ID3) || 
//   !validator.isLength(ACK_ID3, {min:4 , max: 4}) || !validator.isUppercase(ACK_ID3) || 
//   !validator.isNumeric(ACK_ID5) || !validator.matches(ACK_ID2, '-') || 
//   !validator.matches(ACK_ID4, '-') || !validator.matches(ACK_ID4, '-') || 
//   !validator.isLength(ACK_ID5, {min:5 , max: 5})) || (!AADHAR_ID || !MOBILE_NO.trim() || 
//   !validator.isNumeric(MOBILE_NO) || !validator.isLength(MOBILE_NO, {min:10 , max: 10})) || (!AADHAR_ID && !MOBILE_NO || !AADHAR_ID.trim() || 
//   !MOBILE_NO.trim() || !validator.isNumeric(AADHAR_ID) || !validator.isLength(AADHAR_ID, {min:12 , max: 12}) 
//   || !validator.isNumeric(MOBILE_NO) || !validator.isLength(MOBILE_NO, {min:10 , max: 10}))) {
//    var err = {
//         "status": 400,
//         "message": 'Check your Input enteries'
//     }
//     callback(err, "");
//   }

  // if ((!BHAMASHAH_ACK_ID || !BHAMASHAH_ACK_ID.trim() || !validator.isNumeric(ACK_ID1) || 
  // !validator.isLength(ACK_ID1, {min:4 , max: 4}) || !validator.isAlphanumeric(ACK_ID3) || 
  // !validator.isLength(ACK_ID3, {min:4 , max: 4}) || !validator.isUppercase(ACK_ID3) || 
  // !validator.isNumeric(ACK_ID5) || !validator.matches(ACK_ID2, '-') || 
  // !validator.matches(ACK_ID4, '-') || !validator.matches(ACK_ID4, '-') || 
  // !validator.isLength(ACK_ID5, {min:5 , max: 5})) || (!AADHAR_ID && !MOBILE_NO || !AADHAR_ID.trim() || !MOBILE_NO.trim() || !validator.isNumeric(AADHAR_ID) || 
  // !validator.isLength(AADHAR_ID, {min:12 , max: 12}) || !validator.isNumeric(MOBILE_NO) || 
  // !validator.isLength(MOBILE_NO, {min:10 , max: 10}))) {
  //   var err = {
  //        "status": 400,
  //        "message": 'Check your Input enteries'
  //    }
  //    callback(err, "");
  //  }

  // if (!AADHAR_ID && !MOBILE_NO || !AADHAR_ID.trim() || !MOBILE_NO.trim() || !validator.isNumeric(AADHAR_ID) || 
  //   !validator.isLength(AADHAR_ID, {min:12 , max: 12}) || !validator.isNumeric(MOBILE_NO) || 
  //   !validator.isLength(MOBILE_NO, {min:10 , max: 10}))
  //  {
  //  if (!AADHAR_ID && !MOBILE_NO || !AADHAR_ID.trim() || !MOBILE_NO.trim() || !validator.isNumeric(AADHAR_ID) || 
  //   !validator.isLength(AADHAR_ID, {min:12 , max: 12}) || !validator.isNumeric(MOBILE_NO) || 
  //   !validator.isLength(MOBILE_NO, {min:10 , max: 10})) 
    
    // if ( !AADHAR_ID && !MOBILE_NO || !AADHAR_ID.trim() || !MOBILE_NO.trim()) 
// if(MOBILE_NO = null) {
//   if (!AADHAR_ID || !AADHAR_ID.trim()  || !validator.isNumeric(AADHAR_ID) || 
//     !validator.isLength(AADHAR_ID, {min:12 , max: 12})){
//       err = {
//       "status": 400,
//       "message": 'Enter Aadhar ID or Mobile No'
//   }
//   callback(err, ""); 
// }
// }

// else if (AADHAR_ID = null){
//   if (!MOBILE_NO || !MOBILE_NO.trim() || !validator.isNumeric(MOBILE_NO) || 
//   !validator.isLength(MOBILE_NO, {min:10 , max: 10})){
//     err = {
//     "status": 400,
//     "message": 'Enter Aadhar ID or Mobile No'
// }
// callback(err, ""); 
// }
// }

// else(!AADHAR_ID && !MOBILE_NO || !AADHAR_ID.trim() || !MOBILE_NO.trim() || !validator.isNumeric(AADHAR_ID) || 
//     !validator.isLength(AADHAR_ID, {min:12 , max: 12}) || !validator.isNumeric(MOBILE_NO) || 
//     !validator.isLength(MOBILE_NO, {min:10 , max: 10})){
//         err = {
//         "status": 400,
//         "message": 'Enter Aadhar ID or Mobile No'
//     }
//     callback(err, ""); 
// }

function enrollmentValidation(req, callback) {
    
  // const BHAMASHAH_ID = req.body.BHAMASHAH_ID; 
  const BHAMASHAH_ACK_ID = req.body.BHAMASHAH_ACK_ID;
  var AADHAR_ID = req.body.AADHAR_ID;
  var MOBILE_NO = req.body.MOBILE_NO;
  const ACK_ID1 = BHAMASHAH_ACK_ID.substring(0,4);
  const ACK_ID2 = BHAMASHAH_ACK_ID.substring(4,5);
  const ACK_ID3 = BHAMASHAH_ACK_ID.substring(5,9);
  const ACK_ID4 = BHAMASHAH_ACK_ID.substring(9,10);
  const ACK_ID5 = BHAMASHAH_ACK_ID.substring(10);
  const h_lang = req.headers.user_language;
  if(h_lang=="en" || h_lang=="hi"){
    var lang = h_lang;
   }else{
       var lang = ""; 
   }

//   if(!((BHAMASHAH_ACK_ID && BHAMASHAH_ACK_ID.trim() && validator.isNumeric(ACK_ID1) && 
//   validator.isLength(ACK_ID1, {min:4 , max: 4}) && validator.isAlphanumeric(ACK_ID3) && validator.isLength(ACK_ID3, {min:4 , max: 4}) && 
//   validator.isUppercase(ACK_ID3) && validator.isNumeric(ACK_ID5) && validator.matches(ACK_ID2, '-') && 
//   validator.matches(ACK_ID4, '-') && validator.isLength(ACK_ID5, {min:5 , max: 5})) && (((AADHAR_ID && AADHAR_ID.trim()) && validator.isNumeric(AADHAR_ID) && 
//   validator.isLength(AADHAR_ID, {min:12 , max: 12})) || ((MOBILE_NO && MOBILE_NO.trim() && validator.isNumeric(MOBILE_NO) && 
//   validator.isLength(MOBILE_NO, {min:10 , max: 10})))))) {
//   var getErrMsg = Utils.getErrorMessage(lang, "ERROR_EA24")
//  var error = {
//   'success': false,
//   "status": 400,
//   'error': {
//      //  'code': 400,
//      //  'message': 'Please check input parameters',
//       'code': getErrMsg.code,
//       'message': getErrMsg.message,
//       'status_type': '',
//       'status_popupmessage_type': ''
//   },
//  };
//  callback(error, "");
// }


//   if (!BHAMASHAH_ID || !BHAMASHAH_ID.trim() || !BHAMASHAH_ACK_ID || !BHAMASHAH_ACK_ID.trim() || 
//    !validator.isUppercase(BHAMASHAH_ID) || !validator.isAlpha(BHAMASHAH_ID) ||
//    !validator.isLength(BHAMASHAH_ID, {min:7 , max: 7}) || !validator.isNumeric(ACK_ID1) || 
//    !validator.isLength(ACK_ID1, {min:4 , max: 4}) || !validator.isAlpha(ACK_ID3) || !validator.isLength(ACK_ID3, {min:4 , max: 4}) || 
//    !validator.isUppercase(ACK_ID3) || !validator.isNumeric(ACK_ID5) || !validator.matches(ACK_ID2, '-') || 
//    !validator.matches(ACK_ID4, '-') || !validator.matches(ACK_ID4, '-') || !validator.isLength(ACK_ID5, {min:5 , max: 5})) {
//    var err = {
//         "status": 400,
//         "message": 'Please Check your Bhamashah ID or Bhamashah Ack ID'
//    }
//     callback(err, "");
// }
//    if (!AADHAR_ID && !MOBILE_NO || !AADHAR_ID.trim() || !MOBILE_NO.trim() || !validator.isNumeric(AADHAR_ID) || 
//     !validator.isLength(AADHAR_ID, {min:12 , max: 12}) || !validator.isNumeric(MOBILE_NO) || 
//     !validator.isLength(MOBILE_NO, {min:10 , max: 10}))  {
//       var err = {
//         "status": 400,
//         "message": 'Please check your Aadhar ID or Mobile No'
//     }
//     callback(err, ""); 
//     }
if(!((BHAMASHAH_ACK_ID && BHAMASHAH_ACK_ID.trim() && validator.isNumeric(ACK_ID1) && 
    validator.isLength(ACK_ID1, {min:4 , max: 4}) && validator.isAlphanumeric(ACK_ID3) && validator.isLength(ACK_ID3, {min:4 , max: 4}) && 
    validator.isUppercase(ACK_ID3) && validator.isNumeric(ACK_ID5) && validator.matches(ACK_ID2, '-') && 
    validator.matches(ACK_ID4, '-') && validator.isLength(ACK_ID5, {min:5 , max: 5})))) {
   var getErrMsg = Utils.getErrorMessage(lang, "ERROR_EA25")
   var error = {
       'success': false,
       "status": 400,
       'error': {
          //  'code': 400,
          //  'message': 'Please check Bhamashah Ack ID',
           'code': getErrMsg.code,
           'message': getErrMsg.message,
           'status_type': '',
           'status_popupmessage_type': ''
       },
      };
   callback(error, "");
   }
   else if(!(((AADHAR_ID && AADHAR_ID.trim()) && validator.isNumeric(AADHAR_ID) && 
   validator.isLength(AADHAR_ID, {min:12 , max: 12})) || ((MOBILE_NO && MOBILE_NO.trim() && validator.isNumeric(MOBILE_NO) && 
   validator.isLength(MOBILE_NO, {min:10 , max: 10}))))) { 
  var getErrMsg = Utils.getErrorMessage(lang, "ERROR_EA26")
   var error = {
       'success': false,
       "status": 400,
       'error': {
          //  'code': 400,
          //  'message': 'Please check Aadhar ID or Mobile No.',
           'code': getErrMsg.code,
           'message': getErrMsg.message,
           'status_type': '',
           'status_popupmessage_type': ''
       },
      };
   callback(error, "");}
else {
      getEnrollmentDetails.getEnrollmentDetails(lang, BHAMASHAH_ACK_ID, AADHAR_ID, MOBILE_NO, function( error, result) {
          console.log(result)
          if (error) {
            callback(error, "")
          } else {
           callback("", result)
          }
        }); 
      }
}


function getDBTvalidation(req, callback) {
  const BHAMASHAH_ID = req.body.BHAMASHAH_ID;
  var BHAMASHAH_ACK_ID = req.body.BHAMASHAH_ACK_ID; 
    // console.log("nererer",req.body.VAR1)
    // const BHAMASHAH_ACK_ID = req.body.BHAMASHAH_ACK_ID;
  var AADHAR_ID = req.body.AADHAR_ID;
  var MOBILE_NO = req.body.MOBILE_NO;
  const ACK_ID1 = BHAMASHAH_ACK_ID.substring(0,4);
  const ACK_ID2 = BHAMASHAH_ACK_ID.substring(4,5);
  const ACK_ID3 = BHAMASHAH_ACK_ID.substring(5,9);
  const ACK_ID4 = BHAMASHAH_ACK_ID.substring(9,10);
  const ACK_ID5 = BHAMASHAH_ACK_ID.substring(10);
  const h_lang = req.headers.user_language;
  if(h_lang=="en" || h_lang=="hi"){
    var lang = h_lang;
   }else{
       var lang = ""; 
   }
   
  // if(!((BHAMASHAH_ACK_ID && BHAMASHAH_ACK_ID.trim() && validator.isNumeric(ACK_ID1) && 
  //  validator.isLength(ACK_ID1, {min:4 , max: 4}) && validator.isAlphanumeric(ACK_ID3) && validator.isLength(ACK_ID3, {min:4 , max: 4}) && 
  //  validator.isUppercase(ACK_ID3) && validator.isNumeric(ACK_ID5) && validator.matches(ACK_ID2, '-') && 
  //  validator.matches(ACK_ID4, '-') && validator.isLength(ACK_ID5, {min:5 , max: 5})) && (((AADHAR_ID && AADHAR_ID.trim()) && validator.isNumeric(AADHAR_ID) && 
  //  validator.isLength(AADHAR_ID, {min:12 , max: 12})) || ((MOBILE_NO && MOBILE_NO.trim() && validator.isNumeric(MOBILE_NO) && 
  //  validator.isLength(MOBILE_NO, {min:10 , max: 10})))))) {

  
    if(!(((BHAMASHAH_ACK_ID && BHAMASHAH_ACK_ID.trim() && validator.isNumeric(ACK_ID1) && 
    validator.isLength(ACK_ID1, {min:4 , max: 4}) && validator.isAlphanumeric(ACK_ID3) && 
    validator.isLength(ACK_ID3, {min:4 , max: 4}) && validator.isUppercase(ACK_ID3) 
    && validator.isNumeric(ACK_ID5) && validator.matches(ACK_ID2, '-') && 
    validator.matches(ACK_ID4, '-') && validator.isLength(ACK_ID5, {min:5 , max: 5}))) || ((BHAMASHAH_ID 
      && BHAMASHAH_ID.trim() && validator.isUppercase(BHAMASHAH_ID) && validator.isAlpha(BHAMASHAH_ID)
      && validator.isLength(BHAMASHAH_ID, {min:7 , max: 7}))))) {
   var getErrMsg = Utils.getErrorMessage(lang, "ERROR_EA27")
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
   callback(error, "");
   }
   else if(!(((AADHAR_ID && AADHAR_ID.trim()) && validator.isNumeric(AADHAR_ID) && 
   validator.isLength(AADHAR_ID, {min:12 , max: 12})) || ((MOBILE_NO && MOBILE_NO.trim() && validator.isNumeric(MOBILE_NO) && 
   validator.isLength(MOBILE_NO, {min:10 , max: 10}))))) { 
  var getErrMsg = Utils.getErrorMessage(lang, "ERROR_EA26")
   var error = {
       'success': false,
       "status": 400,
       'error': {
          //  'code': 400,
          //  'message': 'Please check Aadhar ID or Mobile No.',
           'code': getErrMsg.code,
           'message': getErrMsg.message,
           'status_type': '',
           'status_popupmessage_type': ''
       },
      };
   callback(error, "");}
   else {
      getDBTDetails.getDBTDetails(lang, BHAMASHAH_ID, BHAMASHAH_ACK_ID, AADHAR_ID, MOBILE_NO, function ( error, result ) { 
          console.log(result)
            if (error) {
              callback(error, "")
            } else {
             callback("", result)
            }
          }); 
        }
}