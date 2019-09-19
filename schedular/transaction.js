/**
 * @author: Harinishree M
 * @version: 1.0.0
 * @date: Jan 3 2019
 * @Description: Generate will intract with wallet SDK to create Wallet.
 */

const Utils = require('../util/utils')
var date = require('date-and-time')
const transactionDB = require('../functions/DBFunctions/TransactionDB')
const rppService = require('../functions/rppServices')
const walletDB = require('../functions/DBFunctions/WalletDB')


var mysql = require('mysql');
var config = require('config'); 

var constants = require('../message/transcationType');
var yesBankServices = require('../functions/YesBankServices/yesBankServices')
var DBConfig = require('../mysql_connection/query_execute')

module.exports = {
    actionProcessingTransaction:actionProcessingTransaction,
    failure:failure
}

async function actionProcessingTransaction(){
    try{
        
        let now = new Date();
        var dateformat = date.addMinutes(now,-15)
        var date_created = Utils.dateFormate(dateformat);
        console.log("date_created",date_created)
        var dateearlierformat = date.addHours(now, -100);
        var dateEarliest  = Utils.dateFormate(dateearlierformat);
        console.log("dateEarliest",dateEarliest)
        var transaction = await walletDB.loadreversalfind(["load","PENDING",dateEarliest,date_created])
        console.log("transaction",transaction.data.length)
        for(let i=0;i<=transaction.data.length;i++){
            transactiondata = transaction.data[i]
            console.log("transactiondata",transactiondata)
            var failureres = await failure(transactiondata)
            console.log("failureres",failureres)
            if(failureres==true){
                console.log(transactiondata.transaction_id,"true")
            }
            else {
                console.log(transactiondata.transaction_id,"false")
            }
        }


        
    }
    catch(err){
        console.log("err",err)
        throw new Error("error")
    }
}

async function failure(transaction) {

    var response = false;
    var connection = await DBConfig.getConnection()
    console.log(connection.threadId)
    await connection.beginTransaction()
    
    try {
        if (transaction.status = "PROCESSING") {

            var rppResponse = await rppService.verifyTransaction(transaction.transaction_id, transaction.amount)
            rppResponse = JSON.parse(rppResponse);

            if (("STATUS" in rppResponse)) {
                var status = rppResponse['STATUS']
                //TODO change as "SUCCESS"
                if (status == "SUCCESS") {
                    var wallet = await walletDB.getValidWalletByUserId(transaction.user_id)
                    var wallet_balance = wallet.wallet_balance + transaction.amount
                    var update_balance = await walletDB.updateWalletBalance(wallet_balance,
                        transaction.user_id, connection)
                    if (!update_balance) {
                        errorCode = "ERROR_R46"
                        throw new Error("Wallet not updated post Rpp")
                    }
                    await transactionDB.addMetaTransaction(transaction.id,
                        rppResponse.RPPTXNID,
                        rppResponse.PAYMENTMODE,
                        rppResponse.PAYMENTMODEBID,
                        rppResponse.STATUS, connection)
                    var trans_status = await transactionDB.statusUpdate(transaction.transaction_id,
                        constants.STATUS_COMPLETE, connection)
                    if (!trans_status) {
                        throw new Error("Transaction not updated post Rpp")
                    }
                    response = true;
                } else if (status == "PENDING") {
                    response = false;
                } else {
                    //  var checkKey = Object.getOwnPropertyDescriptor(rppResponse, 'RPPTXNID');
                    //TODO change conditions "FAILED" remove !
                    if (status == "NOTAVAILABLE" && ("RPPTXNID" in rppResponse)) {
                        await transactionDB.addMetaTransaction(transaction.id,
                            rppResponse.RPPTXNID,
                            rppResponse.PAYMENTMODE,
                            rppResponse.PAYMENTMODEBID,
                            rppResponse.STATUS, connection)
                    }
                    var trans_status = await transactionDB.statusUpdate(transaction.transaction_id,
                        constants.STATUS_FAILED, connection)
                    if (!trans_status) {
                        throw new Error("Transaction not updated post Rpp")
                    }
                    var res = await loadReversal(transaction, connection)
                    if (!res) {
                        throw new Error('Load reversal failed post RPP FAILED');
                    }
                    response = true;
                }
            }
            connection.commit(function (err) {
                if (err) {
                    return connection.rollback();
                }
                console.log('success!');
            });
        }
    } catch (err) {
        console.error(err)
        console.log(connection.threadId)
        await connection.rollback()
        await connection.end();
    }
    return response
}


async function loadReversal(transaction, connection) {
    return new Promise(async (resolve) => {

        try {
            var wallet = await walletDB.getValidWalletByUserId(transaction.user_id)
            var transactionReversal = await transactionDB.addNew(transaction.user_id,
                transaction.amount,
                constants.TRANSACTION_TYPE_DEBIT,
                constants.TYPE_LOADREVERSAL,
                constants.STATUS_PENDING,
                "",
                "",
                null,
                null,
                0,
                transaction.transaction_id, connection)
            if (!transactionReversal) {
                throw new Error('Unable to Save Load Reversal Transaction');
            }

            yesBankServices.loadReversal(wallet.wallet_mobile, transaction.transaction_id, 'Load Money Failed Reversal', transactionReversal, function (err, yesBankRes) {
                yesBankRes = yesBankRes.message
                if (yesBankRes.status_code && yesBankRes.status_code == "SUCCESS" && yesBankRes.code == "0") {
                    var transRes = transactionDB.updateYesBankStatus(
                        yesBankRes.transaction_reference_number,
                        yesBankRes.yes_bank_reference_number,
                        constants.STATUS_COMPLETE,
                        transactionReversal, connection)
                    if (!transRes) {
                        throw new Error('Load Reversal Transaction not updated post RPP');
                    }
                    resolve(true);
                } else {
                    throw new Error('Yes Load Reversal API Failed post RPP');
                }
            })
        } catch (err) {
            console.error(err);
            resolve(false);
        }
    })

}