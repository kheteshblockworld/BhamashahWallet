var request = require('request');
var config = require('config');
var api_config = config.get('api_config')
const mysqlConnection = require('../../mysql_connection/query_execute');
const query = require('../../mysql_connection/quiries')
const validuser = require('../dbcheck.js')
const Utils = require('../../util/utils')
const replaceString = require('replace-string');
var date = require('date-and-time');


module.exports = {
    forgotMpin: forgotMpin,
    verifyMpinotp: verifyMpinotp
}

function forgotMpin(data) {
    return new Promise(async (resolve, reject) => {
        var errorCode = "ERROR_EA02";
        var user = ""
        var lang = data.lang
        console.log("data", data)
        try {
            if (data.mobiletype == 'wallet') {
                var mobile = data.mobile
                 user = await validuser.getValidUserByWalletMobile(mobile)
                console.log("walletdetails", user)
                if (user) {
                    var user_id = user.user_id
                    console.log(user_id)
                     user = await validuser.getValidUser(user_id)
                    console.log("userdetails", user)
                }
            } else {
                user = await validuser.getssomobile(data.mobile)
                console.log("user",user)
                var user_id = user.id
            }
            if (!user) {
                console.log("error")
                errcode = "ERROR_R26"
                throw new Error ("user not found")

            }
            console.log("success")
            var checkOTP = await validuser.getOtpByUserId(user_id)
            console.log("checkOTP", checkOTP)
            let now = new Date();
            var dateformat = Utils.dateFormate(now);
            let minutes = date.addMinutes(now, -1);
            console.log("date", minutes)
            if (!checkOTP || checkOTP.date_created < minutes) {
                var otp = await validuser.deleteuserid(user_id)
                console.log("otp",otp)
                if(!otp){
                    errorCode = "ERROR_R26"
                    throw new Error ("User not deleted")
                }
                var otpunique = false
                var otpCode = Utils.Otpgenerator(6)
                console.log("otp", otpCode)
                var otpref = Utils.Otprefgenerator(8)
                console.log("otpref", otpref)

                if (otpCode != 0 || otpref != 0) {
                    var Otpexists = await validuser.getOtpByCode(otpCode, otpref)
                    console.log(Otpexists)
                    var otpunique = true
                    console.log(otpunique)

                }
                if (!otpunique) {
                    errcode = "ERROR_EA05"
                    throw ("otp not unique")
                }
                var addOTP = await validuser.addNewotp(otpCode,otpref,user_id)
                console.log(addOTP)
                if (!addOTP) {
                    errcode = "ERROR_R26"
                    throw ("Error while adding Otp in db")
                }
            }
            var smsmessage1 = Utils.getmessage('SMS_FORGET_MPIN', data.lang)
            console.log("sms", smsmessage1)
            var sms = smsmessage1.message
            console.log(sms)
            var smsmessage = sms.replace('{otpCode}', otpCode)
            console.log("otp -->", smsmessage);
            console.log("----", data.mobile);
            var smsmessage2 = smsmessage.replace('{maskedWallet}',Utils.maskMobileNumber(data.mobile))
            console.log("maskedWallet", smsmessage2)
            var sendsms = await Utils.sendSMS(data.mobile, smsmessage)
            console.log("sendsms", sendsms)
            // if(sendsms="not enough balance for Bulk SMS"){
            //     return resolve({
            //         "status": 404,
            //         "message": sendsms
            //     })
            // }
            // else{
            var getErrMsg = await Utils.getErrorMessage(lang, "SUCCESS_SA04")
            var message = {
                "statusReason":"OK",
                "success": true,
                "data": {
                    "code": getErrMsg.code,
                    "message": getErrMsg.message,
                    "ref_no": otpref,
                },
                "isSuccessful": true,
                "success": true,
                "statuscode":200
            }
            return resolve({
                "status": 200,
                "message": message
            })
        // }
        } catch (error) {
            console.log("error",error)
            var getErrMsg = await Utils.getErrorMessage(lang, errcode)
            console.log("getErrMsg",getErrMsg)
            
            var err = {
                "code": getErrMsg.code,
                "message": getErrMsg.message,
                "statusReason":"OK",
                "success": false,
                "error": {
                   
                },
                "isSuccessful": true,
                "success": false,
                "status":200
            }
            
            return resolve(err)
        }
    })
}

async function verifyMpinotp(data) {
    var lang = data.lang
    console.log(lang)
    var errcode
    return new Promise(async (resolve, reject) => {
        try {
            console.log(data.otp)
            console.log(data.ref_no)
            var getotpdetails = await validuser.getotpdata(data.otp, data.ref_no)
            console.log("getotpdetails", getotpdetails)
            if (getotpdetails == false) {
                errcode = "ERROR_R05"
                throw errcode
            } else {
                var user_id = getotpdetails.user_id
                var user = await validuser.getValidUser(user_id)
                if(!user) {
                   
                    throw new Error("User not found")
                }
                console.log(user.data[0].sso_id)
                let now = new Date();
                var dateformat = Utils.dateFormate(now);
                let minutes = date.addMinutes(now, -1);
                console.log(minutes)
                if (getotpdetails.length != 0 && getotpdetails.date_created < minutes) {
                    var getErrMsg = await Utils.getErrorMessage(lang, "SUCCESS_SA05")

                    var response = {
                        "statusReason": "OK",
                        'success': true,
                        "statuscode":200,
                        'data': {
                            "code": getErrMsg.code,
                            "message": getErrMsg.message,
                            'sso_id': user.sso_id,
                            "status_popupmessage_type": "",
                            "status_type": "",
                            
                        }
                    }
                    var deleteotp =await validuser.deleteuserid(getotpdetails.user_id)
                    if(!deleteotp){
                        throw new Error("User id not deleted")
                    }
                    console.log("deleted", deleteotp)
                    return resolve({
                        "status": 200,
                        "message": response
                    })

                } else {
                    errcode = "ERROR_R05"
                    throw errcode
                }
            }
        } catch (error) {
            console.log("error", error)
            console.log(lang)
            var getErrMsg = Utils.getErrorMessage(lang, errcode)
            console.log("error", getErrMsg)
            var msg ={
                "code": getErrMsg.code,
                "message": getErrMsg.message,
            }
            var err = {
                "statusReason":"OK",
                "success": false,
                "error": {
                },
                "isSuccessful": true,
                "success": false,
                "status_popupmessage_type": "",
                "status_type": "",
                "statuscode":200
            } 
            err.error = msg
            return resolve({
                "status": 400,
                "message":err
            })

        }
    })

}