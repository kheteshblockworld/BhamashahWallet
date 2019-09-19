var request = require('request');
var config = require('config');
var api_config = config.get('api_config')
const mysqlConnection = require('../../mysql_connection/query_execute');
const query = require('../../mysql_connection/quiries')
var DBfunction = require('../DBFunctions/AccessTokenDB')
var dbdetails = require('../DBFunctions/MpinDB')
var Utils = require('../../util/utils')
var sha1 = require('sha1');
module.exports = {
    changeMpin: changeMpin
}

async function changeMpin(data) {
    return new Promise(async (resolve, reject) => {
        var isError
        var lang = data.lang
        // userid should pick from accesstoken table for now it is hardcoded
        var user = await DBfunction.checkAccessTokenGetID(data.accessToken)
        console.log("user", user)
        if (!user) {
            var getErrMsg = await Utils.getErrorMessage(lang, "ERROR_EA00")
            var err = {
                "code": getErrMsg.code,
                "message": getErrMsg.message,
            }
            var error = {
                "statusResponse":"OK",
                "isSuccessful": true,
                "success":false,
                "error": {},
                'status_type' : '',
                'status_popupmessage_type' : '',
                "statuscode":200
            }
            error.error = err
            var err = {
                "status": 401,
                "message":error
            }
            return resolve(err)
        }
            var finduser =await dbdetails.finduserbyusermpin(user)
            console.log("finduder",finduser)
            if (finduser) {
                console.log(finduser.mpin)
                var mpin = finduser.mpin
                console.log("mpin", mpin)
                if (sha1(data.oldmpin) != mpin) {
                    isError = true
                    var getErrMsg = Utils.getErrorMessage(lang, "ERROR_CP01")
                    var error1 = {
                        "code": getErrMsg.code,
                        "message": getErrMsg.message,
                    }
                    var err = {
                        "statusResponse":"OK",
                        "isSuccessful": true,
                        "success":false,
                        "error": {},
                        'status_type' : '',
                        'status_popupmessage_type' : '',
                        "statuscode":200
                    }
                    err.error = error1
                    var err1 = {
                        "status": 401,
                        "message": err
                    }

                    return resolve(err1)
                } else if (data.newmpin != data.confirmmpin) {
                    isError = true
                    var getErrMsg = Utils.getErrorMessage(lang, "ERROR_CP02")
                    var error2 ={
                        "code": getErrMsg.code,
                        "message": getErrMsg.message,
                    }
                    var err = {
                        "statusResponse":"OK",
                        "isSuccessful": true,
                        "success":false,
                        "error": {},
                        'status_type' : '',
                        'status_popupmessage_type' : '',
                        "statuscode":200
                    }
                    err.error = error2
                    var err2 = {
                        "status": 401,
                        "message":err
                    }
                    return resolve(err2)
                } else {
                    isError = false
                    var newmpin = data.newmpin
                    console.log(newmpin)
                    var params = [sha1(newmpin), user]
                    var updatempin =await dbdetails.updatenewmpin(params)
                        if (updatempin.status == 200) {
                            var getErrMsg = Utils.getErrorMessage(lang, "SUCCESS_CP00")
                           
                    var response = {
                        "statusReason": "OK",
                        'success': true,
                        "statuscode":200,
                        'data': {
                            "code": getErrMsg.code,
                            "message": getErrMsg.message,
                            "status_popupmessage_type": "",
                            "status_type": "",
                            
                        }
                    }
                            return resolve({"status":200,"message":response})
                        } else {
                            var getErrMsg = Utils.getErrorMessage(lang, "ERROR_EA01")
                            var response = {
                                "statusReason": "OK",
                                'success': false,
                                "statuscode":200,
                                'data': {
                                    "code": getErrMsg.code,
                                    "message": getErrMsg.message,
                                    "status_popupmessage_type": "",
                                    "status_type": "",
                                    
                                }
                            }
                            return resolve({"status":200,"message":response})
                        }
                }
            } else {
                return resolve(finduser)
            }
        
    })
}