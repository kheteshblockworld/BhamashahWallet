/**
 * @author: Neelima
 * @version: 1.0.0
 * @date: January2, 2019
 * @Description: emitraController.
 */
var date = require('date-and-time')
const Utils = require('../util/utils')
const transcation = require('../message/transcationType');
var DBConfig = require('../mysql_connection/query_execute');
const generateHash= require('../util/generateHash');
const transactionDB = require('../functions/DBFunctions/TransactionDB')
const EmitraDB = require('../functions/DBFunctions/emitraDB');
const walletDB = require('../functions/DBFunctions/WalletDB');
var constants = require('../message/transcationType');
var config = require('config');
var eMitra = config.get('eMitra');
const networkReq = require('../util/networkFormAdapter');
const yesBankServices = require('../functions/YesBankServices/yesBankServices');
module.exports = {
    actionVerifyTransaction:actionVerifyTransaction,
    failure:failure,
    spendRevarsal:spendRevarsal
}
async function actionVerifyTransaction() {
    let now = new Date();
    var minuteBefore  = date.addMinutes(now, -15); 
    var dateEarliest = date.addHours(now, -48);  
    try {
      var transactions = await transactionDB.scloadReversal([transcation.TYPE_BILLPAYMENT,transcation.STATUS_PENDING, "2018-10-17 16:13:00","2018-06-14 07:15:40"])
         
    //   transactions.forEach (async (singleTransaction)=> {
        for (let i = 0; i < transactions.length; i++){
          response = await failure(transactions[i]);
        if(response == TRUE){
            transactions[i].transaction_id;
        }
        else{
            //send Failed to Email
            transactions[i].transaction_id;
        }

    }
    }catch (err){

    }
}
async function failure(singleTransaction){
    var connection = await DBConfig.getConnection()
    await connection.beginTransaction()
    try {
        status ='PENDING';
        var transaction = await transactionDB.getTransactionbyId(singleTransaction.id);
        console.log(transaction.status,"transaction")
        if(transaction.status == transcation.STATUS_PENDING){
            transactionMeta = await EmitraDB.selectTranscationMeta(transaction.id);
            if(transaction.transaction_type == 0){
                response = await verifyTransactionbackToback(transaction.transaction_id,transactionMeta.data[0].service_id);
                status = response['TRANSACTIONSTATUS'];
            }
            else{
                response = await verifyTransaction(transaction.transaction_id,transactionMeta.data[0].service_id);
                status = response['STATUS'];
            }
            if(status == "SUCCESS"){
                transaction.status = transcation.STATUS_COMPLETE;
                var transaction= await transactionDB.statusUpdate(transaction.status,transaction.transaction_id,connection)
                if (!transaction){ 
                    throw new Exception('Transaction not updated.'); 
                }
                responseBit = true;
            }  else if(status == "PENDING"){
                //still pending
                responseBit = false;
            }
            else{
                transaction.status = transcation.STATUS_FAILED;
                var transaction= await transactionDB.statusUpdate(transaction.status,transaction.transaction_id,connection)
                if (!transaction){ 
                    throw new Exception('Transaction not updated.'); 
                }
                //reversal
                if(transaction.transaction_type == 0){
                    response = await spendReversal(transaction);
                    if(response == false ){
                        throw new Exception('Load reversal failed post RPP FAILED'); 
                    }
                }
                responseBit = true;
            }
            connection.commit();
        
        }
    }catch(err){
        responseBit = false;
        connection.rollBack();
    }
    return responseBit
}
async function spendRevarsal(transaction){
    wallet = await WalletDB.getValidWalletByUserId(transaction.user_id);
    walletUpdate= wallet.wallet_balance + transaction.amount;
    var wallet = await walletDB.updateWalletBalance(walletUpdate,transaction.user_id,connection);
    if(!wallet){
        throw new exception('wallet not saved')
    }
    var transactionReversal = await transactionDB.addNew(transaction.user_id,
        transaction.amount,
        constants.TRANSACTION_TYPE_CREDIT,
        constants.TYPE_SPENDREVERSAL,
        constants.STATUS_PENDING,
        "",
        "",
        null,
        null,
        0,
        transaction.transaction_id, connection)
        if (!transactionReversal) {
            throw new Error('Unable to Save spend Reversal Transaction');
        }
        var params={
            "p1": wallet.wallet_mobile,
            "p2": "",
            "p3": "",
            "p4": transaction.transaction_id,
            "p5": 'bill payment failed',
            "p6": "",
            "p7": "",
            "p8": transactionReversal.transaction_id
            }
        yresponse = await yesBankServices.spendReversal(params);
        if(isset(yresponse['status_code']) && yresponse['status_code'] == 'SUCCESS' && yresponse['code'] == '0'){
            transactionReversal.transaction_reference_number = yresponse['transaction_reference_number'];
            transactionReversal.yes_bank_reference_number = yresponse['yes_bank_reference_number'];
            transactionReversal.status = Transcation.STATUS_COMPLETE;
            var transactionReversal = transactionDB.updateBankStatus(
                yesBankRes.transaction_reference_number,
                yesBankRes.yes_bank_reference_number,
                constants.STATUS_COMPLETE,
                transaction.transactionReversal, connection)
            if (!transactionReversal){
                throw new Exception('spend Reversal Transaction not updated'); 
            }
            return true;
        }
        else{
            throw new Exception('Yes spend Reversal API Failed');
        }
        return false;
}
async function verifyTransaction(transactionId, serviceId){
    var postFields = {
        'MERCHANTCODE':"BHAMAWALLET",
        'SERVICEID':serviceId,
        'PRN':transactionId
     
    }
    var url = eMitra.eMitraWebServicesUrl;
    var subUrl = 'newAggrTransVerify'


    let networkResponse = await generateHash.generateHash(JSON.stringify(postFields),url,subUrl);
     var res = await generateHash.decryptHash(networkResponse);
     return JSON.parse(res)
}

async function verifyTransactionbackToback(transactionId,serviceId){
    var dataString = {
        'MERCHANTCODE':DBConfig.get('eMitraMerchantCode'),
        'REQUESTID':transactionId,
        'SSOTOKEN':'0'
     
    }
    generateHash.generateHash(JSON.stringify(dataString))
    
    return emitraServices.curlVerifyTransactionService(serviceId,transactionId);
}