'use strict';
var validator = require('validator');
const aadharRegistration = require('../functions/AadharServices/registeraadhar')
const mysqlConnection = require('./../mysql_connection/query_execute');
const query = require('./../mysql_connection/quiries')
let date = require('date-and-time');
const Mpincreation = require('../functions/LoginServices/createMpin')
const Utils = require('../util/utils')
const MpinLoginfunc = require('../functions/LoginServices/MpinLogin')
// const transactioncount = require('../functions/APIcount/count/successcount')

const changeMpinfunc = require('../functions/LoginServices/changeMpin')
const forgotMpinfunc = require('../functions/LoginServices/forgotMpin')

const walletServices = require('../functions/WalletServices/createWallet')
const loadReversal = require('../functions/WalletServices/loadReversal')

const accessTokenDB = require('../functions/DBFunctions/AccessTokenDB')
const errorCode = require('../message/errMsg')
const errorMessegeEN = require('../message/messageEN')
const errorMessegeHN = require('../message/messageHN')

module.exports = {
    addDataTestValidation: addDataTestValidation,
    createMpin: createMpin,
    MpinLogin: MpinLogin,
    changeMpin: changeMpin,
    forgotMpin: forgotMpin,
    verifyMpinotp: verifyMpinotp,
    addDataTestValidation: addDataTestValidation,
    registeraadharvalidation: registeraadharvalidation,
    otpaadharvalidation: otpaadharvalidation,
    createWalletValidation: createWalletValidation,
    verifyMotpValidation: verifyMotpValidation,
    loadReversalValidation: loadReversalValidation
}

function addDataTestValidation(req, callback) {
    const key = req.body.key
    const value = req.body.value;
    if (!key || !key.trim()) {
        err = {
            "status": 400,
            "message": 'fields should not be empty'
        }
        callback(err, "");
    } else {
        addData.addData(key, value)
            .then(function (result) {
                callback("", result);
            }).catch(function (err) {
                callback(err, "");
            })
    }
}

function createMpin(req, callback) {
    var user_ID = req.body.userId
    console.log("user_id", user_ID)
    var Mpin = req.body.mpin
    console.log("mpin", Mpin)
    var confirmMpin = req.body.confirmMpin
    console.log("confirmMpin", confirmMpin)
    var device_ID = req.body.deviceId
    console.log("device_ID", device_ID)
    var oneSignal_Id = req.body.oneSignalId
    console.log("onesignal_ID", oneSignal_Id)
    var lang = req.headers.lang ? req.headers.lang : "en"
    console.log("lang", lang)
    var now = new Date()
    var dateformat = Utils.dateFormate(now);
    console.log("date", dateformat)
    if (!user_ID || !Mpin || !confirmMpin || !device_ID || !device_ID.trim() || !oneSignal_Id || !oneSignal_Id.trim()) {
        var getErrMsg = Utils.getErrorMessage(lang, "ERROR_EA01")
        var error = {
            "code": getErrMsg.code,
            "message": getErrMsg.message,
        }
        var err = {
            "statuscode": 400,
            "message": error,
        }
        callback(err)
    } else if (Mpin == confirmMpin) {
        var value = {
            "user_ID": user_ID,
            "Mpin": Mpin,
            "confirmMpin": confirmMpin,
            "device_ID": device_ID,
            "oneSignal_Id": oneSignal_Id,
            "date": dateformat,
            "lang": lang
        }
        console.log("value", value)
        Mpincreation.createMpin(value)
            .then(function (result) {

                callback("", result);

            }).catch(function (err) {

                callback(err, "");
            })
    } else {
        console.log("else")
        var getErrMsg = Utils.getErrorMessage(lang, "ERROR_EA11")
        console.log(getErrMsg)
        var message = {
            "code": getErrMsg.code,
            "message": getErrMsg.message,
            "statuscode": 400
        }
        var error = {
            "status": 400,
            "message": message,
        }
        callback(error)
    }
}

function MpinLogin(req, callback) {
    // console.log(req.headers['user-agent']);
    var mpin = req.body.mpinCode
    console.log("mpin", mpin)
    var device_id = req.body.deviceId
    console.log("device_id", device_id)
    var lang = req.headers.lang ? req.headers.lang : "en"
    console.log("lang", lang)
    var oneSignal_Id = req.body.oneSignalId
    console.log("oneSignalId", oneSignal_Id)
    if (!mpin || !device_id || !oneSignal_Id) {
        var getErrMsg = Utils.getErrorMessage(lang, "ERROR_EA01")
        var error = {
            "code": getErrMsg.code,
            "message": getErrMsg.message
        }
        var err = {
            "status": 401,
            "message": error,
            "status_type": "",
            "status_popupmessage_type": ""
        }
        callback(err)
    } else {
        console.log("manojSS")
        var value = {
            "mpin": mpin,
            "device_id": device_id,
            "lang": lang,
            "oneSignal_Id": oneSignal_Id,

        }
        console.log("data", value)
        MpinLoginfunc.LoginMpin(value)
            .then(function (result) {

                callback("", result);

            }).catch(function (err) {

                callback(err, "");
            })
    }
}

function changeMpin(req, callback) {
    var oldmpin = req.body.old_mpin
    console.log("oldmpin", oldmpin)
    var newmpin = req.body.new_mpin
    console.log("newmpin", newmpin)
    var confirmmpin = req.body.confirm_mpin
    console.log("confirmmpin", confirmmpin)
    var lang = req.headers.lang ? req.headers.lang : "en"
    var accessToken = req.headers.access_token
    if (!oldmpin || !newmpin || !confirmmpin || !accessToken) {
        var getErrMsg = Utils.getErrorMessage(lang, "ERROR_EA01")
        var err = {
            "status": 401,
            "code": getErrMsg.code,
            "message": getErrMsg.message,
            "status_type": "",
            "status_popupmessage_type": ""
        }
        callback(err)
    } else {
        console.log("manojSS")
        var data = {
            "oldmpin": oldmpin,
            "newmpin": newmpin,
            "confirmmpin": confirmmpin,
            "accessToken": accessToken,
            "lang": lang
        }
        console.log("data", data)
        changeMpinfunc.changeMpin(data)
            .then(function (result) {

                callback("", result);

            }).catch(function (err) {

                callback(err, "");
            })
    }
}

function forgotMpin(req, callback) {
    var mobile = req.body.mobile
    console.log("mobile", mobile)
    var mobiletype = req.body.mobile_type
    console.log("mobiletype", mobiletype)
    var lang = req.headers.lang ? req.headers.lang : "en"
    console.log("lang", lang)
    if (!mobile || !mobiletype) {
        var getErrMsg = Utils.getErrorMessage(lang, "ERROR_EA01")
        var err = {
            "status": 401,
            "code": getErrMsg.code,
            "message": getErrMsg.message,
            "status_type": "",
            "status_popupmessage_type": ""
        }
        callback(err)
    } else {
        console.log("manojSS")
        var data = {
            "mobile": mobile,
            "mobiletype": mobiletype,
            "lang": lang
        }
        console.log("data", data)
        forgotMpinfunc.forgotMpin(data)
            .then(function (result) {

                callback("", result);

            }).catch(function (err) {

                callback(err, "");
            })
    }


}

function verifyMpinotp(req, callback) {
    console.log("uiniubwdiSS")
    var lang = req.headers.lang ? req.headers.lang : "en"
    console.log("lang", lang)
    var otp = req.body.otp
    console.log("otp", otp)
    var ref_no = req.body.ref_no
    console.log("ref_no", ref_no)

    if (!otp || !otp || !ref_no || !ref_no) {
        console.log(!otp)
        var err = {
            "status": 401,
            "message": "fields should not be empty"
        }
        callback(err)
    } else {
        var data = {
            "lang": lang,
            "otp": otp,
            "ref_no": ref_no
        }
        forgotMpinfunc.verifyMpinotp(data)
            .then(function (result) {

                callback("", result);

            }).catch(function (err) {

                callback(err, "");
            })
    }
}

function registeraadharvalidation(req, callback) {

    console.log("ui", req.body);
    const user_language = req.headers.user_language ? req.headers.user_language : "en"
    console.log("user_language", user_language);
    var access_token = req.headers.access_token;
    console.log("access_token", access_token);
    var auth_token = req.body.auth_token;
    var aadhar_no = req.body.aadhar_no;


    var value = {
        user_language: user_language,
        access_token: access_token,
        auth_token: auth_token,
        aadhar_no: aadhar_no

    }
    var params = access_token



    if (!user_language || !access_token || !aadhar_no || !user_language.trim() || !access_token.trim() || !aadhar_no.trim()) {

        var err = {
            "status": 400,
            "message": 'fields should not be empty'
        }
        callback(err, "");
    } else {
        mysqlConnection.query_execute(query.readaadharkyc, params).then(function (result, error) {
            console.log("result", result)
            if (result.data.length == 0) {
                var getErrMsg = Utils.getErrorMessage(value.user_language, "ERROR_EA00")
                var response = {
                    'success': false,
                    'status': 200,
                    'error': {
                        'code': getErrMsg.code,
                        'message': getErrMsg.message,
                        'status_type': '',
                        'status_popupmessage_type': ''
                    },
                };
                callback(response, "")
            } else {
                var user_id = result.data[0].user_id
                console.log("result", result.data[0].user_id);
                aadharRegistration.registeraadhar(user_id, value).then(function (result) {
                    callback(result);
                })
            }
        }).catch(function (err) {
            callback(err, "");
        })
    }
}

function otpaadharvalidation(req, callback) {

    console.log("ui", req.body);
    const user_language = req.headers.user_language ? req.headers.user_language : "en"
    console.log("user_language", user_language);
    var access_token = req.headers.access_token;
    console.log("access_token", access_token);
    var otp = req.body.otp;
    var transaction_id = req.body.transaction_id;
    var otp_transaction_id = req.body.otp_transaction_id;



    var value = {
        user_language: user_language,
        access_token: access_token,
        otp: otp,
        transaction_id: transaction_id,
        otp_transaction_id: otp_transaction_id

    }
    var params = access_token
    if (!user_language || !access_token || !otp || !transaction_id || !otp_transaction_id || !user_language.trim() || !access_token.trim() || !otp.trim() || !transaction_id.trim() || !otp_transaction_id.trim()) {
        var err = {
            "status": 400,
            "message": 'fields should not be empty'
        }
        callback(err, "")
    } else {
        mysqlConnection.query_execute(query.readaadharkyc, params).then(function (result) {
            if (result.data.length == 0) {
                var getErrMsg = Utils.getErrorMessage(value.user_language, "ERROR_EA00")
                var response = {
                    'success': false,
                    'status': 200,
                    'error': {
                        'code': getErrMsg.code,
                        'message': getErrMsg.message,
                        'status_type': '',
                        'status_popupmessage_type': ''
                    },
                };
                callback(response, "")
            } else {
                console.log("result", result.data[0].user_id);
                var user_id = result.data[0].user_id
                aadharRegistration.aadharotp(user_id, value).then(function (result) {
                    callback(result);
                })
            }
        }).catch(function (err) {
            callback(err, "");
        })

    }
}

async function createWalletValidation(req, callback) {

    var value = {
        Lang: req.headers.user_language ? req.headers.user_language : "en",
        Access_Token: req.headers.access_token,
        Mobile_Number: req.body.Mobile_Number,
        UserId: req.body.UserId
    }

    var userID = await accessTokenDB.checkAccessTokenGetID(value.Access_Token)
    console.log(userID);
    if (!userID) {
        var getErrMsg = Utils.getErrorMessage(value.Lang, "ERROR_EA00")
        response = {
            'success': false,
            'error': {
                'code': getErrMsg.code,
                'message': getErrMsg.message,
                'status_type': '',
                'status_popupmessage_type': ''
            },
        };
        callback("", response);
    }
    if (value.Mobile_Number) {

        walletServices.createWallet(value.Lang, userID, value.Mobile_Number).then(function (result) {
            callback("", result)
        })

    } else {
        var getErrMsg = Utils.getErrorMessage(value.Lang, "ERROR_EA01")
        response = {
            'success': false,
            'error': {
                'code': getErrMsg.code,
                'message': getErrMsg.message,
                'status_type': '',
                'status_popupmessage_type': ''
            },
        };
        callback("", response);
    }
}

async function verifyMotpValidation(req, callback) {


    var value = {
        Lang: req.headers.user_language,
        Access_Token: req.headers.access_token,
        Mobile_Number: req.body.Mobile_Number,
        ReferNo: req.body.ReferNo,
        OTP: req.body.OTP
    }

    var userID = await accessTokenDB.checkAccessTokenGetID(value.Access_Token)
    if (!userID) {
        var getErrMsg = Utils.getErrorMessage(value.Lang, "ERROR_EA00")

        response = {
            'success': false,
            'statusCode': 200,
            'error': {
                'code': getErrMsg.code,
                'message': getErrMsg.message,
                'status_type': '',
                'status_popupmessage_type': ''
            },
        };
        callback("", response);
    }
    if (value.Mobile_Number || value.OTP || value.ReferNo) {

        walletServices.verifyMotp(value.Lang, userID, value.Mobile_Number, value.OTP, value.ReferNo, ).then(function (result) {
            callback("", result);
        })

    } else {
        var getErrMsg = Utils.getErrorMessage(Lang, "ERROR_EA01")
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
        callback("", response);
    }
}

async function loadReversalValidation(req, callback) {

    var value = {
        Lang: req.headers.user_language,
        Access_Token: req.headers.access_token,
    }

    var userID = await accessTokenDB.checkAccessTokenGetID(value.Access_Token)
    if (!userID) {
        var getErrMsg = Utils.getErrorMessage(value.Lang, "ERROR_EA00")
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
        callback("", response);
    } else {
        loadReversal.loadReversalAction(value.Lang, userID).then(function (result) {
            callback("", result);
        })
    }
}