'use strict';
var validator = require('validator');

const sqlQueryExec = require('../mysql_connection/query_execute');
const querys = require('../mysql_connection/quiries');
const errMsg = require('../message/errMsg');
const mysqlConnection = require('../mysql_connection/query_execute');
const query = require('../mysql_connection/quiries')

const Utils = require('../util/utils')

const walletService = require('../functions/walletService');
const AccessTokenDB= require('../functions/DBFunctions/AccessTokenDB')

module.exports = {
    actionCheckWalletBalance:actionCheckWalletBalance
}
async function actionCheckWalletBalance(req,callback) {
    var response = [];
        const accessToken = req.headers.access_token;
        const lang =  req.headers.user_language ? req.headers.user_language : 'en';
        var user = await AccessTokenDB.checkAccessToken(accessToken)
    if (!user) {
            var getErrMsg = Utils.getErrorMessage(lang, "ERROR_EA00")
           var response = {
                'success': false,
                "statusCode": 200,
                'error': {
                    'code': getErrMsg.code,
                    'message': getErrMsg.message,
                    'status_type': '',
                    'status_popupmessage_type': ''
                },
               
            };
           callback("",response)
        }
        if(message){
            await walletService.checkWalletBalance(user,lang).then(function (result) { 
                console.log(result,"sdasdasdasdas")
                callback("",result)
            })
        }else{
            var getErrMsg = Utils.getErrorMessage(lang, "ERROR_EA01")
            result = {
                'success': false,
                "statusCode": 200,
                'error': {
                    'code': getErrMsg.code,
                    'message': getErrMsg.message,
                    'status_type': '',
                    'status_popupmessage_type': ''
                },
               
            };
        callback("",result);
    }
}
