/**
 * @author: Rakesh C
 * @version: 1.0.0
 * @date: October 22, 2018
 * @Description: Generate will intract with wallet SDK to create Wallet.
 */

const multichianWallet = require('./generateKeys');
const Utils = require('../../util/utils')
const walletDB = require('../DBFunctions/WalletDB')
const usersDB = require('../DBFunctions/UsersDB')
const YesBankServices = require('../YesBankServices/yesBankServices')

const wallet = require('../../sdk/wallet');
const bcSdk = require('../../sdk/invoke');
var DBConfig = require('../../mysql_connection/query_execute')


module.exports = {
    createWallet: createWallet,
    verifyMotp: verifyMotp
}


async function createWallet(Lang, userID, WalletNumber) {
    return new Promise(async (resolve, reject) => {

        var wallet = await walletDB.getValidWalletByMobile(WalletNumber)
        if (!wallet) {
            var wallet = await walletDB.getValidWalletByUserId(userID)
            if (!wallet) {
                var connection = await DBConfig.getConnection()
                await connection.beginTransaction()
                try {
                    var user = await walletDB.checkWalletByID(userID)
                    if (!user) {
                        var user = await walletDB.addUserInWallet([userID, WalletNumber, 'NEW_USER', Utils.getCurrentTime()], connection)
                        if (!user) {
                            throw new Error("error saving");
                        }
                    }
                    YesBankServices.regUser(WalletNumber, function (err, YesBankresult) {
                        console.log(YesBankresult)
                        if (YesBankresult.message.status_code == "SUCCESS") {
                            connection.commit();
                            var getErrMsg = Utils.getErrorMessage(Lang, "SUCCESS_M02")
                            response = {
                                "success": true,
                                "statusCode": 200,
                                'data': {
                                    'code': getErrMsg.code,
                                    'message': getErrMsg.message,
                                    'mobile_number': YesBankresult.message.mobile_number,
                                    'otp_ref_number': YesBankresult.message.otp_ref_number,
                                    'status_type': '',
                                    'status_popupmessage_type': ''
                                },
                                'isSuccessful': true
                            }
                            resolve(response)
                        } else if (YesBankresult.message.status_code == "ERROR") {
                            var getErrMsg = Utils.getErrorMessage(Lang, "ERROR_EA14")
                            response = {
                                'success': false,
                                'statusCode': 401,
                                'error': {
                                    'code': getErrMsg.code,
                                    'message': getErrMsg.message,
                                    'status_type': '',
                                    'status_popupmessage_type': ''
                                },
                            };
                            resolve(response)
                        } else {
                            throw new Error("error on curl REGUSER")
                        }
                    })
                } catch (err) {
                    connection.rollback();
                    var getErrMsg = Utils.getErrorMessage(Lang, "ERROR_EA14")
                    response = {
                        'success': false,
                        'successCode': 401,
                        'error': {
                            'code': getErrMsg.code,
                            'message': getErrMsg.message,
                            'status_type': '',
                            'status_popupmessage_type': ''
                        },
                    };

                }
            } else {
                var getErrMsg = Utils.getErrorMessage(Lang, "ERROR_EA14")
                response = {
                    'success': false,
                    'successCode': 401,
                    'error': {
                        'code': getErrMsg.code,
                        'message': getErrMsg.message,
                        'status_type': '',
                        'status_popupmessage_type': ''
                    },
                    'statusCode':200
                };
                resolve(response)
            }
        } else {
            var getErrMsg = Utils.getErrorMessage(Lang, "ERROR_EA13")
            response = {
                'success': false,
                'successCode': 401,
                'error': {
                    'code': getErrMsg.code,
                    'message': getErrMsg.message,
                    'status_type': '',
                    'status_popupmessage_type': ''
                },
                'statusCode':200
            };
            resolve(response)
        }


    })
}

async function verifyMotp(Lang, userID, mobile, otp, otpReference) {
    return new Promise(async (resolve, reject) => {

        var wallet = await walletDB.checkWallet(mobile)
        if (wallet) {
            YesBankServices.verifyMotp(mobile, otpReference, otp, async function (YesBankServicesRes) {
                console.log(YesBankServicesRes.message.status_code)
                var mResponse = await getPubAndPriKeys(userID)
                try {
                    if (mResponse.status != 200 && YesBankServicesRes.status_code != "") {
                        if (YesBankServicesRes.message.status_code == "ERROR" || mResponse.status != 200) {
                            var getErrMsg = Utils.getErrorMessage(Lang, "ERROR_EA14")
                            response = {
                                'success': false,
                                'statusCode':401,
                                'error': {
                                    'code': getErrMsg.code,
                                    'message': getErrMsg.message,
                                    'status_type': '',
                                    'status_popupmessage_type': ''
                                },
                            };
                            resolve(response)
                        } else {
                            var walletItems = {
                                'wallet_present': false,
                                'aadhaar_id': "",
                                'mobile': "",
                                'balance': ""
                            }
                            if (wallet.kyc_status == 'AADHAAR_KYC' || wallet.kyc_status == 'FULL_KYC') {
                                walletItems.wallet_present = true
                                walletItems.aadhaar_id = wallet.aadhaar_id
                                walletItems.mobile = wallet.wallet_mobile
                                walletItems.balance = wallet.wallet_balance
                            }
                            var getErrMsg = Utils.getErrorMessage(Lang, "SUCCESS_M02")
                            response = {
                                "success": true,
                                "statusCode": 200,
                                'isSuccessful': true,
                                'data': {
                                    'code': getErrMsg.code,
                                    'message': getErrMsg.message,
                                    'token': YesBankServicesRes.message.token,
                                    'status_type': '',
                                    'status_popupmessage_type': '',
                                    'wallet_present': walletItems.wallet_present,
                                    'wallet_mobile': walletItems.mobile,
                                    'wallet_balance': walletItems.balance,
                                    'wallet_aadhaar_id': walletItems.aadhaar_id
                                }
                            }
                            resolve(response)
                        }
                    } else {
                        throw new Error('error on curl REGUSER')
                    }
                } catch (err) {
                    var getErrMsg = Utils.getErrorMessage(Lang, "ERROR_EA02")
                    response = {
                        'success': false,
                        'statusCode':401,
                        'error': {
                            'code': getErrMsg.code,
                            'message': getErrMsg.message,
                            'status_type': '',
                            'status_popupmessage_type': ''
                        },
                    };
                    resolve(response)
                }
            })
        } else {
            var getErrMsg = Utils.getErrorMessage(Lang, "ERROR_EA13")
            response = {
                'success': false,
                'statusCode':401,
                'error': {
                    'code': getErrMsg.code,
                    'message': getErrMsg.message,
                    'status_type': '',
                    'status_popupmessage_type': ''
                },
            };
            await resolve(response)
        }
    })
}




/**
 * @author: Rakesh C
 * @version: 1.0.0
 * @date: October 11, 2018
 * @Description: Generate will intract with wallet, invoke and query function to create keys and addresses.
 */

async function getPubAndPriKeys(userId) {
    return new Promise(async (resolve, reject) => {

        var blockchainID = await usersDB.getBckeyForUser(userId)

        var cryptoId = await wallet.createKeys()
        await wallet.importaddres(cryptoId.response[0].address)
        await wallet.grantPermission(cryptoId.response[0].address)

        console.log("blockchainID", blockchainID)
        var params = {
            "key": blockchainID,
            "value": cryptoId.response[0],
        }

        if (cryptoId.status == 200) {
            bcSdk.addDataWithOutArrayList(params).then(async function (result) {
                console.log(result)
                if (result.status == 200) {
                    await walletDB.updateWalletAddress(userId, cryptoId.response[0].address)
                    resolve({
                        status: 200
                    })
                } else {
                    resolve({
                        status: 401
                    })
                }
            }).catch(function (err) {
                console.error(err)
                return err
            })
        }
    })
}