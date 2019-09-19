'use strict';
var validator = require('validator');

const sqlQueryExec = require('../mysql_connection/query_execute');
const querys = require('../mysql_connection/quiries');
const errMsg = require('../message/errMsg');
const mysqlConnection = require('../mysql_connection/query_execute');
const query = require('../mysql_connection/quiries')

const Utils = require('../util/utils')

const transactionService = require('../functions/transactionService');
const AccessTokenDB= require('../functions/DBFunctions/AccessTokenDB')

module.exports = {
    wallettowalletValidation: wallettowalletValidation,
    actionImpsTransfer: actionImpsTransfer
}

async function wallettowalletValidation(req, callback) {
    const accessToken = req.headers.access_token;
    const lang = req.headers.user_language ? req.headers.user_language : 'en';
    var accessTokenModal = await AccessTokenDB.checkAccessToken(accessToken)
    if (!accessTokenModal) {
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
    console.log(accessTokenModal,"userId")
    if(!amount ||!tagName ||!beneficiaryMobile){       
      var amount = req.body.amount;
      var tagName = req.body.tag_name;
      var beneficiaryMobile = req.body.beneficiary_mobile
      transactionService.fundTransfer(lang,accessTokenModal.data[0].user_id,accessTokenModal,amount,tagName,beneficiaryMobile).then(function (result) {
          console.log(result,"sdasdasdasdas")
          callback("",result)
      })
    
    }else {
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
        callback("",result)
    }
    }

    
//wallettobank
async function actionImpsTransfer(req,callback) {
    var response = [];
        const accessToken = req.headers.access_token;
        const lang =  req.headers.user_language ? req.headers.user_language : 'en';
        var userId = await AccessTokenDB.checkAccessTokenGetID(accessToken)
        console.log(userId)
        if (!userId) {
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
        console.log(userId,"userId")
        if(!amount ||!remark ||!beneficiaryId){       
            var amount = req.body.amount;
                    var remark = req.body.remark;
                    var beneficiaryId = req.body.beneficiary_id
                  transactionService.ImpsTransfer(lang, userId, amount, remark, beneficiaryId).then(function(result){
                    console.log(result,"sdasdasdasdas")
                    callback("",result)
                    })
        }else {
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
            callback("",result)
        }
        }


           