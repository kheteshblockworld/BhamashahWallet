/**
 * @author: Neelima
 * @version: 1.0.0
 * @date: October20, 2018
 * @Description: Payment controller.
 */
var request = require('request');
var config = require('config');
const getChecksum = require('../util/generateChecksum');
const DBConfig = require('../mysql_connection/query_execute');
const AccessTokenDB = require('../functions/DBFunctions/AccessTokenDB')
const query = require('../mysql_connection/quiries');
var format = require('date-format');
var uniqid = require('uniqid');
const Utils = require('../util/utils')
const paymentController= require('../functions/PaymentController')
const yesBankServices = require('../functions/YesBankServices/yesBankServices');
// const errMsg = require('../message/errMsg');
const transcationType = require('../message/transcationType');
var dateFormat = require('dateformat');
const walletDB = require('../functions/DBFunctions/WalletDB')
const UserDB = require('../functions/DBFunctions/UsersDB')
let date = require('date-and-time');

const Transactiondb = require('../functions/DBFunctions/TransactionDB')


module.exports = {
    submitFeedback:submitFeedback
}
async function submitFeedback(lang,userId,message) {
    return new Promise(async (resolve, reject) => {
        var now = new Date()
            var date_last_edit = date.format(now, 'YYYY/MM/DD HH:mm:ss');
            console.log("date", date_last_edit)
            var feedback = [userId,message,date_last_edit]
            feedback = await walletDB.feedbackstatus(feedback)
            if(feedback){
            var suc = Utils.getErrorMessage(lang,"SUCCESS_SA10");
           var  result = {
            'success': true,
            'statusCode':200,
            'data': {
                'code': suc.code,
                'message': suc.message,
                'status_type': '',
                'status_popupmessage_type': ''
            },
        };
        return resolve(result)
        }
            else {
               var response =  Utils.getMessage(lang,"ERROR_EA20" );
            }
            return resolve(response);
        })
}