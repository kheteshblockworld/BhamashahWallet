var request = require('request');
var config = require('config');
var api_config = config.get('api_config')
const mysqlConnection = require('../../mysql_connection/query_execute');
const query = require('../../mysql_connection/quiries')
var dateFormat = require('dateformat');
var accesstoken = require('./createAccessToken')
var message = require('../../message/messageEN')
const Utils = require('../../util/utils')
var DBfunction = require('../DBFunctions/MpinDB')

var sha1 = require('sha1');
const addData = require('../../sdk/invoke');


module.exports = {
    createMpin: createMpin
}

async function createMpin(data) {
    var isError;
    var accessToken
    var errorCode = "ERROR_EA02"
    var lang = data.lang
    isError = false
    return new Promise(async (resolve, reject) => {
        try {
        var user = [data.device_ID]
        //only one device ID Exist at a time
        var deletedevice = await DBfunction.deletedeviceid(user)
        if (deletedevice.status == 200) {
            var user_id = [data.user_ID]
            //only one login allowed
            var onelogin = await DBfunction.finduserbyusermpin(user_id)
            var user_id = data.user_ID
            var device_id = data.device_ID
            var Mpin = data.Mpin
            var onesignalid = data.oneSignal_Id
            var lastdate = data.date
            var storearr = [user_id, device_id, sha1(Mpin), onesignalid, lastdate]
            if (!onelogin) {
                // inserting MPIN in database
                var insertmpin = await DBfunction.creatempin(storearr)
                if (insertmpin.status == 200) {
                    accessToken = await accesstoken.createAccessTocken(data.user_ID, data.device_ID)
                    console.log("access",accessToken)
                    if (!accessToken) {
                        isError = true
                    }
                } else {
                    isError = true
                }
            } else {
                //updating data in database
                var params = [device_id, Mpin, onesignalid, lastdate, user_id]
                var updatempin = DBfunction.updatempin(params)
                if (updatempin.status == 200) {
                    accessToken = await accesstoken.createAccessTocken(data.user_ID, data.device_ID)
                    if (!accessToken) {
                        isError = true
                    }
                } else {
                    isError = true
                }
            }
            if (!isError) {
                var user_id = [data.user_ID]
                var finduser = await DBfunction.finduserbyuser(user_id)
                var arr1 = finduser
                if (finduser) {
                    var user_id = [data.user_ID]
                    var userwallet = await DBfunction.finduserbywallet(user_id)
                    var arr2 = userwallet
                    var getErrMsg = await Utils.getErrorMessage(lang, "SUCCESS_SA07")
                    if (!userwallet) {
                        var wallet_info = {
                            "wallet_present": false,
                            "wallet_block": false,
                            "wallet_mobile": "",
                            "wallet_balance": "",
                            "wallet_aadhaar_id": "",
                        }
                        var response = {
                            "statusReason": "OK",
                            
                            "data": {
                                "access_token": accessToken.access_token,
                                "code": getErrMsg.code,
                                "message": getErrMsg.message,
                                "user": {},
                            },
                            "isSuccessful": true,
                            "success": true,
                            "statuscode":200
                        }
                        var MPIN = "MPIN"
                        var key = arr1.blockchain_key+"_"+MPIN
                        console.log("key",key)
                        var value = {
                            "MPIN":data.Mpin,
                            "Device_ID":data.device_ID,
                            "onesignal_ID":data.oneSignal_Id,
                            "date_last_edit": arr1.date_last_edit,
                        }
                        var params = {
                            "key": key,
                            "value": value
                        }
                        console.log("key", key)
                        var bcstore = await addData.addDataWithOutArrayList(params)
                        if (bcstore.status != 200) {
                            errorCode = "ERROR_EA02"
                            throw new Error("Error while storing blockchain")
                        }
                    }
                    if (userwallet) {
                        var wallet_info = {
                            "wallet_present": true,
                            "wallet_block": userwallet.status == "BLOCKED" ? true : false,
                            "wallet_mobile": userwallet.wallet_mobile,
                            "wallet_aadhaar_id": userwallet.aadhaar_id,
                            "wallet_balance": userwallet.wallet_balance
                        }
                        var response = {
                            "statusReason": "OK",
                            "access_token": accessToken.access_token,
                            "data": {
                                "code": getErrMsg.code,
                                "message": getErrMsg.message,
                                "user": {},   
                            },
                            "isSuccessful": true,
                            "success": true,
                            "statuscode": 200
                        }
                        var key = arr1.blockchain_key+"_"+MPIN
                        var value = {
                            "MPIN":data.Mpin,
                            "Device_ID":data.device_ID,
                            "onesignal_ID":data.oneSignal_Id,
                            "date_last_edit": arr1.date_last_edit,
                        }
                        var params = {
                            "key": key,
                            "value": value
                        }
                        var bcstore = await addData.addDataWithOutArrayList(params)

                        if (bcstore.status != 200) {
                            errorCode = "ERROR_EA02"
                            throw new Error("Error while storing blockchain")

                        }
                   }
                   var value ={
                    "adhar_id": arr2.aadhaar_id,
                    "date_created": arr1.date_created,
                    "status_type": "",
                    "sso_mobile": arr1.sso_mobile,
                    "bhamashah_id": arr1.bhamashah_id,
                    "status_popupmessage_type": "",
                    "user_id": arr2.user_id,
                    "name": arr1.name,
                    "email": arr1.email,
                    "bhamashah_mid": arr1.bhamashah_mid,
                    "date_last_edit": arr1.date_last_edit,
                    "status": arr2.status
                   }
                    response.data.user = Object.assign({}, value, wallet_info)
                    return resolve({
                        "status": 200,
                        "message": response,

                    })
                }
                 } else {
                var getErrMsg = Utils.getErrorMessage(lang, errorCode)
                var error = {
                    "code": getErrMsg.code,
                    "message": getErrMsg.message,
                }
                var err ={
                    "statusReason":"OK",
                    "error":error,
                    "isSuccessful": true,
                    "success": false,
                    'statuscode': 200
                }
                return resolve({
                    "status":400,
                    "message": err
                })
            }
        } else {
            errorCode = "ERROR_EA02"
            throw new Error("data was not there")
        }
    }
    catch(err){

        var getErrMsg = Utils.getErrorMessage(lang, errorCode);
                console.log("getErrMsg", getErrMsg)
               var response = {
                    'success': false,
                    'status': 200,
                    'data': {
                        'code': getErrMsg.code,
                        'message': getErrMsg.message,
                        'status_type': '',
                        'status_popupmessage_type': ''
                    },
                }
                return resolve({ "status":400,
                "message": response})
    }
    })
}