/**
 * @author: Neelima
 * @version: 1.0.0
 * @date: October20, 2018
 * @Description: Wallet To Wallet.
 */
var request = require('request');
var config = require('config');
const mysqlConnection = require('../mysql_connection/query_execute');
const query = require('../mysql_connection/quiries');
var format = require('date-format');
var uniqid = require('uniqid');
const Utils = require('../util/utils')
const yesBankServices = require('../functions/YesBankServices/yesBankServices');
// const errMsg = require('../message/errMsg');
const transcationType = require('../message/transcationType');
var dateFormat = require('dateformat');
const walletDB = require('../functions/DBFunctions/WalletDB')
const UserDB = require('../functions/DBFunctions/UsersDB')
const BeneficiaryDB = require('../functions/DBFunctions/BeneficiaryDB');
const operationService = require('../functions/Operation/OperationServices')
const sdk = require('../sdk/query')
const walletSDK = require('../sdk/wallet')
const notification = require('./CommonFunction');
var DBConfig = require('../mysql_connection/query_execute')

const MultiWallet = require('../functions/WalletServices/WalletToBank')

const Transactiondb = require('../functions/DBFunctions/TransactionDB')
var DBConfig = require('../mysql_connection/query_execute')


module.exports = {
    fundTransfer: fundTransfer,
    ImpsTransfer: ImpsTransfer,
}

function fundTransfer(lang, userId, accessTokenModal, amount, tagName, beneficiaryMobile) {
    return new Promise(async (resolve, reject) => {
        var errorCode = 'ERROR_EA02';
        var beneficiaryWallet = await walletDB.getValidWalletByMobile(beneficiaryMobile)
        try {
            if (!beneficiaryWallet) {
                errorCode = 'ERROR_R55';
                throw new Error('Beneficiary Wallet do not exist.');
            }
            var beneficiary = await BeneficiaryDB.getValidBeneficiary(userId, 'mobile', beneficiaryMobile, ifsc_code = '')
            if (!beneficiary) {
                var beneficiaryname = await UserDB.getUserById(beneficiaryWallet.user_id)
                console.log("beneficiaryname", beneficiaryname)
                var userRapid = {};
                userRapid.user_id = userId;
                var params = {
                    user: userRapid,
                    lang: lang,
                    beneficiary_name: beneficiaryname.name,
                    identifier_type: "mobile",
                    account_number: beneficiaryMobile,
                    ifsc_code: "",
                    mobile_no: beneficiaryMobile,
                    email: ""
                }
                var addBeneficiary = await operationService.addBeneficiary(params)
                if (addBeneficiary['success'] == false) {
                    errorCode = 'ERROR_' + addBeneficiary['error']['code'];
                    throw new Error('Unable to add Beneficiary.');
                }
                var beneficiary = await BeneficiaryDB.getValidBeneficiary(userId, 'mobile', beneficiaryMobile, ifsc_code = '')
            }
        } catch (err) {
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
                "statusCode": 400
            };
            return resolve(result);
        }
        try {

            var connection = await DBConfig.getConnection()
            await connection.beginTransaction()
            var wallet = await walletDB.getValidWalletByUserId(userId)
            if (!wallet) {
                errorCode = 'ERROR_R26';
                throw new Exception('Wallet do not exist.');
            }
            console.log(wallet, "wallet")
            var walletMobile = wallet.wallet_mobile;
            if (!beneficiary) {
                errorCode = 'ERROR_R53';
                throw new Exception('Beneficiary not Found ');
            }
            var beneficiaryId = beneficiary.data[0].id;
            console.log(beneficiary.data[0].account_no, "sdasda")
            var walletReciver = await walletDB.getValidWalletByMobile(beneficiary.data[0].account_no);
            if (!wallet) {
                errorCode = 'ERROR_R26';
                throw new Exception('Wallet do not exist.');
            }
            console.log(yesBeneficiaryId, "yesBeneficiaryId")
            var yesBeneficiaryId = beneficiary.data[0].beneficiary_id;
            if (wallet.wallet_balance < amount) {
                errorCode = 'ERROR_R48';
                throw new Exception('Insufficient balance');
            }
            var transaction = await Transactiondb.addNew(userId, amount, transcationType.TRANSACTION_TYPE_DEBIT, transcationType.TYPE_FUNDTRANSFER, transcationType.STATUS_PENDING, tagName, '', null, beneficiaryId,0,"",connection);
            if (transaction == 0) {
                errorCode = 'ERROR_EA02';
                throw new Exception('Unable to create new Transaction row.');
            }
            var params = {
                "p1": walletMobile,
                "p2": amount,
                "p3": tagName,
                "p4": '',
                "p5": '',
                "p6": yesBeneficiaryId,
                "p7": '',
                "p8": ''
            }
            var yresponse = await yesBankServices.Walletvalidation(params)
            if (yresponse.message.status_code == "SUCCESS") {
                var bckey = await UserDB.getBckeyForUser(userId)
                var beneficiaryAddress = await walletDB.getValidWalletByMobile(beneficiaryMobile)
                console.log(beneficiaryAddress, "beneficiaryAddress")
                var keys = await sdk.readData(bckey)

                console.log(keys, "keys")
                var assets = await walletSDK.sendAssets(keys.response.address, beneficiaryAddress.addressess, amount, keys.response.privkey)
                console.log(assets)

                var transactionReceiver = await Transactiondb.addNew(walletReciver.user_id, amount, transcationType.TRANSACTION_TYPE_CREDIT, transcationType.TYPE_FUNDTRANSFER, transcationType.STATUS_COMPLETE, tagName,"",userId,null,1,"",connection);
                console.log("transactionReceiver", transactionReceiver)
                if (!transactionReceiver) {
                    errorCode = 'ERROR_EA02';
                    throw new Exception('Unable to create new Transaction row.');
                }
                var walletSender = await walletDB.getValidWalletByUserId(userId);
                var wallet_balance = walletSender.wallet_balance - amount;
                var updatewalletbalance = await walletDB.updateWalletBalance(wallet_balance, userId, connection);
                console.log(updatewalletbalance, "updatewalletbalance")
                var walletReceiver = await walletDB.getValidWalletByUserId(walletReciver.user_id);
                updateReceiver = walletReceiver.wallet_balance + amount;
                var receiverwalletbalance = await walletDB.updateWalletBalance(updateReceiver, userId, connection);
                console.log(receiverwalletbalance, "receiverwalletbalance")
                transaction_reference_number = yresponse.message.transaction_reference_number;
                var status = transcationType.STATUS_COMPLETE;
                var updateTransaction = await Transactiondb.updateNew(transaction_reference_number, status, assets.response, transaction,connection)
                await Transactiondb.updateNew(transaction_reference_number, status, assets.response, transactionReceiver,connection)

                if (!walletSender || !walletReceiver || !updateTransaction) {
                    errorCode = 'ERROR_EA02';
                    throw new Exception('Unable to update wallet amount.');
                }
                var requestMoney = await Transactiondb.getValidRequest(walletReciver.user_id, walletMobile, amount);

                if (requestMoney) {
                    requestMoney.request_status = Transactiondb.REQUEST_STATUS_PAID;
                    var updatetransaction = await Transactiondb.updateValidRequest(walletReciver.user_id, walletMobile, amount,connection)
                    console.log("updatetransaction", updatetransaction)
                }
                var suc = Utils.getErrorMessage(lang, yresponse.message.status_code + "_" + yresponse.message.code);
                if (yresponse.message.code == "0") {
                    suc['message'] = suc.message.replace('{amount}', amount, suc['message']);
                }
                var result = {
                    "statusReason": "OK",
                    'data': {
                        'code': suc.code,
                        'message': suc.message,
                        'status_type': '',
                        'status_popupmessage_type': ''
                    },
                    "isSuccessful": true,
                    "success": true,
                    "statusCode": 200


                };
                connection.commit();
                var player_id = await Transactiondb.getPlayerId(userId);
                if (player_id) {
                    notification_msg = Utils.getErrorMessage(lang, "FUND_TRANSFER");
                    notification_msg['message'] = notification_msg.message.replace('{name}', beneficiary.data[0].name, notification_msg['message']);
                    notification_msg['message'] = notification_msg.message.replace('{amount}', amount, notification_msg['message']);
                    nData = [notification_msg['message']];
                    var CommonHelper = await notification.sendNotification(player_id,userId, "Fund Transfer", notification_msg['message'], "SUCCESS", "1");
                }



            } else if (yresponse.message.status_code == "ERROR") {
                var suc = Utils.getErrorMessage(lang,yresponse.message.status_code + '_' + yresponse.message.code);
                var result = {
                    'success': false,
                    'error': {
                        'code': suc.code,
                        'message': suc.message,
                        'status_type': '',
                        'status_popupmessage_type': ''
                    },
                    "isSuccessful": true,
                    "success": true,
                    "statusCode": 200
                };
                connection.rollback();
                return resolve(result)
            } else {
                errorCode = 'ERROR_EA02';
                throw new Exception('error on curl REGUSER');
            }
        return resolve(result)
        } catch (err) {
            connection.rollback();
            var suc = Utils.getErrorMessage(lang, errorCode);
            var result = {
                'success': false,
                'statusCode':200,
                'error': {
                    'code': suc.code,
                    'message': suc.message,
                    'status_type': '',
                    'status_popupmessage_type': ''
                }
            };
            return resolve(result)
        }
    })

}


/**
 * @author: Neelima
 * @version: 1.0.0
 * @date: October20, 2018
 * @Description: Wallet To Bank.
 */
function ImpsTransfer(lang, userId, amount, remark, beneficiaryId) {
    return new Promise(async (resolve, reject) => {
        response = [];
        partnerReferanceNo = '';
        feeRate = 0;
        var errorCode = 'ERROR_EA02';
        var connection = await DBConfig.getConnection()
        await connection.beginTransaction()
        try{
        var wallet = await walletDB.getValidWalletByUserId(userId)
        if (!wallet) {
            errorCode = 'ERROR_R26';
            throw new Exception('Wallet do not exist.');
        }
        var beneficiary = await walletDB.Beneficiary(beneficiaryId)
        if (!beneficiary) {
            errorCode = 'ERROR_R53';
            throw new Exception('Beneficiary not Found ');
        }
        console.log(beneficiary.beneficiary_id, "dsdasdasdas")
        var yesBeneficiaryId = beneficiary.beneficiary_id;
        if (wallet.wallet_balance < amount) {
            errorCode = 'ERROR_R48';
            throw new Exception('Insufficient balance');
        }
        var transaction = await Transactiondb.addNew(userId, amount, transcationType.TRANSACTION_TYPE_DEBIT, transcationType.TYPE_IMPSTRANSFER, transcationType.STATUS_PENDING, '', remark, null, beneficiaryId,1,"",connection);
        if (transaction == 0) {
            errorCode = 'ERROR_EA02';
            throw new Exception('Unable to create new Transaction row.');
        }
        var params = {
            "p1": wallet.wallet_mobile,
            "p2": amount,
            "p3": '',
            "p4": '',
            "p5": remark,
            "p6": yesBeneficiaryId,
            "p7": feeRate,
            "p8": ''
        }
        var yresponse = await yesBankServices.WallettoBankFunc(params)
        console.log(yresponse, "yresponse")
        if (yresponse.message.status_code == "SUCCESS") {
            var assets = await MultiWallet.WalletToBank(userId,amount)
            console.log(assets)
            var walletSender = await walletDB.getValidWalletByUserId(userId);
            var wallet_balance = walletSender.wallet_balance - amount;
            var updatewalletbalance = await walletDB.updateWalletBalance(wallet_balance, userId,connection);
            var transaction_reference_number = yresponse.message.transaction_reference_number;
            var status = transcationType.STATUS_COMPLETE;
            var updateTransaction = await Transactiondb.updateNew(transaction_reference_number, status, assets.txid, transaction,connection)
            if (!walletSender || !transaction) {
                errorCode = 'ERROR_EA02';
                throw new Exception('Unable to update wallet amount.');

            }
            yresponse.message.code = yresponse.message.code == "00" ? "T00" : yresponse.message.code;
            var suc = Utils.getErrorMessage(lang, yresponse.message.status_code + "_" + yresponse.message.code)
            if (suc.code == "00") {
                connection.commit()
                suc['message'] = suc.message.replace('{amount}', amount);
                var result = {
                    "statusReason": "OK",
                    'data': {
                        'code': suc.code,
                        'message': suc.message,
                        'status_type': '',
                        'status_popupmessage_type': ''
                    },
                    "isSuccessful": true,
                    "success": true,
                    "statusCode": 200
                };
                connection.commit();
            } else if (yresponse.message.status_code == "ERROR") {
                //You can not transfer more than 2500 within 24 hours post adding new beneficiary.
                var suc = await Utils.getErrorMessage(lang, yresponse.message.status_code + "_" + yresponse.message.code);
                connection.rollBack()
                var result = {
                    'success': true,
                    'status': 200,
                    'data': {
                        'code': suc.code,
                        'message': suc.message,
                        'status_type': '',
                        'status_popupmessage_type': ''
                    }

                }
                connection.rollback();
            } else {
                errorCode = 'ERROR_EA02';
                throw new Exception('error on curl TRANSACTION');
        }
        return resolve(result)
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
            "statusCode": 200
        };
        return resolve(result);
    }
    });
}