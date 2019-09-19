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
    checkWalletBalance:checkWalletBalance
}
async function checkWalletBalance(user,lang) {
    return new Promise(async (resolve, reject) => {
    var connection = await DBConfig.getConnection()
    console.log(connection.threadId)
    await connection.beginTransaction()
    try {
       var wallet = await walletDB.checkWalletByID(user.data[0].user_id);
       console.log(wallet,"wallet")
       console.log(wallet.wallet_mobile,"wallet.wallet_mobile")
       var params={
        "p1":wallet.wallet_mobile
       }
        var yresponse = await yesBankServices.curlWalletBalance(params)
        console.log(yresponse,"yresponse")
        if(yresponse.message['status_code'] == 'SUCCESS' && yresponse.message['code'] == '0'){
            var now = new Date()
            var date_last_edit = date.format(now, 'YYYY/MM/DD HH:mm:ss');
            console.log("date", date_last_edit)
            var walletstatus = [transcationType.STATUS_CLOSED,date_last_edit,user.data[0].user_id]
            console.log(walletstatus,"walletstatus")
            walletstatusupdate = await walletDB.updatewstatus(walletstatus)
            if(!walletstatusupdate){
                throw new Exception("Error in updating wallet status into database");                    
            }
            connection.commit();

          var suc = Utils.getErrorMessage("wc_00",lang);
            result = {
            'success': true,
            'data': {
                'code': suc.code,
                'message': suc.message,
                'status_type': '',
                'status_popupmessage_type': ''
            },
        };
        return resolve(result);
    }
        else if(yresponse['status_code'] == 'ERROR'){
            var getErrMsg = Utils.getErrorMessage(yresponse['status_code']+'_'+yresponse['code'],lang);
            result = {
                'success': false,
                'data': {
                    'code': getErrMsg.code,
                    'message': getErrMsg.message,
                    'status_type': '',
                    'status_popupmessage_type': ''
                },
            };
            return resolve(result);
        }
        else{
            throw new Exception('error on curl CloseWallet');
        } 
       
       } catch (err) {
        connection.rollback();
        var getErrMsg = Utils.getErrorMessage(lang, "ERROR_EA02");
        result = {
            'success': false,
            'data': {
                'code': getErrMsg.code,
                'message': getErrMsg.message,
                'status_type': '',
                'status_popupmessage_type': ''
            },
        };
       return resolve(result);

}
}) 
}