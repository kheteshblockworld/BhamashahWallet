var request = require('request');
var config = require('config');
const getChecksum = require('../../util/generateChecksum');
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
    actionProcess: actionProcess,
    actionSuccess: actionSuccess,
    loadReversal: loadReversal,
    actionFailure: actionFailure
}
async function actionInit(req) {
    var connection = await DBConfig.getConnection()
    redirectUrl = null;
    errorCode = 'ERROR_R46';
    lang = req.headers.user_language != "" ? req.headers.user_language : 'en';
    accessToken = req.headers.access_token != "" ? req.headers.access_token : '';
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
                    var updateTransaction = await Transactiondb.updateYesBankStatus(transaction.transaction_reference_number, transaction.yes_bank_reference_number, transaction.status, transaction.transaction_id,connection);
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
                actionProcess(lang,transaction.transaction_id)
               // redirectUrl = 'payment/process/?user_language=' + lang + '&transaction_id=' + transaction.transaction_id;
            });
        });
    } catch (err) {
        console.log(err)
        var dbTransaction = await connection.rollback();
        var err = Utils.getErrorMessage(lang, "ERROR_EA02");
        if (err['code'] == 'R42') {
            err['message'] = err.message.replace('{amount}', yesAllowedAmount, err['message']);
        }
        redirectUrl = 'payment/final/?success=false&code=' + err['code'] + '&message=' + err['message'];

    }
    return this.redirect([redirectUrl]);
}

async function actionProcess(lang,transaction_id) {
   // lang = req.headers.user_language != "" ? req.headers.user_language : 'en';
    transaction = await Transactiondb.getTransaction(transaction_id);
    if (!transaction || transaction.transaction_id == '') {
        err = Utils.getErrorMessage('ERROR_R46', lang);
        return this.redirect(['payment/final/?success=false&code=' + err['code'] + '&message=' + err['message']]);
    }
    user = await UserDB.getUserById([transaction.user_id]);
    merchantCode = config.get('rppMerchantCode')
    checksumKey = config.get('rppChecksumKey')
    pnr = transaction.transaction_id;
    amount = transaction.amount;
    checksum = getChecksum.generateCheckSum(merchantCode, pnr, amount, checksumKey);
    var date_created = format('yyyy-MM-dd hh:mm:ss', new Date());
    data = {
        "rppUrl": config.get('rppUrl'),
        "merchantCode": config.get('rppMerchantCode'),
        "prn": pnr,
        "amount": amount,
        "reqTimestamp": date('YmdHisv', strtotime(transaction.date_created)),
        "purpose": 'loading money',
        "userName": user.name,
        "userMobile": user.wallet.wallet_mobile,
        "userEmail": user.email,
        "checksum": checksum
    };
    return this.renderPartial('form', data);
}

async function actionSuccess() {
    redirectUrl = null;
    errorCode = 'ERROR_R46';
    get = app.request.get();
    lang = ('user_language' in get) ? get['user_language'] : 'en';
    post = app.request.post();
    await connection.beginTransaction()
    try {
        pnr = ('PRN' in post) ? post['PRN'] : '';
        transaction = Transactiondb.getTransaction([pnr]);
        if (empty(transaction) || transaction.transaction_id == '') {
            $errorCode = 'ERROR_R46';
            throw new Exception('Transaction not found post RPP');
        }
        if (('STATUS' in post) && post['STATUS'] == 'SUCCESS') {
            transaction.status = transcationType.STATUS_COMPLETE;
            var statusUpdates = await Transactiondb.statusUpdate(transaction.transaction_id, transaction.status)
            if (!transaction) {
                errorCode = 'ERROR_R46';
                throw new Exception('Transaction not updated post RPP');
            }
            wallet = walletDB.getValidWalletByUserId(transaction.user_id);
            wallet.wallet_balance = wallet.wallet_balance + transaction.amount;
            var updatewalletbalance = await walletDB.updateWalletBalance(wallet.wallet_balance, wallet.user_id, wallet.wallet_mobile);
            if (!wallet) {
                errorCode = 'ERROR_R46';
                throw new Exception('Wallet not updated post RPP');
            }
            await transactiondb.addMetaTransaction(transaction.id, post['RPPTXNID'], post['PAYMENTMODE'], post['PAYMENTMODEBID'], post['STATUS'])
            err = Utils.getErrorMessage('SUCCESS_M10', lang);
            redirectUrl = 'payment/final/?success=true&code=' + err['code'] + '&message=' + err['message'] + '&transaction_id=' + transaction.transaction_id;
        } else {
            response = paymentController.loadReversal(transaction);
            if (response == false) {
                errorCode = 'ERROR_R46';
                throw new Exception('Load reversal failed post RPP FAILED');
            }
            dbTransaction = config.commit();
        }
    } catch (err) {
        var dbTransaction = await connection.rollback();
        var err = Utils.getErrorMessage(errorCode, lang);
        redirectUrl = 'payment/final/?success=false&code=' + err['code'] + '&message=' + err['message'];
        return this.redirect([redirectUrl]);

    }
}

async function actionFailure() {
    redirectUrl = null;
    errorCode = 'ERROR_R46';
    lang = ('user_language' in get) ? get['user_language'] : 'en';
    await connection.beginTransaction()
    try {
        if (('STATUS' in post) || post['STATUS'] != 'FAILED') {
            $errorCode = 'ERROR_R46';
            throw new Exception('Not Received Success from RPP FAILED');
        }
        transaction = Transactiondb.getTransactionbyId([get['transaction_id']]);
        if (empty(transaction) || transaction.transaction_id == '') {
            err = Utils.getErrorMessage('ERROR_R46', lang);
            return this.redirect(['payment/final/?success=false&code=' + err['code'] + '&message=' + err['message']]);
        }
        transaction.status = transcationType.STATUS_FAILED;
        var transaction = await Transactiondb.statusUpdate(transaction.transaction_id, transaction.status)
        if (!transaction) {
            errorCode = 'ERROR_R46';
            throw new Exception('Transaction not updated post RPP');
        }
        await transactiondb.addMetaTransaction(transaction.id, post['RPPTXNID'], post['PAYMENTMODE'], post['PAYMENTMODEBID'], post['STATUS'])
        response = paymentController.loadReversal(transaction);
        if (response == false) {
            errorCode = 'ERROR_R46';
            throw new Exception('Load reversal failed post RPP FAILED');
        }
        dbTransaction = config.commit();

    } catch (err) {
        var dbTransaction = await connection.rollback();
        var err = Utils.getErrorMessage(errorCode, lang);
        redirectUrl = 'payment/final/?success=false&code=' + err['code'] + '&message=' + err['message'];
        return this.redirect([redirectUrl]);

    }

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

            yesBankServices.loadReversal(wallet.wallet_mobile, transaction.transaction_id, 'Load Money Failed Reversal', transactionReversal.transaction_id, function (err, yesBankRes) {

                yesBankRes = yesBankRes.message
                if (("status_code" in yesBankRes) && yesBankRes.status_code == "SUCCESS" && yesBankServices.code == "0") {
                    var transRes = transactionDB.updateBankStatus(
                        yesBankRes.transaction_reference_number,
                        yesBankRes.yes_bank_reference_number,
                        constants.STATUS_COMPLETE,
                        transaction.transactionReversal, connection)
                    if (!transRes) {
                        throw new Error('Load Reversal Transaction not updated post RPP');
                    }
                    resolve(false);
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