/**
 * @author: Rakesh C
 * @version: 1.0.0
 * @date: October 17, 2018
 * @Description: Common Function for RPP request.
 */
var config = require('config');
var rppServices = config.get('rppServices');
var request = require('request');


module.exports = {
    rppAction:rppAction,
    verifyTransaction:verifyTransaction,
    refundTransaction:refundTransaction
}

function verifyTransaction(prn, amount){
    postFields = {
        'MERCHANTCODE' : rppServices.rppMerchantCode,
        'PRN' : prn,
        'AMOUNT' : amount
    };
    return rppAction(rppServices.rppVerificationUrl,postFields);
}

function refundTransaction(prn, amount, rppTxnId, subOrderId){
    postFields = {
        'MERCHANTCODE' : rppServices.rppMerchantCode,
        'PRN' : prn,
        'AMOUNT' : amount,
        'RPPTXNID' : rppTxnId,
        'APINAME' : 'TXNREFUND',
        'SUBORDERID' : subOrderId,
    };
    return rppAction(rppServices.rppRefundUrl,postFields);
}

function rppAction(url,data) {
    return new Promise((resolve) => {
        // Set the headers
        var headers = {
            'cache-control': 'no-cache',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        // Configure the request
        var options = {
            url: url,
            method: 'POST',
            headers: headers,
            form: data
        }
        // Start the request
        request(options, function (error, response, body) {
            // Print out the response body
            console.log(body)
            resolve(body);

        })
    })
}