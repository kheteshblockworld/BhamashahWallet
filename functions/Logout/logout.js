'use strict';
const UserDB = require('../../functions/DBFunctions/UsersDB')
const Utils = require('../../util/utils')

module.exports = {
    logout: logout
}

function logout(req) {
    return new Promise(async (resolve, reject) => {
       
        var lang = req.lang;
        var id = req.user.id;
        var response;
        var getLogout = await UserDB.logout(id)
        if(getLogout !== false){

            var getErrMsg = Utils.getErrorMessage(lang, "SUCCESS_UL00")
            var finalObj = {
                "statusReason": "OK",
                "data": {
                    "code": getErrMsg.code,
                    "status_popupmessage_type": "",
                    "status_type": "",
                    "message": getErrMsg.message
                },
                "isSuccessful": true,
                "success": true,
                "statusCode": 200
            }
            return resolve(finalObj)

        }else{

           var getErrMsg = Utils.getErrorMessage(lang, "ERROR_EA00")
            response = {
                'success': false,
                'error': {
                    'code': getErrMsg.code,
                    'message': getErrMsg.message,
                    'status_type': '',
                    'status_popupmessage_type': ''
                },
                "statusCode": 200
            };
            return resolve(response)
        }
    })
}