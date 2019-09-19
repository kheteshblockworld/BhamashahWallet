var request = require('request');
var config = require('config');
var api_config = config.get('api_config')
const mysqlConnection = require('../../mysql_connection/query_execute');
const query = require('../../mysql_connection/quiries')
var accesstoken = require('./createAccessToken')
var sha1 = require('sha1');
const Utils = require('../../util/utils')
const addData = require('../../sdk/invoke');
var DBfunction = require('../DBFunctions/MpinDB')

var msg


module.exports = {
    LoginMpin: LoginMpin
}

async function LoginMpin(data) {
    var isError;
    var accessToken
    return new Promise(async (resolve, reject) => {
        console.log(data)
        var mpin = data.mpin
        var lang = data.lang
        var user = [data.device_id]
        var finddevice = await DBfunction.finddeviceid(user)
        console.log(!finddevice)
        var put = finddevice
        if (finddevice) {
            if (put.device_id != 0 && (sha1(mpin) == put.mpin)) {
                var onesignalid = data.oneSignal_Id
                console.log("signalid", onesignalid)
                var params = [onesignalid, user]
                var updatesignalid = await DBfunction.updateonesignalid(params)
                if (updatesignalid.status == 200) {
                    var user_id = [put.user_id]
                    console.log("user", user_id)
                    var finduser = await DBfunction.finduserbyuser(user_id)
                    var arr = finduser
                    console.log("arr", arr)
                    var usermpin = await DBfunction.finduserbyusermpin(user_id)
                    console.log("device", usermpin)
                    var str = usermpin.device_id
                    console.log("arr1234", str)
                    accessToken = await accesstoken.createAccessTocken(put.user_id, str)
                    console.log("accesstoken", accessToken.access_token)
                    if (!accessToken) {
                        isError = true
                    }
                    var userwallet = await DBfunction.finduserbywallet(user_id)
                    var arr2 = userwallet
                    console.log("arr2", arr2)
                    var user_id = [put.user_id]
                    console.log("user", user_id)
                    var getErrMsg = Utils.getErrorMessage(lang, "SUCCESS_SA08")
                    if (!userwallet) {
                        var wallet_info = {
                            "wallet_present": false,
                            "wallet_block": false,
                            "wallet_mobile": "",
                            "wallet_aadhaar_id": "",
                        }
                        console.log("put", put)
                        var response = {
                            "statusReason":"OK",
                            "data": {
                                "access_token": accessToken.access_token,  
                                "code": getErrMsg.code,
                                "message": getErrMsg.message,
                                "user": {}
                            },
                            "isSuccessful": true,
                            "success": true,
                            "statuscode": 200
                        }
                     
                    }

                    if (userwallet) {
                        var wallet_info = {
                            "wallet_present": true,
                            "wallet_block": userwallet.status == "BLOCKED" ? true : false,
                            "wallet_mobile": userwallet.wallet_mobile,
                            "wallet_aadhaar_id": userwallet.aadhaar_id
                        }
                        var response = {
                            "statusReason":"OK",
                            "data": {
                                "access_token": accessToken.access_token,  
                                "code": getErrMsg.code,
                                "message": getErrMsg.message,
                                "user": {}
                            },
                            "isSuccessful": true,
                            "success": true,
                            "statuscode": 200
                        }
                     
                    }
                    var value ={
                        "adhar_id": arr.aadhaar_id,
                        "date_created": arr.date_created,
                        "status_type": "",
                        "sso_mobile": arr.sso_mobile,
                        "bhamashah_id": arr.bhamashah_id,
                        "status_popupmessage_type": "",
                        "user_id": arr2.user_id,
                        "name": arr.name,
                        "email": arr.email,
                        "bhamashah_mid": arr.bhamashah_mid,
                        "date_last_edit": arr.date_last_edit,
                        "status": arr2.status,
                    }
                    response.data.user = Object.assign({}, value, wallet_info)
                    return resolve({
                        "status": 200,
                        "message": response
                    })
                } else {
                    return resolve(updatesignalid)
                }

            } else {
                var getErrMsg = await Utils.getErrorMessage(lang, "ERROR_EA12")
                var error = {
                    "code": getErrMsg.code,
                    "message": getErrMsg.message,
                }
                var err = {
                    "statusReason":"OK",
                    "error":error,
                    "isSuccessful": true,
                    "success": false,
                    'statuscode': 200
                }
                return resolve({"message":err,"status":400})
            }
        } else {
            var getErrMsg = await Utils.getErrorMessage(lang, "ERROR_EA02")
            var error = {
                "code": getErrMsg.code,
                "message": getErrMsg.message,
            }
            var err = {
                "statusReason":"OK",
                "error":error,
                "isSuccessful": true,
                "success": false,
                'statuscode': 200
            }
            return resolve({"message":err,"status":400})
        }

    })
}