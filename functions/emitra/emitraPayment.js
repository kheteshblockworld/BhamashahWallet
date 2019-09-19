/**
 * @author: Sathiyan Baskaran
 * @version: 1.0.0
 * @date: October20, 2018
 * @Description: Emitra validation function for storing user inputs.
 */
'use strict';
const errCode = require('../../message/errMsg');
const errMsg = require('../../message/messageEN');
const sqlQueryExec = require('../../mysql_connection/query_execute');
const querys = require('../../mysql_connection/quiries');
const generateHashCheck = require('../../util/generateHash');
const generateRppHashCheckSum = require('../../util/generateHash');
const AccessTokenDB = require('../../functions/DBFunctions/AccessTokenDB');
const RppBillPaymentDB = require('../../functions/DBFunctions/RppBillPaymentDB');
const EmitraDB = require('../../functions/DBFunctions/emitraDB');
var config = require('config');
var eMitra = config.get('eMitra');
const networkReq = require('../../util/networkFormAdapter');
var Utils = require('../../util/utils');
const transcationType = require('../../message/transcationType');
module.exports = {
    emitraPayment: emitraPayment,
    BackToBackBillPayment: BackToBackBillPayment,
    BillPaymentVerification:BillPaymentVerification,
    RppBillPayment:RppBillPayment,
    generateRppHashCheckSum:generateRppHashCheckSum,
    successRppPayment:successRppPayment,
    failureRppPayment:failureRppPayment
}

function emitraPayment(result, transaction_id,lang,connection ) {
    return new Promise(async(resolve, reject) => {
        if (result.data.error) {
            return false;
        }
         else {
            var transaction_reference_number = result.data.data.message.transaction_reference_number;
            var yes_bank_reference_number = result.data.data.message.yes_bank_reference_number;
            var queryParams = [transaction_reference_number, yes_bank_reference_number, transaction_id];
            let updateTrans = await EmitraDB.updateTranscation(queryParams,connection);
            console.log("updateTrans===>",updateTrans);
                    if (updateTrans) {
                        resolve(result);
                    } else {
                        return false;
                    }
                
        }
    })
}

function BackToBackBillPayment(transaction_id, serviceId, consumerKey, name, officeCode, mobile, lookupId, amount, lang) {
    return new Promise(async(resolve, reject) => {
        // var selectrevenuehead = querys.selectrevenuehead;
        var prn = transaction_id;
        console.log("amount=====>", amount);
        let result = await EmitraDB.selectrevenuehead(serviceId);
                if (result.data.length > 0) {
                    var comm = result.data[0].comm_1;
                    if (amount > 2000 && amount <= 5000) {
                        var comm = result.data[0].comm_2;
                    } else if (amount > 5000) {
                        var comm = result.data[0].comm_3;
                    }
                    var amountDec = (parseFloat(amount).toFixed(2));
                    var commDec = (parseFloat(comm).toFixed(2));
                    var revenue_head_1 = result.data[0].revenue_head_1;
                    var revenue_head_2 = result.data[0].revenue_head_2;
                    var commtype = result.data[0].commtype;
                    var revenuHead = revenue_head_1 + '-' + amountDec + '|' + revenue_head_2 + '-' + commDec;
                    console.log("revenuHead=====>", revenuHead);
                    console.log("commtype=====>", commtype);
                    generateHashCheck.generateHashCheckSum(prn, commtype, transaction_id, serviceId, consumerKey, name, officeCode, mobile, lookupId, revenuHead)
                        .then(async function (result) {
                            generateHashCheck.generateHash(result)
                            .then(function (result) {

                                console.log("result=======>",result);
                                resolve(result);
                            })
                        })

                } else {
                    return false;
                }
            

    })
}


function RppBillPayment(transaction_id, serviceId, consumerKey, name, officeCode, mobile, lookupId, amount, lang) {
    return new Promise(async(resolve, reject) => {
        var selectrevenuehead = querys.selectrevenuehead;
        var prn = transaction_id;
        console.log("amount=====>", amount);
        let result = await EmitraDB.selectrevenuehead(serviceId);
                if (result.data.length > 0) {
                    var comm = result.data[0].comm_1;
                    if (amount > 2000 && amount <= 5000) {
                        var comm = result.data[0].comm_2;
                    } else if (amount > 5000) {
                        var comm = result.data[0].comm_3;
                    }
                    var amountDec = (parseFloat(amount).toFixed(2));
                    var commDec = (parseFloat(comm).toFixed(2));
                    var revenue_head_1 = result.data[0].revenue_head_1;
                    var revenue_head_2 = result.data[0].revenue_head_2;
                    var commtype = result.data[0].commtype;
                    var revenuHead = revenue_head_1 + '-' + amountDec + '|' + revenue_head_2 + '-' + commDec;
                    console.log("revenuHead=====>", revenuHead);
                    console.log("commtype=====>", commtype);
                    generateHashCheck.generateRppHashCheckSum(prn, commtype, transaction_id, serviceId, consumerKey, name, officeCode, mobile, lookupId, revenuHead, amountDec)
                        .then(async function (result) {
                                var url = eMitra.eMitraWebServicesUrl;
                                var postFields = result;
                                var subUrl = 'tripleDesEncryption'
                                let networkResponse = await networkReq.RppnetworkRequest(postFields,url,subUrl);
                                console.log("networkResponse====>",networkResponse);
                                // var netResult = {
                                //     "status":200,
                                //     "data":networkResponse
                                // }
                                resolve(networkResponse);                                                      
                        })

                } else {
                    return false;

                }
            

    })
}

function BillPaymentVerification(accessToken,transaction_id, lang) {
    return new Promise(async (resolve, reject) => {
    let AccessToken = await AccessTokenDB.checkAccessTokenGetID(accessToken);
    var user_id = AccessToken;
    console.log("user_id====>", user_id);
    if (!user_id) {
        var getErrMsg =await Utils.getErrorMessage(lang, "ERROR_EA01")
        var result = {
            "status": 401,
            "code": getErrMsg.code,
            "message": getErrMsg.message
        }
        console.log("err==>", result);
        resolve(result);
    } else {
        let transcation = await AccessTokenDB.checkTranscationId(transaction_id, user_id);
        if (!transcation) {
            var getErrMsg =await Utils.getErrorMessage(lang, "ERROR_EA32")
            console.log("err==>", getErrMsg.ERROR_EA32);
            var result = {
                "status": 401,
                "code": getErrMsg.code,
                "message": getErrMsg.message
            }
            resolve(result);
        } else {
            var transaction_id_db = transcation.transaction_id;
            var postFields = [];
            postFields.MERCHANTCODE= eMitra.eMitraMerchantCode;
            postFields.SERVICEID= '1220';
            postFields.PRN = transaction_id_db;
            console.log("postFields====>", postFields);

            var url = eMitra.eMitraWebServicesUrl;
            var subUrl = 'newAggrTransVerify'
        

            let networkResponse = await networkReq.unEncryptedNetworkReq(postFields,url,subUrl);
            var getErrMsg =await Utils.getErrorMessage(lang, "SUCCESS_SA15")
            var result = {
                "status":200,
                "data":JSON.parse(networkResponse)
            }
            resolve(result);
        }
    }
})
}

async function successRppPayment(PRN,lang,emitra_transactionid,emitra_receiptno,emitra_paidamount,emitra_timestamp,payment_mode,payment_mode_bid,payment_mode_timestamp,emitra_status,response_code) {
    return new Promise(async(resolve, reject) => {
        try{
            if(!PRN || PRN == ""){
                errorCode = 'ERROR_F01';
                throw new Error('Fields Should not be Empty.')
            }else{
                var errorCode;
                var connection = await sqlQueryExec.getConnection()
                await connection.beginTransaction()
                var trans_status = transcationType.STATUS_COMPLETE;
                let addTranscation = await RppBillPaymentDB.addTranscation(trans_status,PRN,connection);
                console.log("addTranscation=======>",addTranscation);
                if(addTranscation){
                    let findTranscation = await RppBillPaymentDB.findTranscation(PRN,connection);
                    var transID = findTranscation;
                    if(!transID){
                        errorCode = 'ERROR_R46';
                        throw new Error('Failed to load money')
                    }else{
                        var updateTransTab = [emitra_transactionid,emitra_receiptno,emitra_paidamount,emitra_timestamp,payment_mode,payment_mode_bid,payment_mode_timestamp,emitra_status,response_code,transID];
                        let updateTranscationMeta = await RppBillPaymentDB.updateTranscation(updateTransTab,connection);
                            if(updateTranscationMeta){
                                var getErrMsg =await Utils.getErrorMessage(lang, "SUCCESS_SA16");
                                var result = {
                                    "status": 200,
                                    "code": getErrMsg.code,
                                    "message": getErrMsg.message
                                }
                                resolve(result);
                            }else{
                                errorCode = 'ERROR_R46';
                                throw new Error('Failed to load money')  
                            }
                    }
    
                }else{
                    errorCode = 'ERROR_R46';
                    throw new Error('Failed to load money')
                }
            }
            connection.commit();
        }
        catch(err){
            connection.rollback()
            var getErrMsg = Utils.getErrorMessage(lang, errorCode);
            var result = {
                'success': false,
                'data': {
                    'code': getErrMsg.code,
                    'message': getErrMsg.message,
                    'status_type': '',
                    'status_popupmessage_type': ''
                },
                "isSuccessful": false,
                "status": 200
            };
            return resolve(result);
        }
    })
}

async function failureRppPayment(PRN,lang,emitra_transactionid,emitra_receiptno,emitra_paidamount,emitra_timestamp,payment_mode,payment_mode_bid,payment_mode_timestamp,emitra_status,response_code) {
    return new Promise(async(resolve, reject) => {
        try{
            if(!PRN || PRN == ""){
                errorCode = 'ERROR_F01';
                throw new Error('Fields Should not be Empty.')
            }else{
                var errorCode;
                var connection = await sqlQueryExec.getConnection()
                await connection.beginTransaction()
                console.log("connection===>",connection);
                if(trans_status == 'FAILED'){
                    var trans_status = transcationType.STATUS_FAILED;
                }else{
                    var trans_status = transcationType.STATUS_PENDING;
                }
                let addTranscation = await RppBillPaymentDB.addTranscation(trans_status,PRN,connection);
                console.log("addTranscation=======>",addTranscation);
                if(addTranscation){
                    let findTranscation = await RppBillPaymentDB.findTranscation(PRN,connection);
                    var transID = findTranscation;
                    if(!transID){
                        errorCode = 'ERROR_R46';
                        throw new Error('Failed to load money')
                    }else{
                        var updateTransTab = [emitra_transactionid,emitra_receiptno,emitra_paidamount,emitra_timestamp,payment_mode,payment_mode_bid,payment_mode_timestamp,emitra_status,response_code,transID];
                        let updateTranscationMeta = await RppBillPaymentDB.updateTranscation(updateTransTab,connection);
                            if(updateTranscationMeta){
                                var getErrMsg =await Utils.getErrorMessage(lang, "ERROR_EA02");
                                var result = {
                                    "status": 200,
                                    "code": getErrMsg.code,
                                    "message": getErrMsg.message
                                }
                                resolve(result);
                            }else{
                                errorCode = 'ERROR_R46';
                                throw new Error('Failed to load money')
                            }
                    }
    
                }else{
                    errorCode = 'ERROR_R46';
                    throw new Error('Failed to load money')
                }
                connection.commit();
            }
        }catch(err){
            connection.rollback()
            var getErrMsg = Utils.getErrorMessage(lang, errorCode);
            var result = {
                'success': false,
                'data': {
                    'code': getErrMsg.code,
                    'message': getErrMsg.message,
                    'status_type': '',
                    'status_popupmessage_type': ''
                },
                "isSuccessful": false,
                "status": 200
            };
            return resolve(result);

        }
    })
}