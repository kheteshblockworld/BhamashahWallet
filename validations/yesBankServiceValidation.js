
'use strict';
var validator = require('validator');
const Mpincreation = require('../functions/LoginServices/createMpin')
const Utils = require('../util/utils')
const MpinLoginfunc = require('../functions/LoginServices/MpinLogin')
const bankServices = require('./../util/bankServices');
const yesBankServices = require('../functions/YesBankServices/yesBankServices');
// const walletSDK = require('../sdk/wallet')
// const walletDB = require('../functions/DBFunctions/WalletDB')
module.exports = {
    checkUserValidation: checkUserValidation,
    checkKYCStatusValidation: checkKYCStatusValidation,
    regUserValidation: regUserValidation,
    verifyMotpValidation: verifyMotpValidation,
    addBeneficiaryValidation: addBeneficiaryValidation,
    fetchBeneficiaryValidation: fetchBeneficiaryValidation,
    changeBeneficiaryValidation: changeBeneficiaryValidation,
    loadmoneytowallet:loadmoneytowallet,
    Wallet:Wallet,
    checkWalletBalanceValidation:checkWalletBalanceValidation

}

function checkUserValidation(req, callback){
    var params = req.body;
    if(!params.p1 || !params.p1.trim() || !validator.isNumeric(params.p1) || params.p1.length!==10){
     err = {
         "status": 400,
         "message": 'fields should not be empty'
     }
     callback(err, "");
    }else{
        yesBankServices.checkUser(params, function (result, error) {
            console.log(result)
            if (error) {
              callback(error)
            } else {
             callback(result)
            }
          });  
    }
}
function checkWalletBalanceValidation(req, callback){
    var params = req.body;
    if(!params.p1 || !params.p1.trim() || !validator.isNumeric(params.p1) || params.p1.length!==10){
     err = {
         "status": 400,
         "message": 'fields should not be empty'
     }
     callback(err, "");
    }else{
        yesBankServices.curlWalletBalance(params, function (result, error) {
            console.log(result)
            if (error) {
              callback("",error)
            } else {
             callback("",result)
            }
          });  
    }
}

function checkKYCStatusValidation(req, callback){
    var params = req.body;
    if(!params.p1 || !params.p1.trim() || !validator.isNumeric(params.p1) || params.p1.length!==10){
     err = {
         "status": 400,
         "message": 'fields should not be empty'
     }
     callback(err, "");
    }else{
        yesBankServices.checkKYCStatus(params, function (result, error) {
            console.log(result)
            if (error) {
              callback(error)
            } else {
             callback(result)
            }
          });  
    }
}

function regUserValidation(req, callback){
    var params = req.body;
    if(!params.p1 || !params.p1.trim() || !validator.isNumeric(params.p1) || params.p1.length!==10){
     err = {
         "status": 400,
         "message": 'fields should not be empty'
     }
     callback(err, "");
    }else{
        yesBankServices.regUser(params.p1, function (result, error) {
            console.log(result)
            if (error) {
              callback(error)
            } else {
             callback(result)
            }
          });  
    }
}

function verifyMotpValidation(req, callback){
    var params = req.body;
    if(!validator.isNumeric(params.p1) || params.p1.length!==10 ||!params.p1 || !params.p1.trim()
    || !validator.isAlphanumeric(params.p2) ||!params.p2 || !params.p2.trim()
    || !validator.isNumeric(params.p3) ||!params.p3 || !params.p3.trim()){
     err = {
         "status": 400,
         "message": 'fields should not be empty'
     }
     callback(err);
    }else{
        yesBankServices.verifyMotp(params.p1,params.p2,params.p3, function (result, error) {
            console.log(result)
            if (error) {
              callback(error)
            } else {
             callback(result)
            }
          });  
    }
}
function addBeneficiaryValidation(req, callback){
    var params = req.body;
    if(!validator.isNumeric(params.p1) || params.p1.length!==10 ||!params.p1 || !params.p1.trim()
    || !validator.isAlphanumeric(params.p2)
    || !validator.isAlphanumeric(params.p3) ||!params.p3 || !params.p3.trim()
    || !validator.isAlphanumeric(params.p4) ||!params.p4 || !params.p4.trim()
    || !params.p4 || !params.p4.trim()){
     err = {
         "status": 400,
         "message": 'fields should not be empty'
     }
     callback(err);
    }else{
        yesBankServices.addBeneficiary(params, function (result, error) {
            console.log(result)
            if (error) {
              callback(error)
            } else {
             callback(result)
            }
          });  
    }
}

function fetchBeneficiaryValidation(req, callback){
    var params = req.body;
    if(!params.p1 || !params.p1.trim() || !validator.isNumeric(params.p1) || params.p1.length!==10
     || !params.p2 || !params.p2.trim() || !validator.isNumeric(params.p2)){
     err = {
         "status": 400,
         "message": 'fields should not be empty'
     }
     callback(err, "");
    }else{
        yesBankServices.fetchBeneficiary(params, function (result, error) {
            console.log(result)
            if (error) {
              callback(error)
            } else {
             callback(result)
            }
          });  
    }
}

function changeBeneficiaryValidation(req, callback){
    var params = req.body;
    if(!params.p1 || !params.p1.trim() || !validator.isNumeric(params.p1) || params.p1.length!==10
     || !params.p2 || !params.p2.trim() || !validator.isNumeric(params.p2)
     || !params.p3 || !params.p3.trim() || !validator.isNumeric(params.p3)){
     err = {
         "status": 400,
         "message": 'fields should not be empty'
     }
     callback(err, "");
    }else{
        yesBankServices.changeBeneficiary(params, function (result, error) {
            console.log(result)
            if (error) {
              callback(error)
            } else {
             callback(result)
            }
          });  
    }
}




 function addBeneficiaryValidation(req, callback){
         var params = req.body;
         if(!validator.isNumeric(params.p1) || params.p1.length!==10 ||!params.p1 || !params.p1.trim()
         || !validator.isAlphanumeric(params.p2)
         || !validator.isAlphanumeric(params.p3) ||!params.p3 || !params.p3.trim()
         || !validator.isAlphanumeric(params.p4) ||!params.p4 || !params.p4.trim()
         || !params.p4 || !params.p4.trim()){
          err = {
              "status": 400,
              "message": 'fields should not be empty'
          }
          callback(err);
         }else{
             yesBankServices.addBeneficiary(params, function (result, error) {
                 console.log(result)
                 if (error) {
                   callback(error)
                 } else {
                  callback(result)
                 }
               });
         }
     }
     
     function fetchBeneficiaryValidation(req, callback){
         var params = req.body;
         if(!params.p1 || !params.p1.trim() || !validator.isNumeric(params.p1) || params.p1.length!==10
          || !params.p2 || !params.p2.trim() || !validator.isNumeric(params.p2)){
          err = {
              "status": 400,
              "message": 'fields should not be empty'
          }
          callback(err, "");
         }else{
             yesBankServices.fetchBeneficiary(params, function (result, error) {
                 console.log(result)
                 if (error) {
                   callback(error)
                 } else {
                  callback(result)
                 }
               });
         }
     }
    
     function changeBeneficiaryValidation(req, callback){
         var params = req.body;
         if(!params.p1 || !params.p1.trim() || !validator.isNumeric(params.p1) || params.p1.length!==10
          || !params.p2 || !params.p2.trim() || !validator.isNumeric(params.p2)
          || !params.p3 || !params.p3.trim() || !validator.isNumeric(params.p3)){
          err = {
              "status": 400,
              "message": 'fields should not be empty'
          }
          callback(err, "");
         }else{
             yesBankServices.changeBeneficiary(params, function (result, error) {
                 console.log(result)
                 if (error) {
                   callback(error)
                 } else {
                  callback(result)
                 }
               });
       }
    }

 function loadmoneytowallet(req, callback){
    var params = req.body;
        yesBankServices.curlLoadMoneyToWallet(params, function (result, error) {
            console.log(result)
           
            if (error) {
              callback(error)
            } else {
             callback(result)
            }
          });  
    //}
}
function Wallet(req, callback){
    var params = req.body;
       yesBankServices.Walletvalidation(params, function (result, error) {
            console.log(result)
            if (error) {
              callback(error)
            } else {
             callback(result)
            }
          });  
    
}

function changeBeneficiaryValidation(req, callback){
    var params = req.body;
    if(!params.p1 || !params.p1.trim() || !validator.isNumeric(params.p1) || params.p1.length!==10
     || !params.p2 || !params.p2.trim() || !validator.isNumeric(params.p2)
     || !params.p3 || !params.p3.trim() || !validator.isNumeric(params.p3)){
     err = {
         "status": 400,
         "message": 'fields should not be empty'
     }
     callback(err, "");
    }else{
        yesBankServices.changeBeneficiary(params, function (result, error) {
            console.log(result)
            if (error) {
              callback(error)
            } else {
             callback(result)
            }
          });  
    }
}

