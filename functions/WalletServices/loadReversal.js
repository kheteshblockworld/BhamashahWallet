/**
 * @author: Rakesh C
 * @version: 1.0.0
 * @date: October 22, 2018
 * @Description: Generate will intract with wallet SDK to create Wallet.
 */

const Utils = require('../../util/utils')
var date = require('date-and-time')
const transactionDB = require('../DBFunctions/TransactionDB')
const rppService = require('../rppServices')
const walletDB = require('../DBFunctions/WalletDB')

var mysql = require('mysql');
var config = require('config'); 

var constants = require('../../message/transcationType');
var yesBankServices = require('../YesBankServices/yesBankServices')
var DBConfig = require('../../mysql_connection/query_execute')



module.exports = {
    loadReversalAction: loadReversalAction
}


async function loadReversalAction(lang, userId) {

    var response = {};
    var errorCode = "ERROR_LR4";

    try {
        let now = new Date();

        let calDate = date.addMinutes(now, -15);
        console.log(calDate)
        var transaction = await transactionDB.loadReversalStatus(userId, Utils.dateFormate(calDate))
        console.log(transaction)
        if (!transaction) {
            var getErrMsg = Utils.getErrorMessage(lang, "SUCCESS_SA11")
            response = {
                'success': true,
                'statusCode': 200,
                'data': {
                    'code': getErrMsg.code,
                    'message': getErrMsg.message,
                    'status_type': '',
                    'status_popupmessage_type': ''
                },
            };
            return response;
        } else {
            var res = await failure(transaction)
            if (res != true) {
                throw new Error("load reversal failed")
            }

            transaction = await transactionDB.getTransaction(transaction.transaction_id)

            if (transaction.status == constants.STATUS_COMPLETE) {
                errorCode = "SUCCESS_M10"
            } else {
                errorCode = "SUCCESS_LR0"
            }
            var getErrMsg = Utils.getErrorMessage(lang, errorCode)
            response = {
                "success": true,
                "statusCode": 200,
                'data': {
                    'code': getErrMsg.code,
                    'message': getErrMsg.message,
                    'status_type': '',
                    'status_popupmessage_type': ''
                }
            }
        }
    } catch (err) {
        console.error(err)
        var getErrMsg = Utils.getErrorMessage(lang, errorCode)
        response = {
            'success': true,
            'statusCode': 200,
            'data': {
                'code': getErrMsg.code,
                'message': getErrMsg.message,
                'status_type': '',
                'status_popupmessage_type': ''
            },
        };
    }
    return response
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
                constants.TRANSACTION_TYPE_CREDIT,
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

