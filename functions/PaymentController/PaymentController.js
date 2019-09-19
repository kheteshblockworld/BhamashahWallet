/**
 * @author:Neelima Rani Rakesh
 * @version: 1.0.0
 * @date: October 22, 2018
 * @Description: Generate will intract with wallet SDK to create Wallet.
 */

var request = require('request');
var config = require('config');
const getChecksum = require('../../util/generateHash');
const DBConfig = require('../../mysql_connection/query_execute');
const AccessTokenDB = require('../DBFunctions/AccessTokenDB')
const query = require('../../mysql_connection/quiries');
var format = require('date-format');
var uniqid = require('uniqid');
const Utils = require('../../util/utils')
const paymentController = require('./PaymentController')
const yesBankServices = require('../YesBankServices/yesBankServices');
// const errMsg = require('../message/errMsg');
const transcationType = require('../../message/transcationType');
var dateFormat = require('dateformat');
const walletDB = require('../DBFunctions/WalletDB')
const UserDB = require('../DBFunctions/UsersDB')

const Transactiondb = require('../DBFunctions/TransactionDB')
const loadMoneys = require('../../functions/WalletServices/loadMoneyToWallet')

module.exports = {
    actionInit: actionInit,
    actionTransaction: actionTransaction
}

async function actionInit(req) {
    var connection = await DBConfig.getConnection()
    var response = "";
    var yesAllowedAmount = "";
    var errorCode = 'ERROR_R46';
    var lang = req.headers.user_language != "" ? req.headers.user_language : 'en';
    var accessToken = req.headers.access_token != "" ? req.headers.access_token : '';
    var userId = await AccessTokenDB.checkAccessTokenGetID(accessToken)
    yesAllowedAmount = 0.00;
    await connection.beginTransaction()
    try {
        if (userId == false) {
            errorCode = 'ERROR_EA00';
            throw new Error('Invalid User.');
        }
        var amount = (req.body.Amount) ? req.body.Amount : 0;
        if (amount == 0) {
            errorCode = 'ERROR_R46';
            throw new Error('Invalid Amount.');
        }
        wallet = await walletDB.getValidWalletByUserId(userId);
        if (!wallet) {
            errorCode = 'ERROR_R26';
            throw new Error('Invalid Wallet.');
        }
        var transaction = "";
        yesBankServices.curlWalletBalance(wallet.wallet_mobile, async function (YesBankresult) {
            if (YesBankresult.message.status_code != "" && YesBankresult.message['status_code'] == 'SUCCESS') {
                if (YesBankresult.message['remaining_load_limit'] < amount) {
                    errorCode = 'ERROR_R09';
                    throw new Error('Monthly load limit breached.');
                }
                transaction = await Transactiondb.addNew(userId, amount, transcationType.TRANSACTION_TYPE_CREDIT, transcationType.TYPE_LOAD, transcationType.STATUS_PENDING, connection);
                if (!transaction) {
                    errorCode = 'ERROR_R46';
                    throw new Error('Unable to Save Transaction');
                }
                // All Success till here
            } else if (YesBankresult.status_code != "" && YesBankresult.message['status_code'] == 'ERROR') {
                // handle user not found 
                //generic message in response below
                errorCode = 'ERROR_R46';
                throw new Error('Yes API Code Error');
            } else {
                // handle failure 
                //generic message in response below
                errorCode = 'ERROR_R46';
                throw new Error('Yes API Failed');
            }
            var params = {
                "p1": wallet.wallet_mobile,
                "p2": transaction.amount,
                "p3": 'loading money',
                "p4": transaction.transaction_id,
                "p5": ''
            }

            yesBankServices.curlLoadMoneyToWallet(params, async function (yresponse) {

                if (yresponse.message.status_code != "" && yresponse.message['status_code'] == 'SUCCESS' && yresponse.message['code'] == 'M10') {
                    var address = await walletDB.getValidWalletByMobile(params.p1)
                    console.log(address, "address")

                    var assets = await loadMoneys.loadMoney(address.addressess, params.p2)
                    console.log(assets)

                    transaction.transaction_reference_number = yresponse.message['transaction_reference_number'];
                    transaction.yes_bank_reference_number = yresponse.message['yes_bank_reference_number'];
                    transaction.status = transcationType.STATUS_PROCESSING;
                    var updateTransaction = await Transactiondb.updateYesBankStatus(transaction.transaction_reference_number, transaction.yes_bank_reference_number, transaction.status, transaction.transaction_id, connection);
                    if (!updateTransaction) {
                        errorCode = 'ERROR_R46';
                        throw new Error('Unable to update Transaction.');
                    }
                } else {
                    if (yresponse.message['code'] == 'R42') {
                        yesAllowedAmount = trim(yresponse.message.replace('Exceeded max user balance, allowed only INR', '', yresponse.message['message']));
                    }
                    errorCode = (yresponse.message['code'] != "" ? 'ERROR_' + yresponse.message['code'] : 'ERROR_R46');
                    throw new Error('Yes Load Money API Return Error.');
                }
                dbTransaction = await connection.commit();
                response = await actionProcess(lang, transaction.transaction_id)
                console.log(response)
                return response
                // redirectUrl = 'payment/process/?user_language=' + lang + '&transaction_id=' + transaction.transaction_id;
            });
        });

    } catch (err) {
        console.log(err)
        await connection.rollback();
        response = actionFinal(lang, errorCode)
        if (errorCode == "ERROR_R42") {
            message = response.data.message.replace('{amount}', yesAllowedAmount);
            var response = {
                'success': true,
                'statusCode': 200,
                'data': {
                    'code': response.data.code,
                    'message': message,
                    'status_type': '',
                    'status_popupmessage_type': ''
                },
            };
            return response
            //redirectUrl = 'payment/final/?success=false&code=' + err['code'] + '&message=' + err['message'];
        }
        return response
    }
}

async function actionProcess(lang, transaction_id) {
    // lang = req.headers.user_language != "" ? req.headers.user_language : 'en';
    transaction = await Transactiondb.getTransaction(transaction_id);
    if (!transaction || transaction.transaction_id == '') {
        return actionFinal(lang, 'ERROR_R46')
        //return this.redirect(['payment/final/?success=false&code=' + err['code'] + '&message=' + err['message']]);
    }
    user = await UserDB.getUserById([transaction.user_id]);
    rppServices = config.get('rppServices')
    checkSum = getChecksum.generateCheckSum(rppServices.merchantCode, transaction.transaction_id, transaction.amount, rppServices.rppChecksumKey);
    // var date_created = format('yyyy-MM-dd hh:mm:ss', new Date());

    var data = {
        "MERCHANTCODE": rppServices.rppMerchantCode,
        "PRN": transaction.transaction_id,
        "REQTIMESTAMP": Date.now(),
        "PURPOSE": "",
        "AMOUNT": transaction.amount,
        "SUCCESSURL": "",
        "FAILUREURL": "",
        "CANCELURL": "",
        "USERNAME": user.name,
        "USERMOBILE": user.sso_mobile,
        "USEREMAIL": user.email,
        "UDF1": "",
        "UDF2": "",
        "UDF3": "",
        "OFFICECODE": "",
        "REVENUEHEAD": "",
        "CHECKSUM": checkSum
    }

    var enyData = await getChecksum.generateHash(JSON.stringify(data))
    console.log("enyData", enyData)
    var res = {
        'success': true,
        'statusCode': 200,
        'data': {
            'code': "SUCCESS",
            'message': "Process the Payment ",
            "URL": rppServices.rppUrl,
            "MerchantCode": rppServices.rppMerchantCode,
            "EnData": enyData,
            'status_type': '',
            'status_popupmessage_type': ''
        },
    };
    return res;
}

async function actionTransaction(req) {
    lang = req.headers.user_language != "" ? req.headers.user_language : 'en';
    postJson = await getChecksum.decryptHash(req.body['ENCDATA']);
    postData = JSON.parse(postJson);

    switch (postData.STATUS) {
        case "SUCCESS":
            var res = await actionSuccess(lang, postData)
            return res
        case "FAILURE":
            var res = await actionFailure(lang, postData)
            return res
        case "CANCLE":
            var res = await actionCancel(lang, postData)
            return res
        default:
            var res = {}
            return res
    }
}

async function actionSuccess(lang, req) {
    errorCode = 'ERROR_R46';
    // lang = req.headers.user_language != "" ? req.headers.user_language : 'en';
    var connection = await DBConfig.getConnection()
    await connection.beginTransaction()

    try {
        pnr = req.PRN ? req['PRN'] : '';
        transaction = await Transactiondb.getTransaction(pnr);
        if (!transaction || transaction.transaction_id == '') {
            $errorCode = 'ERROR_R46';
            throw new Exception('Transaction not found post RPP');
        }

        if (req && req.STATUS == 'SUCCESS') {
            var statusUpdates = await Transactiondb.statusUpdate(transaction.transaction_id, transcationType.STATUS_COMPLETE, connection)
            if (!statusUpdates) {
                errorCode = 'ERROR_R46';
                throw new Exception('Transaction not updated post RPP');
            }

            wallet = await walletDB.getValidWalletByUserId(transaction.user_id);
            wallet_balance = wallet.wallet_balance + transaction.amount;
            var updatewalletbalance = await walletDB.updateWalletBalance(wallet_balance, wallet.user_id, connection);
            if (!updatewalletbalance) {
                errorCode = 'ERROR_R46';
                throw new Exception('Wallet not updated post RPP');
            }

            await Transactiondb.addMetaTransaction(transaction.id, req['RPPTXNID'], req['PAYMENTMODE'], req['PAYMENTMODEBID'], req['STATUS'],connection)
            connection.commit();
            return actionFinal(lang,"SUCCESS_M10")
            //  redirectUrl = 'payment/final/?success=true&code=' + err['code'] + '&message=' + err['message'] + '&transaction_id=' + transaction.transaction_id;
        } else {
            response = loadReversal(transaction,connection);
            if (response == false) {
                errorCode = 'ERROR_R46';
                throw new Exception('Load reversal failed post RPP FAILED');
            }
        }
    } catch (err) {
        connection.rollback();        
//      redirectUrl = 'payment/final/?success=false&code=' + err['code'] + '&message=' + err['message'];
        return actionFailure(lang,errorCode);
    }
}

async function actionFailure(lang, req) {
    errorCode = 'ERROR_R46';
    var connection = await DBConfig.getConnection();
    await connection.beginTransaction()
    try {
        if (!req && req.STATUS != 'FAILURE') {
            $errorCode = 'ERROR_R46';
            throw new Exception('Not Received Success from RPP FAILED');
        }

        pnr = req.PRN ? req['PRN'] : '';
        transaction = await Transactiondb.getTransaction(pnr);

        if (!transaction || transaction.transaction_id == '') {
            // err = Utils.getErrorMessage('ERROR_R46', lang);

            return this.redirect(['payment/final/?success=false&code=' + err['code'] + '&message=' + err['message']]);
        }

        var updateTransaction = await Transactiondb.statusUpdate(transaction.transaction_id, transcationType.STATUS_FAILED, connection);
        if (!updateTransaction) {
            errorCode = 'ERROR_R46';
            throw new Exception('Transaction not updated post RPP');
        }

        await Transactiondb.addMetaTransaction(transaction.id, req['RPPTXNID'], req['PAYMENTMODE'], req['PAYMENTMODEBID'], req['STATUS'], connection);
        response = await loadReversal(transaction, connection);
        if (response == false) {
            errorCode = 'ERROR_R46';
            throw new Exception('Load reversal failed post RPP FAILED');
        }

        dbTransaction = config.commit();

    } catch (err) {
        await connection.rollback();
    }
    response = actionFinal(lang, errorCode)
    response.data['transactionId'] = transaction.transaction_id
    return response

   // redirectUrl = 'payment/final/?success=false&code=' + err['code'] + '&message=' + err['message'];
//return this.redirect([redirectUrl]);
}

async function loadReversal(transaction, connection) {
    return new Promise(async (resolve) => {

        try {
            var wallet = await walletDB.getValidWalletByUserId(transaction.user_id)
            var transactionReversal = await Transactiondb.addNew(transaction.user_id,
                transaction.amount,
                transcationType.TRANSACTION_TYPE_CREDIT,
                transcationType.TYPE_LOADREVERSAL,
                transcationType.STATUS_PENDING,
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
                    var transRes = Transactiondb.updateYesBankStatus(
                        yesBankRes.transaction_reference_number,
                        yesBankRes.yes_bank_reference_number,
                        transcationType.STATUS_COMPLETE,
                        transactionReversal,
                        connection)

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

async function actionCancel(lang, req) {
    errorCode = 'ERROR_R46';
    var connection = await DBConfig.getConnection();
    await connection.beginTransaction()

    try {
        if (!req['STATUS'] || req['STATUS'] != 'FAILED') {
            $errorCode = 'ERROR_R46';
            throw new Error('Not Received Success from RPP FAILED');
        }

        pnr = req.PRN ? req['PRN'] : '';
        transaction = await Transactiondb.getTransaction(pnr);
        if (!transaction || transaction.transaction_id == '') {
            $errorCode = 'ERROR_R46';
            throw new Error('Transaction not found post RPP FAILED');
        }

        var updateTransaction = await Transactiondb.statusUpdate(transaction.transaction_id, transcationType.STATUS_CANCELED, connection);
        if (!updateTransaction) {
            $errorCode = 'ERROR_R46';
            throw new Error('Transaction not updated post RPP FAILED');
        }

        // $transactionLoadMeta =new TransactionLoadMeta();
        // $transactionLoadMeta->transaction_id = $transaction->id;
        // $transactionLoadMeta->rpp_txn_id = $post['RPPTXNID'];
        // $transactionLoadMeta->payment_mode = $post['PAYMENTMODE'];
        // $transactionLoadMeta->payment_mode_bid = $post['PAYMENTMODEBID'];
        // $transactionLoadMeta->rpp_txn_status = $post['STATUS'];
        // $transactionLoadMeta->save();

        await Transactiondb.addMetaTransaction(transaction.id, req['RPPTXNID'], req['PAYMENTMODE'], req['PAYMENTMODEBID'], req['STATUS'], connection);

        response = loadReversal(transaction, connection);
        if ($response == false) {
            $errorCode = 'ERROR_R46';
            throw new Error('Load reversal failed post RPP FAILED');
        }
        connection.commit();
    } catch (err) {
        connection.rollBack();
    }
    response = actionFinal(lang, errorCode)
    response.data['transactionId'] = transaction.transaction_id
    return response
    // $redirectUrl = 'payment/final/?success=false&code='.$err['code'].'&message='.$err['message'].'&transaction_id='. $transaction->transaction_id; 
    //return $this->redirect([$redirectUrl]);
}

async function actionFinal(lang, errorCode) {
    var getErrMsg = Utils.getErrorMessage(errorCode, lang);
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
    return response
}