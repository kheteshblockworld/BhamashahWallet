
'use strict';

const mysqlConnection = require('./../mysql_connection/query_execute');
const query = require('./../mysql_connection/quiries')
const closewallet = require('./../functions/WalletServices/closewallet')
const Utils = require('../util/utils')

module.exports = {
    closewalletvalidation: closewalletvalidation,
   
}

function closewalletvalidation(req, callback) {
    const lang = req.headers.user_language ? req.headers.user_language : "en"
    console.log("lang",lang)
    const accessToken = req.headers.access_token
    console.log("accessToken",accessToken)
    var value = {
        lang:lang,
        accessToken:accessToken
    }
    var params = [accessToken]
    if (!accessToken || !accessToken.trim()) {
     var err = {
            "status": 400,
            "message": 'fields should not be empty'
        }
        callback(err, "");
    } else {
        mysqlConnection.query_execute(query.readaadharkyc, params)
        .then(function (result) {
            console.log("result....>>>",result)
            if(result.data.length==0){

            var getErrMsg = Utils.getErrorMessage(value.lang, "ERROR_EA00")
            var  response = {
            'success': false,
            'status':200,
            'error': {
                'code': getErrMsg.code,
                'message': getErrMsg.message,
                'status_type': '',
                'status_popupmessage_type': ''
            },
        };
                
                callback(response,"")
            }
            
            else {
                var user_id = result.data[0].user_id
                closewallet.closewallet(user_id,value).then(function(result){
                    console.log("resultwallet",result)
                   callback("",result)
                })

            }
        }).catch(function (err) {
            callback(err, "");
        })
    }
}

