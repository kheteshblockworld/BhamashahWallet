/**
 * @author: Sathiyan Baskaran
 * @version: 1.0.0
 * @date: October 16, 2018
 * @Description: Emitra validation function for validating user inputs.
 */
'use strict';
const sqlQueryExec = require('../mysql_connection/query_execute');
const querys = require('../mysql_connection/quiries');
const errCode = require('../message/errMsg');
const errMsg = require('../message/messageEN');
const transcationType = require('../message/transcationType');
const generateHash = require('../util/generateHash');
const networkReq = require('../util/networkFormAdapter');
const yesBankService = require('../functions/YesBankServices/yesBankServices');
const yesBankPayment = require('../functions/emitra/emitraPayment');
const emitraPayment = require('../functions/emitra/emitraPayment');
const multichainsdk = require('../sdk/invoke');
const UsersDB = require('../functions/DBFunctions/UsersDB');
const TranscationDB = require('../functions/DBFunctions/TransactionDB');
const EmitraDB = require('../functions/DBFunctions/emitraDB');

const WalletToBank = require('../functions/WalletServices/WalletToBank');

var config = require('config');
var eMitra = config.get('eMitra');
var uniqid = require('uniqid');
var format = require('date-format');
var Utils = require('../util/utils');
module.exports = {
    emitraFetchValidation: emitraFetchValidation,
    recentBillHistory: recentBillHistory,
    actionBillPayment: actionBillPayment,
    actionBillPaymentVerify: actionBillPaymentVerify,
    RppBillPaymentInit: RppBillPaymentInit,
    WalletToBank: WalletToBank,
    RppBillPaymentStatus: RppBillPaymentStatus
}
var Networkconfig = eMitra;
var err;
/**
 * @author: Sathiyan Baskaran
 * @version: 1.0.0
 * @date: October 17, 2018
 * @Description: Fetching user by using sso using encypted data.
 */
function emitraFetchValidation(req) {
    return new Promise(async (resolve, reject) => {
        var errorCode;
        const accessToken = req.headers.access_token;
        const lang = req.headers.user_language ? req.headers.user_language : 'en';
        var serviceId = req.body.serviceId;
        var searchKey = req.body.searchKey;
     try{   
         if (!accessToken || !accessToken.trim() || !serviceId || !serviceId.trim() || !searchKey || !searchKey.trim()) {
            errorCode = 'ERROR_F01';
            throw new Error('Fields Should not be Empty.')
        } else {
            // query assigning
            // var searchQuery = querys.findaccesstoken_access_token;
            // var readuser = querys.readuser;
            let searchUser = await EmitraDB.searchQuery(accessToken);
                    if (searchUser) {
                        let readuser = await UsersDB.readusersid(searchUser)
                                if (searchUser) {
                                    var sso_id = readuser.data[0].sso_id;
                                    console.log("sso_id======>", sso_id);
                                    var dataString = {
                                        "SSOID": sso_id ? sso_id : '',
                                        "SRVID": serviceId ? serviceId : '',
                                        "searchKey": searchKey ? searchKey : ''
                                    }
                                    // var dataString = {
                                    //     "SSOID":"SSOTESTKIOSK1",
                                    //     "SRVID":"1223",
                                    //     "searchKey":"210414023236"
                                    // }
                                    generateHash.generateHash(JSON.stringify(dataString))
                                        .then(async function (result) {
                                            let networkRes = await networkReq.networkRequest(result, Networkconfig.eMitraWebServicesUrl, Networkconfig.getFetchDetailsEncryptedBySso)
                                                    console.log("network result======>", networkRes);
                                                    generateHash.decryptHash(JSON.stringify(networkRes))
                                                        .then(async function (networkRes) {
                                                            console.log("decrypt result======>", networkRes);
                                                            var resultReq = {
                                                                "status": 200,
                                                                "message": networkRes
                                                            }

                                                            // let bcsdk = await multichainsdk.addData({
                                                            //     "key":"asd",
                                                            //     "value":"asds"
                                                            // })
                                                            // console.log("bcsdk=====>",bcsdk);
                                                            resolve(resultReq);
                                                        })
                                                
                                        })
                                } else {
                                    errorCode = 'ERROR_EA00';
                                    throw new Error('Invalid User!')
                                }
                            
                        // resolve(result);
                    } else {
                        errorCode = 'ERROR_EA00';
                        throw new Error('Invalid User!')
                    }
                
        }
    }catch(err){
        console.log("errorCode-====>",errorCode);
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
/**
 * @author: Sathiyan Baskaran
 * @version: 1.0.0
 * @date: October 17, 2018
 * @Description: Fetching Recent Bill History of the user.
 */
function recentBillHistory(req) {
    return new Promise(async(resolve, reject) => {
        var errorCode;
        const accessToken = req.headers.access_token;
        console.log("accessToken=====>", accessToken);
        const lang = req.headers.user_language ? req.headers.user_language : 'en ';
        console.log("lang=====>", lang);
        var serviceId = req.body.serviceId;
        var searchKey = req.body.searchKey;
        try{
            if (!accessToken || !accessToken.trim()) {
                errorCode = 'ERROR_F01';
                throw new Error('Fields Should not be Empty.')
            } else {
                // query assigning
                // var searchQuery = querys.findaccesstoken_access_token;
                // var findTranscation = querys.findTranscation;
                let searchUser = await EmitraDB.searchQuery(accessToken);
                        if (searchUser) {
                            var user_id = searchUser;
                            var BillPayment = 'BillPayment';
                            var queryParams = [user_id, BillPayment, 1];
                            let findTranscation = await TranscationDB.findTranscation(queryParams);
                                    if (findTranscation) {
                                        var sso_id = findTranscation;
                                        var BillHistory = "BillHistory";
                                        console.log("sso_id======>", sso_id);
                                        var bck_key = await UsersDB.getUserById(user_id)
                                        console.log("sso_id=====>", sso_id.data);
                                        var getSuccessMsg = await Utils.getErrorMessage(lang, "SUCCESS_SA15")
                                        var resData = {
                                            "status": 200,
                                            "code": getSuccessMsg.code,
                                            "message": getSuccessMsg.message,
                                            "data": sso_id.data
                                        }
                                        resolve(resData);
                                        // let bcsdk = await multichainsdk.addData({
                                        //     "key":bck_key+'_'+BillHistory,
                                        //     "value":sso_id.data
                                        // })
                                    } else {
                                        errorCode = 'ERROR_EA00';
                                        throw new Error('Invalid User!')
                                    }
                                
                        } else {
                            errorCode = 'ERROR_EA00';
                            throw new Error('Invalid User!')
                        }
                    
            }
        }catch(err){
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

/**
 * @author: Sathiyan Baskaran
 * @version: 1.0.0
 * @date: October 17, 2018
 * @Description: Bill Payment of the user.
 */
function actionBillPayment(req) {
    return new Promise(async(resolve, reject) => {
        var connection = await sqlQueryExec.getConnection()
        await connection.beginTransaction()
        console.log("connection===>",connection);
        var errorCode;
        const accessToken = req.headers.access_token;
        console.log("accessToken=====>", accessToken);
        const lang = req.headers.user_language ? req.headers.user_language : 'en';
        console.log("lang=====>", lang);
        var name = req.body.name;
        var mobile = req.body.mobile;
        var email = req.body.email;
        var amount = req.body.amount ? req.body.amount : 'null';
        var consumer_key = req.body.consumer_key;
        var service_id = req.body.service_id;
        var office_code = req.body.office_code;
        var lookupId = req.body.lookupId;
        var bill_type = req.body.bill_type;
        var bill_carrier = req.body.bill_carrier;
        var result;
        try{
            if (!accessToken || !accessToken.trim() || !name || !name.trim() || !mobile || !mobile.trim() || !email || !email.trim() || !amount || !amount.trim() || !consumer_key || !consumer_key.trim() || !service_id || !service_id.trim() || !office_code || !office_code.trim() || !lookupId || !lookupId.trim() || !bill_type || !bill_type.trim() || !bill_carrier || !bill_carrier.trim()) {
                    errorCode = 'ERROR_F01';
                    throw new Error('Fields Should not be Empty.')
                
            } else {
                let searchQuery = await EmitraDB.searchQuery(accessToken,connection);   
                var user_id = searchQuery;
                if(!searchQuery){
                    errorCode = 'ERROR_EA00';
                    throw new Error('Invalid User!')
                }else{
                    let walletQuery = await EmitraDB.walletQuery(searchQuery,connection); 
                    if(!walletQuery){   
                        errorCode = 'ERROR_R26';
                        throw new Error('User Not Found!')
                    }else{
                        var wallet_balance = walletQuery.data[0].wallet_balance;
                        var wallet_mobile = walletQuery.data[0].wallet_mobile;
                        console.log("wallet_mobile", wallet_mobile);
                        console.log("amount====>", amount);
                        if (!parseFloat(amount) || parseFloat(amount) < 1) {
                            errorCode = 'ERROR_R47';
                            throw new Error('Failed to debit money')
                        } else if (parseFloat(wallet_balance) < parseFloat(amount)) {
                            errorCode = 'ERROR_R48';
                            throw new Error('You do not have sufficient balance')
                        } else if(parseFloat(wallet_balance) > parseFloat(amount) || parseFloat(amount) > 1){
                                    var transaction_id = uniqid.process();
                                    var reversal_transaction_reference = null;
                                    var transUser_id = user_id ? user_id : null;
                                    var transaction_type = transcationType.TRANSACTION_TYPE_DEBIT;
                                    var type = transcationType.TYPE_BILLPAYMENT;
                                    var sender_id = null;
                                    var reciver_id = null;
                                    var tag = '';
                                    var transaction_reference_number = null;
                                    var yes_bank_reference_number = null;
                                    var remark = '';
                                    var status = transcationType.STATUS_PENDING;
                                    var show_to_user = '1';
                                    var date_created = format('yyyy-MM-dd hh:mm:ss', new Date());
                                    // hard coded testing data
                                    // var transaction_id = uniqid();
                                    // var reversal_transaction_reference = null;
                                    // var transUser_id = user_id ? user_id : null;
                                    // var transaction_type = transcationType.TRANSACTION_TYPE_DEBIT;
                                    // var type = '1';
                                    // var sender_id = null;
                                    // var reciver_id = null;
                                    // var tag = '';
                                    // var transaction_reference_number = null;
                                    // var yes_bank_reference_number = null;
                                    // var remark = '';
                                    // var status = transcationType.STATUS_PENDING;
                                    // var show_to_user = '1';
                                    // var date_created = "2018-04-20 12:54:21";
                                    // var date_created = format('yyyy-mm-dd hh:mm:ss', new Date());
                                    var queryParam = [transaction_id, reversal_transaction_reference, transUser_id, amount, transaction_type, type, sender_id, reciver_id, tag, transaction_reference_number, yes_bank_reference_number, remark, status, show_to_user, date_created];
                                    let addTranscation = await EmitraDB.TranscationAdd(queryParam,connection);
                                    if(addTranscation){
                                        ///blockchain integration
                                        let wallettobank = await WalletToBank.WalletToBank(user_id,parseInt(amount));
                                        let bkTranscationID = wallettobank.txid;
                                        console.log("bkTranscationID=====>",bkTranscationID);   
                                        if(wallettobank == 'FAILED'){
                                            errorCode = 'D01';
                                            throw new Error('transcation does not exist in blockchain...')
                                        }else{
                                            
                                        let findTranscation = await EmitraDB.findTranscationId(transaction_id,connection);
                                        if(!findTranscation){
                                            errorCode = 'D01';
                                            throw new Error('transcation does not exist...')
                                        }else{
                                            var transID = findTranscation;
                                            var queryParamMeta = [transID, bill_type, bill_carrier, service_id, consumer_key];
                                            console.log("transID====>", transID);
                                            var remaining_wallet_bal = ((parseFloat(wallet_balance).toFixed(2)) - (parseFloat(amount).toFixed(2)));
                                            console.log("remaining_wallet_bal====>", remaining_wallet_bal);  
                                            var updateWallet = [remaining_wallet_bal, user_id, mobile];
                                            let updateWalletBal = await EmitraDB.updateWalletBalance(updateWallet); 
                                            if(!updateWalletBal)  
                                            {
                                                errorCode = 'D02';
                                                throw new Error('unable to update the updateWalletBal')
                                            }else{
                                                let addTranscationMeta = await EmitraDB.addTranscationMeta(queryParamMeta,connection);
                                            if(!addTranscationMeta){
                                                errorCode = 'D02';
                                                throw new Error('unable to save the addtranscationmeta')
                                            }else{
                                                var tagName = 'Bill Payment';
                                                var spendMerchantCode = config.yesbankservices.spendMerchantCode;
                                                var bankParams = [wallet_mobile, amount, tagName, transaction_id, '', spendMerchantCode, 0];
                                                let  yesBankRes = await yesBankService.actionEmitraBillPayment(bankParams);
                                                if(yesBankRes){
                                                    let yesBankPay = await yesBankPayment.emitraPayment(yesBankRes, transID, lang, connection)
                                                    if (yesBankPay) {
                                                        let BacktoBack = await yesBankPayment.BackToBackBillPayment(transaction_id, service_id, consumer_key, name, office_code, mobile, lookupId, amount, lang);
                                                        console.log("encrypted=====>", BacktoBack);
                                                        console.log("Networkconfig.backtobackTransactionWithEncryptionA=====>", Networkconfig.backtobackTransactionWithEncryptionA);
                                                        let netReq = await networkReq.networkRequest(BacktoBack, Networkconfig.eMitraWebServicesUrl, Networkconfig.backtobackTransactionWithEncryptionA);
                                                        let hashGen = await generateHash.decryptHash(JSON.stringify(netReq))
                                                        var emitra_result = JSON.parse(hashGen);
                                                        var emitra_transactionid = emitra_result.TRANSACTIONID;
                                                        var emitra_receiptno = emitra_result.RECEIPTNO;
                                                        var emitra_paidamount = emitra_result.TRANSAMT;
                                                        var emitra_timestamp = emitra_result.EMITRATIMESTAMP;
                                                        var payment_mode = 'wallet';
                                                        var emitra_status = emitra_result.TRANSACTIONSTATUS;
                                                        var transMetaParams = [emitra_transactionid, emitra_receiptno, emitra_paidamount, emitra_timestamp, payment_mode, emitra_status, transID];
                                                        let updateTranscationMeta = await EmitraDB.updateTranscationMeta(transMetaParams,connection);
                                                       if(!updateTranscationMeta){
                                                        errorCode = 'D02';
                                                        throw new Error('unable to save the transcation meta table')
                                                       }else{
                                                        if (emitra_status == 'SUCCESS') {
                                                            var status = transcationType.STATUS_COMPLETE;
                                                            var transStatusParams = [status,bkTranscationID,transID];
                                                            let emitraStatus = await EmitraDB.updateTranscationStatus(transStatusParams,connection)
                                                            if(emitraStatus.message == 'Success' && emitraStatus.data.affectedRows == '1'){
                                                                var getErrMsg = await Utils.getErrorMessage(lang, "SUCCESS_SA16")
                                                                result = {
                                                                    "status": 200,
                                                                    "code": getErrMsg.code,
                                                                    "message": getErrMsg.message
                                                                }
                                                                resolve(result);
                                                            }else{
                                                                errorCode = 'D02';
                                                                throw new Error('unable to update the transcation status in  transcation table')
                                                            }              
                                                        } else if (emitra_status == 'PENDING') {
                                                            errorCode = 'ERROR_EA34';
                                                            throw new Error('unable to save the transcation meta table')
                                                        } else if (emitra_status == 'FAILURE') {
                                                            errorCode = 'ERROR_EA33';
                                                            throw new Error('unable to save the transcation meta table')
                                                        }
    
                                                       }
    
                                                    }else{
                                                        errorCode = 'D02';
                                                        throw new Error('unable to update the yes bank reference transcationmeta')
                                                    }
    
                                                }else{
                                                    result = {
                                                        "status": 401,
                                                        "message": "Yes Bank Payment Failed"
                                                    }
                                                    resolve(result);
                                                }
                                            }
                                            }                                                     
                                        }                                          
                                        }                            
                                    }else{
                                        errorCode = 'D02';
                                        throw new Error('unable to insert the new transcation')
                                    }
                        }
                    }    
                }
            }
            connection.commit();
        }catch(err){
        connection.rollback()
        console.log("errorCode-====>",errorCode);
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

/**
 * @author: Sathiyan Baskaran
 * @version: 1.0.0
 * @date: October 17, 2018
 * @Description: Function for verifying the bill payment.
 */
function actionBillPaymentVerify(req) {
    return new Promise(async (resolve, reject) => {
        const accessToken = req.headers.access_token;
        console.log("accessToken=====>", accessToken);
        const lang = req.headers.user_language ? req.headers.user_language : 'en';
        console.log("lang=====>", lang);
        var transaction_id = req.body.transaction_id;
        if (!accessToken || !accessToken.trim() || !transaction_id || !transaction_id.trim()) {
            var result = {
                "status": 401,
                "message": 'Fields Should not be Empty'
            }
            resolve(result);
        } else {
            let emitraPaid = await emitraPayment.BillPaymentVerification(accessToken, transaction_id, lang);
            console.log("emitraPaid=====>", emitraPaid);
            var PaymentVerify = "PaymentVerify"
            // let bcsdk = await multichainsdk.addData({
            //     "key":PaymentVerify+'_'+transaction_id,
            //     "value":emitraPaid.emitraResponse
            // })
            // console.log("bcsdk=====>",bcsdk);
            resolve(emitraPaid);
        }
    })
}

/**
 * @author: Sathiyan Baskaran
 * @version: 1.0.0
 * @date: October 17, 2018
 * @Description: Function for RPP Bill Payment.
 */
function RppBillPaymentInit(req) {
    return new Promise(async(resolve, reject) => {
        var errorCode;
        const accessToken = req.headers.access_token;
        console.log("accessToken=====>", accessToken);
        var connection = await sqlQueryExec.getConnection()
        await connection.beginTransaction()
        console.log("connection===>",connection);
        const lang = req.headers.user_language ? req.headers.user_language : 'en';
        console.log("lang=====>", lang);
        var name = req.body.name;
        var mobile = req.body.mobile;
        var email = req.body.email;
        var amount = req.body.amount ? req.body.amount : 'null';
        var consumer_key = req.body.consumer_key;
        var service_id = req.body.service_id;
        var office_code = req.body.office_code;
        var lookupId = req.body.lookupId;
        var bill_type = req.body.bill_type;
        var bill_carrier = req.body.bill_carrier;
        var result;
        try{
            if (!accessToken || !accessToken.trim() || !name || !name.trim() || !mobile || !mobile.trim() || !email || !email.trim() || !amount || !amount.trim() || !consumer_key || !consumer_key.trim() || !service_id || !service_id.trim() || !office_code || !office_code.trim() || !lookupId || !lookupId.trim() || !bill_type || !bill_type.trim() || !bill_carrier || !bill_carrier.trim()) {
                errorCode = 'ERROR_F01';
                throw new Error('Fields Should not be Empty.')
            } else {
                // query assigning
                // var searchQuery = querys.findaccesstoken_access_token;
                // var findTranscationId = querys.findTranscationid;
                // var walletQuery = querys.walletQuery;
                // var addTranscation = querys.addTranscation;
                // var addTranscationMeta = querys.addTranscationMeta;
                // var updateWalletBal = querys.updateWalletBal;
                // var updateTranscationMeta = querys.updateTranscationMeta;
                // var updateTranscationStatus = querys.updateTranscationStatus;
    
                let searchQuery = await EmitraDB.searchQuery(accessToken,connection);   
                var user_id = searchQuery;
                if(!searchQuery){
                    errorCode = 'ERROR_EA00';
                    throw new Error('Invalid User')
                }else{
                    let walletQuery = await EmitraDB.walletQuery(searchQuery,connection); 
                    if(!walletQuery){
                    errorCode = 'ERROR_R26';
                    throw new Error('User Not Found')                       
                    }else{
                        var wallet_balance = walletQuery.data[0].wallet_balance;
                        var wallet_mobile = walletQuery.data[0].wallet_mobile;
                        console.log("wallet_mobile", wallet_mobile);
                        console.log("amount====>", amount);
                        if (!parseFloat(amount) || parseFloat(amount) < 1) {
                            errorCode = 'ERROR_R47';
                            throw new Error('Failed to debit money') 
                        } else if (parseFloat(wallet_balance) < parseFloat(amount)) {
                            errorCode = 'ERROR_R48';
                            throw new Error('You do not have sufficient balance')
                        } else if(parseFloat(wallet_balance) > parseFloat(amount) || parseFloat(amount) > 1){
                                    var transaction_id = uniqid.process();
                                    var reversal_transaction_reference = null;
                                    var transUser_id = user_id ? user_id : null;
                                    var transaction_type = transcationType.TRANSACTION_TYPE_NONE;
                                    var type = transcationType.TYPE_BILLPAYMENT;
                                    var sender_id = null;
                                    var reciver_id = null;
                                    var tag = '';
                                    var transaction_reference_number = null;
                                    var yes_bank_reference_number = null;
                                    var remark = '';
                                    var status = transcationType.STATUS_PENDING;
                                    var show_to_user = '1';
                                    var date_created = format('yyyy-MM-dd hh:mm:ss', new Date());
                                    // hard coded testing data
                                    // var transaction_id = uniqid();
                                    // var reversal_transaction_reference = null;
                                    // var transUser_id = user_id ? user_id : null;
                                    // var transaction_type = transcationType.TRANSACTION_TYPE_DEBIT;
                                    // var type = '1';
                                    // var sender_id = null;
                                    // var reciver_id = null;
                                    // var tag = '';
                                    // var transaction_reference_number = null;
                                    // var yes_bank_reference_number = null;
                                    // var remark = '';
                                    // var status = transcationType.STATUS_PENDING;
                                    // var show_to_user = '1';
                                    // var date_created = "2018-04-20 12:54:21";
                                    // var date_created = format('yyyy-mm-dd hh:mm:ss', new Date());
                                    var queryParam = [transaction_id, reversal_transaction_reference, transUser_id, amount, transaction_type, type, sender_id, reciver_id, tag, transaction_reference_number, yes_bank_reference_number, remark, status, show_to_user, date_created];
                                    let addTranscation = await EmitraDB.TranscationAdd(queryParam,connection);
                                    if(addTranscation){
                                          ///blockchain integration
                                          let wallettobank = await WalletToBank.WalletToBank(user_id,parseInt(amount));
                                          let bkTranscationID = wallettobank.txid;
                                          console.log("bkTranscationID=====>",bkTranscationID);
                                          if(wallettobank == 'FAILED'){
                                            errorCode = 'D01';
                                            throw new Error('transcation does not exist in blockchain...')
                                        }else{
                                            let findTranscation = await EmitraDB.findTranscationId(transaction_id,connection);
                                            if(!findTranscation){  
                                                errorCode = 'D01';
                                                throw new Error('transcation does not exist')
                                            }else{
                                                 ///blockchain integration
                                                // let wallettobank = await WalletToBank.WalletToBank(user_id,amount)
                                                // console.log("wallettobank=====>",wallettobank);   
                                                var transID = findTranscation;
                                                var queryParamMeta = [transID, bill_type, bill_carrier, service_id, consumer_key];
                                                console.log("transID====>", transID);
                                                var remaining_wallet_bal = ((parseFloat(wallet_balance).toFixed(2)) - (parseFloat(amount).toFixed(2)));
                                                console.log("remaining_wallet_bal====>", remaining_wallet_bal); 
                                                var updateWallet = [remaining_wallet_bal, user_id, mobile];
                                                let updateWalletBal = await EmitraDB.updateWalletBalance(updateWallet,connection);
                                                var transStatusParams = [bkTranscationID,transID];
                                                var updateTXID = await EmitraDB.updateTxId(transStatusParams,connection);
                                                if(!updateWalletBal && !updateTXID)  
                                                {
                                                errorCode = 'D01';
                                                throw new Error('Unable to update wallet balance')
                                                }else{
                                                    let addTranscationMeta = await EmitraDB.addTranscationMeta(queryParamMeta,connection);
                                                if(!addTranscationMeta){
                                                    errorCode = 'D01';
                                                    throw new Error('Unable to add the transcation in transcation meta table')
                                                }else{
                                                    var tagName = 'Bill Payment';
                                                    var spendMerchantCode = config.yesbankservices.spendMerchantCode;
                                                    var bankParams = [wallet_mobile, amount, tagName, transaction_id, '', spendMerchantCode, 0];
                                                    let  yesBankRes = await yesBankService.actionEmitraBillPayment(bankParams);
                                                    if(yesBankRes){
                                                        let  yesBankEncRes = await yesBankPayment.RppBillPayment(transaction_id, service_id, consumer_key, name, office_code, mobile, lookupId, amount, lang);
        
                                                        var networkResult = {
                                                            "status": 200,
                                                            "message": yesBankEncRes,
                                                            "MerchantCode":spendMerchantCode,
                                                        }
                                                        resolve(networkResult);                                    
                                                    }else{
                                                        result = {
                                                            "status": 401,
                                                            "message": "Yes Bank Payment Failed"
                                                        }
                                                        resolve(result);
                                                    }
                                                } 
                                                }                                                                                                           
                                            }
                                        }
                                    }else{
                                        errorCode = 'D01';
                                        throw new Error('Unable to add the transcation in transcation table')
                                    }
                        }
                    }    
                }
            }
            connection.commit();
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
/**
 * @author: Sathiyan Baskaran
 * @version: 1.0.0
 * @date: October 17, 2018
 * @Description: Function for RPP Bill Payment Status.
 */
 function RppBillPaymentStatus(req) {
    return new Promise(async(resolve, reject) => {
        // var res = req.body.ENCRYPT;
        var errorCode;
        const lang = req.headers.user_language ? req.headers.user_language : 'en';
        // var response = 'IXJhS4q0XnA/tJ/4lFLpvbbu3eGhdC2XAhyRy4j1o3g/OdKOxAymEGVZI6mHl06UEG+Lekb3jcQHlIwBfhnlO8jWyhk4r2hGYomJVVEA/qW2LmPvrpGl/ZelBhOHQVHVMVKJ2/PzQME94zJchsfKLmJ1JfVHPtlNVKsYSWhSWFAwxo5EK8fSgiUGtC7y+rjlw5J0vmCN0HEEe9gYuf3VbPn31TbrrlXjnfCMrBkUfyteQoHaMfa8euRzNHoWzegjM6R6EZEj/OaipY+ErY/dw6/6D9lW7gC2Oyp5e+Egs7nItydGDRSsfmUEmXh0hEeNKRW0se9vanrCQ9Ma9W70rzxLBN6eEuQebc+ZVI/PG5+7+t0Mk0zAE/KLDJ5d+p4SE1WwR4xj49RgEQA3diqBuKq4catPfW1atDpv1SPhucRkx9PQD7MNULfLz3N4aYe8FVJbyn6wTDkGIgoRJTXqtLsXVobIiQll3g/Kx/kL+flwdn63GTrpitkzXJu9pFuVI+VhqYXbHArnfZU81d1bxroLOI62/oo3c+zxN6AUyNXalZ7ZPyG63JaDA96fKLylKn91+MTeKG41TLZZ6tbOsg==';
        // var status = 'SUCCESS';
        var response = req.body.res; 
        var status = req.body.status;
        var rppSuccess = status;
        var url = eMitra.eMitraWebServicesUrl;
        var postFields = response;
        var subUrl = 'tripleDesDecryption'
        try{
            if(!lang || !lang.trim() || !response || !response.trim() || !status || !status.trim()){
                errorCode = 'ERROR_F01';
                throw new Error('Fields Should not be Empty.')
            }else{
                let networkResponse = await networkReq.RppnetworkRequestDecrypt(postFields,url,subUrl);
                var responseNet = JSON.parse(networkResponse);
                console.log("responseNet====>",responseNet);
                // var rppSuccess = status;
                var PRN = responseNet.PRN ? responseNet.PRN : '';
                console.log("responseNet.TRANSACTIONID=====>",responseNet.TRANSACTIONID);
                //transcationMeta Table update params
                var emitra_transactionid = responseNet.TRANSACTIONID;
                var emitra_receiptno = responseNet.RECEIPTNO;
                var emitra_paidamount = responseNet.PAIDAMOUNT;
                var emitra_timestamp = responseNet.EMITRATIMESTAMP;
                var payment_mode = 'Online (RPP)';
                var payment_mode_bid = responseNet.PAYMENTMODEBID;
                var payment_mode_timestamp = responseNet.PAYMENTMODETIMESTAMP;
                var emitra_status = responseNet.STATUS;
                var response_code = responseNet.RESPONSECODE;
                //hard code value for testing
                // var emitra_transactionid = "asdf123";
                // var emitra_receiptno = "12312312312312";
                // var emitra_paidamount = "20";
                // var emitra_timestamp = "asdasdasdasdas";
                // var payment_mode = 'Online (RPP)';
                // var payment_mode_bid = "asdasdasd";
                // var payment_mode_timestamp = "ASDF123123AD";
                // var emitra_status = "COMPLETE";
                // var response_code = "404";
    
    
                // Harcode Data
                // var PRN = "yijoze7b5j";
                switch(rppSuccess){
                    case "SUCCESS":
                    let emitraPaymentRes = await emitraPayment.successRppPayment(PRN,lang,emitra_transactionid,emitra_receiptno,emitra_paidamount,emitra_timestamp,payment_mode,payment_mode_bid,payment_mode_timestamp,emitra_status,response_code);
                        resolve(emitraPaymentRes);
                        break
                    case "FAILURE":
                    let emitraPaymentFailureRes = await emitraPayment.failureRppPayment(PRN,lang,emitra_transactionid,emitra_receiptno,emitra_paidamount,emitra_timestamp,payment_mode,payment_mode_bid,payment_mode_timestamp,emitra_status,response_code);
                        resolve(emitraPaymentFailureRes);
                        break  
                    case "PENDING":
                    let emitraPaymentPendingRes = await emitraPayment.failureRppPayment(PRN,lang,emitra_transactionid,emitra_receiptno,emitra_paidamount,emitra_timestamp,payment_mode,payment_mode_bid,payment_mode_timestamp,emitra_status,response_code);
                        resolve(emitraPaymentPendingRes);
                        break 
                    default:
                    var emitraDefaultRes = {
                        "status": 401,
                        "message": "Rpp Payment status not found"
                    }
                        resolve(emitraDefaultRes);
                        break
                }
            } 

        }catch(err){
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