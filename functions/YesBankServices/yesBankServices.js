'use strict';
var validator = require('validator');
const bankServices = require('../../util/bankServices');
const getChecksum = require('../../util/generateChecksum');
const walletSDK = require('../../sdk/wallet');
const sdk = require('../../sdk/query')
const walletDB = require('..//DBFunctions/WalletDB')
const UserDB = require('../../functions/DBFunctions/UsersDB')

module.exports = {
    checkUser: checkUser,
    checkKYCStatus: checkKYCStatus,
    regUser: regUser,
    verifyMotp: verifyMotp,
    addBeneficiary: addBeneficiary,
    fetchBeneficiary: fetchBeneficiary,
    changeBeneficiary: changeBeneficiary,
    addOwnBankAccount: addOwnBankAccount,
    verifyBankAccount: verifyBankAccount,
    modifyOwnBankAccount: modifyOwnBankAccount,
    curlLoadMoneyToWallet: curlLoadMoneyToWallet,
    Walletvalidation: Walletvalidation,
    spendReversal: spendReversal,
    loadReversal: loadReversal,
    WallettoBankFunc: WallettoBankFunc,
    actionEmitraBillPayment: actionEmitraBillPayment,
    curlWalletBalance: curlWalletBalance,
    aadharservice:aadharservice,
    aadharotp:aadharotp,
    closewallet:closewallet
}




var bankServicesKey = {
    "pskSecretKey": "69f2acc6f0cc52b981eaf06813f9fba3",
    "wlapCode": "bhamasha",
    "wlapCodeSecretKey": "bhamasha123"
};
/*
 * p1 - Mobile Number
 * p2 - Account Number
 * p3 - IFSC Code
 */
function modifyOwnBankAccount(req, callback) {
    var action = "MODIFYOWNACC";
    var checkSum = getChecksum.generateChecksum(action, bankServicesKey.pskSecretKey, bankServicesKey.wlapCode, bankServicesKey.wlapCodeSecretKey, req.p1, req.p2, req.p3);
    var parms = {
        "action_name": action,
        "wlap_code": bankServicesKey.wlapCode,
        "wlap_secret_key": bankServicesKey.wlapCodeSecretKey,
        "p1": req.p1,
        "p2": req.p2,
        "p3": req.p3,
        "checksum": checkSum
    }
    console.log(checkSum);
    if (checkSum) {
        bankServices.bankServices(parms, function (result, error) {
            console.log(result)
            if (error) {
                callback(error)
            } else {
                callback(result)
            }
        });
    }
}

/*
 * p1 - Mobile Number
 */

function checkUser(req, callback) {
    var action = "CHECKUSER";
    var checkSum = getChecksum.generateChecksum(action, bankServicesKey.pskSecretKey, bankServicesKey.wlapCode, bankServicesKey.wlapCodeSecretKey, req.p1);
    var parms = {
        "action_name": action,
        "wlap_code": bankServicesKey.wlapCode,
        "wlap_secret_key": bankServicesKey.wlapCodeSecretKey,
        "p1": req.p1,
        "checksum": checkSum
    }

    if (checkSum) {
        bankServices.bankServices(parms, function (result, error) {
            console.log(result)
            if (error) {
                callback(error)
            } else {

                if (result.message.status_code == "SUCCESS") {
                    var successResponse = {
                        "statusReason": "OK",
                        "data": result,
                        "isSuccessful": true,
                        "success": true,
                        "statusCode": 200
                    }
                    var success = {
                        "status": 200,
                        "data": Object.assign({}, successResponse)
                    }
                    callback(success)
                } else {
                    var errResponse = {
                        "statusReason": "OK",
                        "isSuccessful": true,
                        "success": false,
                        "error": result,
                        "statusCode": 200
                    }
                    var err = {
                        "status": 200,
                        "data": Object.assign({}, errResponse)
                    }
                    callback(err)
                }

            }
        });
    }
}
/*	
 * p1 - Mobile Number	
 * p2 - Account Number	
 * p3 - IFSC Code	
 */
function modifyOwnBankAccount(req, callback) {
    var action = "MODIFYOWNACC";
    var checkSum = getChecksum.generateChecksum(action, bankServicesKey.pskSecretKey, bankServicesKey.wlapCode, bankServicesKey.wlapCodeSecretKey, req.p1, req.p2, req.p3);
    var parms = {
        "action_name": action,
        "wlap_code": bankServicesKey.wlapCode,
        "wlap_secret_key": bankServicesKey.wlapCodeSecretKey,
        "p1": req.p1,
        "p2": req.p2,
        "p3": req.p3,
        "checksum": checkSum
    }
    console.log(checkSum);
    if (checkSum) {
        bankServices.bankServices(parms, function (result, error) {
            console.log(result)
            if (error) {
                callback(error)
            } else {
                callback(result)
            }
        });
    }
}

function curlWalletBalance(req) {
    return new Promise((resolve, reject) => {
    var action = "WALLETBAL";
    var checkSum = getChecksum.generateChecksum(action, bankServicesKey.pskSecretKey, bankServicesKey.wlapCode, bankServicesKey.wlapCodeSecretKey, req.p1);
    var parms = {
        "action_name": action,
        "wlap_code": bankServicesKey.wlapCode,
        "wlap_secret_key": bankServicesKey.wlapCodeSecretKey,
        "p1": req.p1,
        "checksum": checkSum
    }

    if (checkSum) {
        bankServices.bankServices(parms, function (result, error) {
            console.log(result)
            if (error) {
                resolve(error)
            } else {
                
                    resolve(result)
                
            }
        });
    }
})
}

/*
 * p1 - Mobile Number
 */

function checkKYCStatus(req, callback) {
    var action = "CHECKKYCSTATUS";
    var checkSum = getChecksum.generateChecksum(action, bankServicesKey.pskSecretKey, bankServicesKey.wlapCode, bankServicesKey.wlapCodeSecretKey, req.p1);
    var parms = {
        "action_name": action,
        "wlap_code": bankServicesKey.wlapCode,
        "wlap_secret_key": bankServicesKey.wlapCodeSecretKey,
        "p1": req.p1,
        "checksum": checkSum
    }

    if (checkSum) {
        bankServices.bankServices(parms, function (result, error) {
            console.log(result)
            if (error) {
                callback(error)
            } else {

                if (result.message.status_code == "SUCCESS") {
                    var successResponse = {
                        "statusReason": "OK",
                        "data": result,
                        "isSuccessful": true,
                        "success": true,
                        "statusCode": 200
                    }
                    var success = {
                        "status": 200,
                        "data": Object.assign({}, successResponse)
                    }
                    callback(success)
                } else {
                    var errResponse = {
                        "statusReason": "OK",
                        "isSuccessful": true,
                        "success": false,
                        "error": result,
                        "statusCode": 200
                    }
                    var err = {
                        "status": 200,
                        "data": Object.assign({}, errResponse)
                    }
                    callback(err)
                }

            }
        });
    }
}

/*
 * p1 - Mobile Number
 */

function regUser(mobile, callback) {
    var action = "REGUSER";
    var checkSum = getChecksum.generateChecksum(action, bankServicesKey.pskSecretKey, bankServicesKey.wlapCode, bankServicesKey.wlapCodeSecretKey, mobile, "Y");
    var parms = {
        "action_name": action,
        "wlap_code": bankServicesKey.wlapCode,
        "wlap_secret_key": bankServicesKey.wlapCodeSecretKey,
        "p1": mobile,
        "p2": "Y",
        "checksum": checkSum
    }

    if (checkSum) {
        bankServices.bankServices(parms, function (result, error) {
            console.log(result)
            if (error) {
                callback(error, "")
            } else {
                callback("", result)
            }
        });
    }
}
/*
 * p1 - Mobile Number
 * p2 - Aadhaar Number
 * p3 - AuthToken
 */
function verifyMotp(mobile, otpReference, otp, callback) {
    var action = "VERIFYMOTP";
    var checkSum = getChecksum.generateChecksum(action, bankServicesKey.pskSecretKey, bankServicesKey.wlapCode, bankServicesKey.wlapCodeSecretKey, mobile, otpReference, otp);
    var parms = {
        "action_name": action,
        "wlap_code": bankServicesKey.wlapCode,
        "wlap_secret_key": bankServicesKey.wlapCodeSecretKey,
        "p1": mobile,
        "p2": otpReference,
        "p3": otp,
        "checksum": checkSum
    }

    if (checkSum) {
        bankServices.bankServices(parms, function (result, error) {
            if (error) {
                callback(error)
            } else {
                callback(result)
            }
        })
    }
}
/*
 * p1 - Mobile Number
 * p2 - Beneficiary Name
 * p3 - Identifier Type
 * p4 - Account Number
 * p5 - IFSC Code
 */
function addBeneficiary(req, callback) {
    var action = "ADDBENE";
    var checkSum = getChecksum.generateChecksum(action, bankServicesKey.pskSecretKey, bankServicesKey.wlapCode, bankServicesKey.wlapCodeSecretKey, req.p1, req.p2, req.p3, req.p4, req.p5);
    var parms = {
        "action_name": action,
        "wlap_code": bankServicesKey.wlapCode,
        "wlap_secret_key": bankServicesKey.wlapCodeSecretKey,
        "p1": req.p1,
        "p2": req.p2,
        "p3": req.p3,
        "p4": req.p4,
        "p5": req.p5,
        "checksum": checkSum
    }
    console.log(checkSum);
    if (checkSum) {
        bankServices.bankServices(parms, function (result, error) {
            console.log(result)
            if (error) {
                callback(error)
            } else {
                callback(result)
            }
        });
    }
}
/*
 * p1 - Mobile Number
 * p2 - Beneficiary Id
 */
function fetchBeneficiary(req, callback) {
    $action = "FETCHBENE";
    var checkSum = getChecksum.generateChecksum(action, bankServicesKey.pskSecretKey, bankServicesKey.wlapCode, bankServicesKey.wlapCodeSecretKey, req.p1, req.p2);
    var parms = {
        "action_name": action,
        "wlap_code": bankServicesKey.wlapCode,
        "wlap_secret_key": bankServicesKey.wlapCodeSecretKey,
        "p1": req.p1,
        "p2": req.p2,
        "checksum": checkSum
    }
    if (checkSum) {
        bankServices.bankServices(parms, function (result, error) {
            console.log(result)
            if (error) {
                callback(error)
            } else {

                if (result.message.status_code == "SUCCESS") {
                    var successResponse = {
                        "statusReason": "OK",
                        "data": result,
                        "isSuccessful": true,
                        "success": true,
                        "statusCode": 200
                    }
                    var success = {
                        "status": 200,
                        "data": Object.assign({}, successResponse)
                    }
                    callback(success)
                } else {
                    var errResponse = {
                        "statusReason": "OK",
                        "isSuccessful": true,
                        "success": false,
                        "error": result,
                        "statusCode": 200
                    }
                    var err = {
                        "status": 200,
                        "data": Object.assign({}, errResponse)
                    }
                    callback(err)
                }

            }
        });
    }
}

/*
 * p1 - Mobile Number
 * p2 - Beneficiary Id
 * p3 - max_monthly_allowed_limit
 */
function changeBeneficiary(req, callback) {
    $action = "CHANGEBENE";
    var checkSum = getChecksum.generateChecksum(action, bankServicesKey.pskSecretKey, bankServicesKey.wlapCode, bankServicesKey.wlapCodeSecretKey, req.p1, req.p2, req.p3);
    var parms = {
        "action_name": action,
        "wlap_code": bankServicesKey.wlapCode,
        "wlap_secret_key": bankServicesKey.wlapCodeSecretKey,
        "p1": req.p1,
        "p2": req.p2,
        "p3": req.p3,
        "checksum": checkSum
    }
    if (checkSum) {
        bankServices.bankServices(parms, function (result, error) {
            console.log(result)
            if (error) {
                callback(error)
            } else {

                if (result.message.status_code == "SUCCESS") {
                    var successResponse = {
                        "statusReason": "OK",
                        "data": result,
                        "isSuccessful": true,
                        "success": true,
                        "statusCode": 200
                    }
                    var success = {
                        "status": 200,
                        "data": Object.assign({}, successResponse)
                    }
                    callback(success)
                } else {
                    var errResponse = {
                        "statusReason": "OK",
                        "isSuccessful": true,
                        "success": false,
                        "error": result,
                        "statusCode": 200
                    }
                    var err = {
                        "status": 200,
                        "data": Object.assign({}, errResponse)
                    }
                    callback(err)
                }

            }
        });
    }
}

/*
 * p1 - Mobile Number
 * p2 - Account Number
 * p3 - IFSC Code
 */
function addOwnBankAccount(req, callback) {
    var action = "ADDOWNACC";
    var checkSum = getChecksum.generateChecksum(action, bankServicesKey.pskSecretKey, bankServicesKey.wlapCode, bankServicesKey.wlapCodeSecretKey, req.p1, req.p2, req.p3);
    var parms = {
        "action_name": action,
        "wlap_code": bankServicesKey.wlapCode,
        "wlap_secret_key": bankServicesKey.wlapCodeSecretKey,
        "p1": req.p1,
        "p2": req.p2,
        "p3": req.p3,
        "checksum": checkSum
    }
    console.log(checkSum);
    if (checkSum) {
        bankServices.bankServices(parms, function (result, error) {
            console.log(result)
            if (error) {
                callback(error)
            } else {
                callback(result)
            }
        });
    }
}

/*
 * p1 - Mobile Number
 * p2 - Amount
 * p3 - Account Validation Reference
 */
function verifyBankAccount(req, callback) {
    var action = "VERIFYOWNACC";
    var checkSum = getChecksum.generateChecksum(action, bankServicesKey.pskSecretKey, bankServicesKey.wlapCode, bankServicesKey.wlapCodeSecretKey, req.p1, req.p2, req.p3);
    var parms = {
        "action_name": action,
        "wlap_code": bankServicesKey.wlapCode,
        "wlap_secret_key": bankServicesKey.wlapCodeSecretKey,
        "p1": req.p1,
        "p2": req.p2,
        "p3": req.p3,
        "checksum": checkSum
    }
    console.log(checkSum);
    if (checkSum) {
        bankServices.bankServices(parms, function (result, error) {
            console.log(result)
            if (error) {
                callback(error)
            } else {
                callback(result)
            }
        });
    }
}


/*
 * p1 - Mobile Number
 * p2 - Account Number
 * p3 - IFSC Code
 */
function modifyOwnBankAccount(req, callback) {
    var action = "MODIFYOWNACC";
    var checkSum = getChecksum.generateChecksum(action, bankServicesKey.pskSecretKey, bankServicesKey.wlapCode, bankServicesKey.wlapCodeSecretKey, req.p1, req.p2, req.p3);
    var parms = {
        "action_name": action,
        "wlap_code": bankServicesKey.wlapCode,
        "wlap_secret_key": bankServicesKey.wlapCodeSecretKey,
        "p1": req.p1,
        "p2": req.p2,
        "p3": req.p3,
        "checksum": checkSum
    }
    console.log(checkSum);
    if (checkSum) {
        bankServices.bankServices(parms, function (result, error) {
            console.log(result)
            if (error) {
                callback(error)
            } else {
                callback(result)
            }
        });
    }
}

// function curlWalletBalance(mobile, callback) {
//     var action = "WALLETBAL";
//     var checkSum = getChecksum.generateChecksum(action, bankServicesKey.pskSecretKey, bankServicesKey.wlapCode, bankServicesKey.wlapCodeSecretKey, mobile);
//     var parms = {
//         "action_name": action,
//         "wlap_code": bankServicesKey.wlapCode,
//         "wlap_secret_key": bankServicesKey.wlapCodeSecretKey,
//         "p1": mobile,
//         "checksum": checkSum
//     }

//     if (checkSum) {
//         bankServices.bankServices(parms, function (result, error) {
//             console.log(result)
//             if (error) {
//                 callback(error)
//             } else {
//                 callback(result)
//             }
//         });
//     }
// }

/*
 * p1 - Mobile Number
 * p2 - Beneficiary Id
 */
function curlLoadMoneyToWallet(req, callback) {
    var action = "TRANSACTION";
    var checkSum = getChecksum.generateChecksum(action, bankServicesKey.pskSecretKey, bankServicesKey.wlapCode, bankServicesKey.wlapCodeSecretKey, req.p1, req.p2, req.p3, req.p4, req.p5, req.p6, req.p7, req.p8);
    var parms = {
        "action_name": action,
        "wlap_code": bankServicesKey.wlapCode,
        "wlap_secret_key": bankServicesKey.wlapCodeSecretKey,
        "transaction_type": "load",
        "p1": req.p1,
        "p2": req.p2,
        "p3": req.p3,
        "p4": req.p4,
        "p5": req.p5,
        "p6": req.p6,
        "p7": req.p7,
        "p8": req.p8,
        "checksum": checkSum
    }
    if (checkSum) {
        bankServices.bankServices(parms, async function (result, error) {
            console.log(result)

            if (error) {
                callback(error)
            } else {
                callback(result)
            }
        });
    }
}

function spendReversal(req, callback) {
    $action = "TRANSACTION";
    var checkSum = getChecksum.generateChecksum(action, bankServicesKey.pskSecretKey, bankServicesKey.wlapCode, bankServicesKey.wlapCodeSecretKey, req.p1, req.p2, req.p3, req.p4, req.p5);
    var parms = {
        "action_name": action,
        "transaction type": "Spend Reversal",
        "wlap_code": bankServicesKey.wlapCode,
        "wlap_secret_key": bankServicesKey.wlapCodeSecretKey,
        "p1": req.p1,
        "p2": "",
        "p3": "",
        "p4": req.p4,
        "p5": req.p5,
        "p6": "",
        "p7": "",
        "p8": req.p8,
        "checksum": checkSum
    }
    if (checkSum) {
        bankServices.bankServices(parms, function (result, error) {
            console.log(result)
            if (error) {
                callback(error)
            } else {

                if (result.message.status_code == "SUCCESS") {
                    var successResponse = {
                        "statusReason": "OK",
                        "data": result,
                        "isSuccessful": true,
                        "success": true,
                        "statusCode": 200
                    }
                    var success = {
                        "status": 200,
                        "data": Object.assign({}, successResponse)
                    }
                    callback(success)
                } else {
                    var errResponse = {
                        "statusReason": "OK",
                        "isSuccessful": true,
                        "success": false,
                        "error": result,
                        "statusCode": 200
                    }
                    var err = {
                        "status": 200,
                        "data": Object.assign({}, errResponse)
                    }
                    callback(err)
                }
            }
        });
    }
}

function loadReversal(mobile, txid, remark, reversalReferenceNo, callback) {
    var action = "TRANSACTION";
    var checkSum = getChecksum.generateChecksum(action,
        bankServicesKey.pskSecretKey,
        bankServicesKey.wlapCode,
        bankServicesKey.wlapCodeSecretKey,
        mobile, "", "", txid, remark, "", "",
        reversalReferenceNo);

    var parms = {
        "action_name": action,
        "transaction type": "Loadreversal",
        "wlap_code": bankServicesKey.wlapCode,
        "wlap_secret_key": bankServicesKey.wlapCodeSecretKey,
        "p1": mobile,
        "p2": "",
        "p3": "",
        "p4": txid,
        "p5": remark,
        "p6": "",
        "p7": "",
        "p8": reversalReferenceNo,
        "checksum": checkSum
    }
    if (checkSum) {
        bankServices.bankServices(parms, function (result, error) {
            console.log(result)
            if (error) {
                callback(error, "")
            } else {
                callback("", result)
            }
        });
    }
}


function Walletvalidation(req, callback) {
    return new Promise((resolve, reject) => {
        var action = "TRANSACTION";
        var checkSum = getChecksum.generateChecksum(action, bankServicesKey.pskSecretKey, bankServicesKey.wlapCode, bankServicesKey.wlapCodeSecretKey, req.p1, req.p2, req.p3, req.p4, req.p5, req.p6, req.p7, req.p8);
        var parms = {
            "action_name": action,
            "wlap_code": bankServicesKey.wlapCode,
            "wlap_secret_key": bankServicesKey.wlapCodeSecretKey,
            "transaction_type": "FundTransfer",
            "p1": req.p1,
            "p2": req.p2,
            "p3": req.p3,
            "p4": req.p4,
            "p5": req.p5,
            "p6": req.p6,
            "p7": req.p7,
            "p8": req.p8,
            "checksum": checkSum
        }
        if (checkSum) {
            bankServices.bankServices(parms, function (result, error) {
                console.log(result)
                if (error) {
                    resolve(error)
                } else {
                    resolve(result)
                }
            });
        }
    })
}
//wallettobank
function WallettoBankFunc(req) {
    return new Promise((resolve, reject) => {
        var action = "TRANSACTION";
        var checkSum = getChecksum.generateChecksum(action, bankServicesKey.pskSecretKey, bankServicesKey.wlapCode, bankServicesKey.wlapCodeSecretKey, req.p1, req.p2, req.p3, req.p4, req.p5, req.p6, req.p7, req.p8);
        var parms = {
            "action_name": action,
            "wlap_code": bankServicesKey.wlapCode,
            "wlap_secret_key": bankServicesKey.wlapCodeSecretKey,
            "transaction_type": "IMPSTransfer",
            "p1": req.p1,
            "p2": req.p2,
            "p3": "",
            "p4": req.p4,
            "p5": req.p5,
            "p6": req.p6,
            "p7": req.p7,
            "p8": "",
            "checksum": checkSum
        }
        if (checkSum) {
            bankServices.bankServices(parms, function (result, error) {
                console.log(result)
                if (error) {
                    resolve(error)
                } else {
                    resolve(result)
                    
                }
            });
        }
    })
}
/**
 * @author: Sathiyan Baskaran
 * @version: 1.0.0
 * @date: October 17, 2018
 * @Description: Yes Bank Service Function for spending money from the wallet and type of the yes bank service is "SPEND".
 */
function actionEmitraBillPayment(req) {
    return new Promise(async(resolve, reject) => {
        var action = "TRANSACTION";
        var reqParam = req;
        console.log("reqParam========>", reqParam[3]);
        var checkSum = getChecksum.generateChecksum(action,bankServicesKey.pskSecretKey,bankServicesKey.wlapCode,bankServicesKey.wlapCodeSecretKey, reqParam[0], reqParam[1], reqParam[2], reqParam[3], reqParam[4], reqParam[5], reqParam[6]);
        var parms = {
            "action_name": action,
            "wlap_code": bankServicesKey.wlapCode,
            "wlap_secret_key": bankServicesKey.wlapCodeSecretKey,
            "transaction_type": "Spend",
            "p1": reqParam[0],
            "p2": reqParam[1],
            "p3": reqParam[2],
            "p4": reqParam[3],
            "p5": reqParam[4],
            "p6": reqParam[5],
            "p7": reqParam[6],
            "checksum": checkSum
        }
        if (checkSum) {
            bankServices.bankServices(parms, function (result, error) {
                console.log(result)
                if (error) {
                    resolve(error)
                } else {
                    if (result.message.status_code == "SUCCESS") {
                        var successResponse = {
                            "statusReason": "OK",
                            "data": result,
                            "isSuccessful": true,
                            "success": true,
                            "statusCode": 200
                        }
                        var success = {
                            "status": 200,
                            "data": Object.assign({}, successResponse)
                        }
                        resolve(success)
                    } else {
                        var errResponse = {
                            "statusReason": "OK",
                            "isSuccessful": true,
                            "success": false,
                            "error": result,
                            "statusCode": 200
                        }
                        var err = {
                            "status": 200,
                            "data": Object.assign({}, errResponse)
                        }
                        resolve(err)
                    }
                }
            });
        }
    })
}

function aadharservice(req) {
    return new Promise((resolve, reject) => {
        var action = "REGAADHAAR";
        var checkSum = getChecksum.generateChecksum(action,req.PSK_secrect_key,req.wlap_code,req.wlap_secret_key,req.p1,req.p2,req.p3,req.p4,req.p5);
        console.log("1234",checkSum)
        var parms = {
            "action_name": action,
            "wlap_code": req.wlap_code,
            "wlap_secret_key": req.wlap_secret_key,
            "p1": req.p1,
            "p2": req.p2,
            "p3": req.p3,
            "p4": req.p4,
            "p5": req.p5,
            "checksum": checkSum
        }
        if (checkSum) {
            bankServices.bankServices(parms, function (result, error) {
                console.log(result)
                if (error) {
                    resolve(error)
                } else {
                    resolve(result)
                }
            });
        }
    })
}

function aadharotp(req) {
    return new Promise((resolve, reject) => {
        var action = "VERIFYAOTP";
        var checkSum = getChecksum.generateChecksum(action,bankServicesKey.pskSecretKey,bankServicesKey.wlapCode,bankServicesKey.wlapCodeSecretKey,req.p1,req.p2,req.p3,req.p4,req.p5,req.p6,req.p7);
        console.log("1234",checkSum)
        var parms = {
            "action_name": action,
            "wlap_code": bankServicesKey.wlapCode,
            "wlap_secret_key": bankServicesKey.wlapCodeSecretKey,
            "p1": req.p1,
            "p2": req.p2,
            "p3": req.p3,
            "p4": req.p4,
            "p5": req.p5,
            "p6":req.p6,
            "p7":req.p7,
            "checksum": checkSum
        }
        if (checkSum) {
            bankServices.bankServices(parms, function (result, error) {
                console.log(result)
                if (error) {
                    resolve(error)
                } else {
                   resolve(result)
                    
                }
            });
        }
    })
}


function closewallet(req) {
    return new Promise((resolve, reject) => {
        var action = "CLOSE";
        var checkSum = getChecksum.generateChecksum(action,bankServicesKey.pskSecretKey,bankServicesKey.wlapCode,bankServicesKey.wlapCodeSecretKey,req.p1);
        console.log("1234",checkSum)
        var parms = {
            "action_name": action,
            "wlap_code": bankServicesKey.wlapCode,
            "wlap_secret_key": bankServicesKey.wlapCodeSecretKey,
            "p1": req.p1,
            "checksum": checkSum
        }
        if (checkSum) {
            bankServices.bankServices(parms, function (result, error) {
                console.log(result)
                if (error) {
                    resolve(error)
                } else {
                   resolve(result)
                    
                }
            });
        }
    })
}