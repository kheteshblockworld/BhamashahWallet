'use strict';
var request = require('request');
var config = require('config');
var api_config = config.get('api_config')
var Utils = require('../../util/utils')
const mysqlConnection = require('../../mysql_connection/query_execute');
const query = require('../../mysql_connection/quiries')
const addData = require('../../sdk/invoke');
var DBfunction = require('../DBFunctions/MpinDB');
var DBConfig = require('../../mysql_connection/query_execute')

module.exports = {
    authenticateSSOID: authenticateSSOID
}
 async function authenticateSSOID(req, callback) {
    var value
    var bcstore
    var errorCode
    var response = {}
    const UserName = req.body.UserName
    const Password = Buffer.from(req.body.Password).toString('base64');
    const Application = req.body.Application
    const lang = req.headers.lang ? req.headers.lang : "en" 
    console.log(Password)

    if (!UserName || !UserName.trim() || !Password || !Password.trim()  || !Application || !Application.trim()) {
        var getErrMsg = await Utils.getErrorMessage(lang, "ERROR_EA01")
        var error ={
            "code": getErrMsg.code,
            "message": getErrMsg.message
        }
        var err = {
            "status": 401,
            "message": error,
            "status_type": "",
            "status_popupmessage_type": ""
        }
        callback(err,"");
    } else {
        var json = {
            "UserName": UserName,
            "Password": Password,
            "Application": Application
        };
        var options = {
            url: api_config.AuthenticateSSO,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            json: json
        };
        request(options, async function (err, res, body) {
            // console.log(res,"res")
            // if (res.body.valid == true && res.body.bhamashahId != null && res.body.bhamashahMId != null)
            if (res.body.valid == true) {
                var user = json.UserName
                var result = await DBfunction.getSSOuser(user)
                console.log("result",result)
                    if (result && result.status == "INACTIVE") {
                        var getErrMsg = await Utils.getErrorMessage(lang, "ERROR_EA09")
                        response = {
                            'success': false,
                            'status': 200,
                            'data': {
                                'code': getErrMsg.code,
                                'message': getErrMsg.message,
                                'status_type': '',
                                'status_popupmessage_type': ''
                            },
                        }
                        callback(response,"")
                    }
                    var get = res.body
                    console.log("get", get)
                    var sso_id = user ? user: "";
                    var blockchain_key = Utils.getUniqId(get.mobile)
                    console.log("key",blockchain_key)
                    var name = get.displayName ? get.displayName:"";
                    var sso_mobile = get.mobile ? get.mobile:"";
                    var email = get.mailPersonal ? get.mailPersonal:"";
                    var bhamashah_id = get.bhamashahId ? get.bhamashahId:"";
                    var bhamashah_mid = get.bhamashahMId ? get.bhamashahMId:"";
                    var adhar_id = get.aadhaarId ?  get.aadhaarId:"";
                    var dob = null;
                    var gender = null;
                    var address = null;
                    var language = lang ? lang:"";
                    var status = "ACTIVE";
                    if (!result) {
                        var now = new Date()
                        var date_created = Utils.dateFormate(now);
                        var insertdata = [sso_id, blockchain_key, name, sso_mobile, email, bhamashah_id, bhamashah_mid, adhar_id, dob, gender, address, language, status, date_created, date_last_edit]
                        var insert = await DBfunction.insertuser(insertdata)
                        if(!insert){
                            var getErrMsg = Utils.getErrorMessage(lang, "ERROR_EA02")
                                    response = {
                                        'success': false,
                                        'status': 200,
                                        'data': {
                                            'code': getErrMsg.code,
                                            'message': getErrMsg.message,
                                            'status_type': '',
                                            'status_popupmessage_type': ''
                                        },
                                    }
                                    callback(response,"")
                        }
                            var user = "user"
                            var key = blockchain_key+"_"+user
                            console.log("key", key)
                            value = {
                                "sso_id": sso_id,
                                "name": name,
                                "sso_mobile": sso_mobile,
                                "email": email,
                                "bhamashah_id": bhamashah_id,
                                "bhamashah_mid": bhamashah_id,
                                "adhar_id": adhar_id,
                                "dob": dob,
                                "gender": gender,
                                "address": address,
                                "language": language,
                                "status": status,
                                "date_created": date_created
                            }
                            console.log("value", value)
                         
                            
                                var params = {
                                    "key": key,
                                    "value": value
                                }
                                 bcstore = await addData.addDataWithOutArrayList(params)
                                console.log("blockchain", bcstore)
                                 if(bcstore.status!=200) {
                                    var getErrMsg = Utils.getErrorMessage(lang, "ERROR_EA02")
                                    response = {
                                        'success': false,
                                        'status': 200,
                                        'data': {
                                            'code': getErrMsg.code,
                                            'message': getErrMsg.message,
                                            'status_type': '',
                                            'status_popupmessage_type': ''
                                        },
                                    }
                                    callback(response,"")
                                }
                        
                    } else {
                        var now = new Date()
                        var date_last_edit = Utils.dateFormate(now);
                        var params = [date_last_edit, user]
                        var update =await DBfunction.updateuserdate(params)
                        console.log("update",update)
                        if(!update){
                            var getErrMsg = Utils.getErrorMessage(lang, "ERROR_EA02")
                                    response = {
                                        'success': false,
                                        'status': 200,
                                        'data': {
                                            'code': getErrMsg.code,
                                            'message': getErrMsg.message,
                                            'status_type': '',
                                            'status_popupmessage_type': ''
                                        },
                                    }
                                    callback(response,"")
                        }
                        var user = "user"
                            var key = blockchain_key+"_"+user
                            console.log("key", key)
                            value = {
                                "sso_id": sso_id,
                                "name": name,
                                "sso_mobile": sso_mobile,
                                "email": email,
                                "bhamashah_id": bhamashah_id,
                                "bhamashah_mid": bhamashah_id,
                                "adhar_id": adhar_id,
                                "dob": dob,
                                "gender": gender,
                                "address": address,
                                "language": language,
                                "status": status,
                                "date_created": date_last_edit
                            }
                            console.log("value", value)
                            
                                var params = {
                                    "key": key,
                                    "value": value
                                }
                                 bcstore = await addData.addDataWithOutArrayList(params)
                                console.log("blockchain", bcstore)
                               
                                 if(bcstore.status!=200) {
                                    var getErrMsg = Utils.getErrorMessage(lang, "ERROR_EA02")
                                    response = {
                                        'success': false,
                                        'status': 200,
                                        'data': {
                                            'code': getErrMsg.code,
                                            'message': getErrMsg.message,
                                            'status_type': '',
                                            'status_popupmessage_type': ''
                                        },
                                    }
                                    callback(response,"")
                                }
                            }
                    if(bcstore.status==200){
                        var getuser =await DBfunction.getSSOuser(user)
                        console.log(getuser)
                        var req = getuser
                        var getErrMsg = Utils.getErrorMessage(lang, "SUCCESS_SA00")
                        var response = {
                            'success': true,
                            'code': getErrMsg.code,
                            'message':getErrMsg.message,
                            'data': {
                                'user_id': req.id,
                                'status_type': '',
                                'status_popupmessage_type': ''
                            },
                            "isSuccessful": true,
                            "success": true,
                        }
                        response.data = value
                        var success = {
                            "status": 200,
                            "message": response
                        }
                      callback("",success)
                
                }


                
            } else {
                if (res.body.valid == false) {
                    var getErrMsg = Utils.getErrorMessage(lang, "ERROR_EA08")
                    response = {
                        'success': false,
                        'status': 200,
                        'data': {
                            'code': getErrMsg.code,
                            'message': getErrMsg.message,
                            'status_type': '',
                            'status_popupmessage_type': ''
                        },
                    }
                    callback(response,"")
                } else {
                    var getErrMsg = Utils.getErrorMessage(lang, "ERROR_EA07")
                    response = {
                        'success': false,
                        'status': 200,
                        'data': {
                            'code': getErrMsg.code,
                            'message': getErrMsg.message,
                            'status_type': '',
                            'status_popupmessage_type': ''
                        },
                    }
                    callback(response,"")
                }
            }
        })
    }

}