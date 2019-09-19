'use strict';
var validator = require('validator');
var Utils = require('../util/utils');
const mysqlConnection = require('../mysql_connection/query_execute');
const query = require('../mysql_connection/quiries')
const logoutFun = require('../functions/Logout/logout');
module.exports = {
    logoutValidation: logoutValidation
}


function logoutValidation(req, callback) {
// return new Promise( function(resolve, reject) {
    const accessToken = req.headers.access_token;
    console.log("accessToken", accessToken);
    const h_lang = req.headers.user_language;
    if(h_lang=="en" || h_lang=="hi"){
     var lang = h_lang;
    }else{
        var lang = ""; 
    }
    
    if (!accessToken || !accessToken.trim()) {
        var getErrMsg = Utils.getErrorMessage(lang, "ERROR_EA01")
                var response = {
                    'success': false,
                    "status": 400,
                    'error': {
                        'code': getErrMsg.code,
                        'message': getErrMsg.message,
                        'status_type': '',
                        'status_popupmessage_type': ''
                    },
                };
            callback(response)
    } else {
        // 

        mysqlConnection.query_execute(query.findaccesstoken_access_token, accessToken).then(function(result) {
            console.log(result.data, "result")
            if (result.data.length === 0) {

                
                var getErrMsg = Utils.getErrorMessage(lang, "ERROR_EA00")
                var response = {
                    'success': false,
                    "status": 400,
                    'error': {
                        'code': getErrMsg.code,
                        'message': getErrMsg.message,
                        'status_type': '',
                        'status_popupmessage_type': ''
                    },
                };
            callback(response)

            } else {
                    var params = req.body;
                    params.user = result.data[0];
                    params.lang = lang;
                    logoutFun.logout(params).then(function(result)  {                  
               console.log(result,"result")
               if (result.statusCode == 200) {
               callback(result)
              }
            },function(error){
                callback(error)

            });
        
               }
    
    
            })
            }

//})

}
