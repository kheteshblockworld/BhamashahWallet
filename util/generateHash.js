/**
 * @author: Sathiyan Baskaran
 * @version: 1.0.0
 * @date: October 16, 2018
 * @Description: Emitra validation function for validating user inputs.
 */
'use strict';
const crypto = require('crypto');
var CryptoJS = require("crypto-js");
var format = require('date-format');
var config = require('config');
var eMitra = config.get('eMitra');
var md5 = require('js-md5');
var sha256 = require('sha256');
var aes256 = require('aes256');
var runner = require("child_process");
var execPhp = require('exec-php');

module.exports = {
    generateHash: generateHash,
    decryptHash: decryptHash,
    generateHashCheckSum: generateHashCheckSum,
    generateRppHashCheckSum: generateRppHashCheckSum,
    generateCheckSum: generateCheckSum
}
/**
 * @author: Sathiyan Baskaran
 * @version: 1.0.0
 * @date: October 17, 2018
 * @Description: AES-128 algorithm for encrypting data.
 */
function generateHash(req) {
    var data = req;
    return new Promise((resolve, reject) => {
        execPhp('encryption.php', function (error, php, outprint) {
            debugger;
            console.log("php=====>",php);
            php.encryption(data, function (err, result, output, printed) {
                console.log("result======>", result);
                resolve(result);
            });
        });


    })
}
/**
 * @author: Sathiyan Baskaran
 * @version: 1.0.0
 * @date: October 17, 2018
 * @Description: Function for creating md5 checksum data.
 */
function generateHashCheckSum(prn, commtype, transaction_id, serviceId, consumerKey, name, officeCode, mobile, lookupId, revenuHead) {
    return new Promise((resolve, reject) => {
        var date = format('yyyyMMddhhmmssSSS', new Date());
        console.log("eMitra====>", eMitra.eMitraSSOID);
        var checkSumPram = {};
        checkSumPram.SSOID = eMitra.eMitraSSOID, // "SSOTESTKIOSK1",
            checkSumPram.REQUESTID = prn,
            checkSumPram.REQTIMESTAMP = date,
            checkSumPram.SSOTOKEN = "0"
        var checkSum = md5(JSON.stringify(checkSumPram));
        var string = {};
        // string.MERCHANTCODE = eMitra.eMitraMerchantCode;
        // string.REQUESTID = ""+prn+"";
        // string.REQTIMESTAMP = date;
        // string.SERVICEID = serviceId;
        // string.SUBSERVICEID = '';
        // string.REVENUEHEAD = revenuHead;
        // string.CONSUMERKEY = consumerKey;
        // string.CONSUMERNAME = name;
        // string.COMMTYPE = commtype;
        // string.SSOID = eMitra.eMitraSSOID;
        // string.OFFICECODE = officeCode;
        // string.SSOTOKEN = '0';
        string.MERCHANTCODE = eMitra.eMitraMerchantCode;
        string.REQUESTID = "" + prn + "";
        string.REQTIMESTAMP = date;
        string.SERVICEID = serviceId;
        string.SUBSERVICEID = "";
        string.REVENUEHEAD = revenuHead;
        string.CONSUMERKEY = consumerKey;
        string.CONSUMERNAME = name;
        string.COMMTYPE = commtype;
        string.SSOID = eMitra.eMitraSSOID;
        string.OFFICECODE = officeCode;
        string.SSOTOKEN = '0';
        // string.PAYMODE = "771";
        // string.BANKREFNUMBER = "";
        // string.MOBILENUMBER = mobile;
        // string.EMAILID = "";
        string.CHECKSUM = checkSum;
        var data = JSON.stringify(string);
        console.log("data=======>", data);
        resolve(data);
    })
}

/**
 * @author: Sathiyan Baskaran
 * @version: 1.0.0
 * @date: October 17, 2018
 * @Description: Function for creating md5 checksum data.
 */
function generateRppHashCheckSum(prn, commtype, transaction_id, serviceId, consumerKey, name, officeCode, mobile, lookupId, revenuHead, amountDec) {
    return new Promise((resolve, reject) => {
        var date = format('yyyyMMddhhmmssSSS', new Date());
        var checkSum = md5(JSON.stringify(prn + '|' + amountDec + '|' + eMitra.eMitraWebAppChecksumKey));
        var string = {};
        string.MERCHANTCODE = eMitra.eMitraMerchantCode;
        string.PRN = prn;
        string.REQTIMESTAMP = date;
        string.AMOUNT = amountDec;
        string.SUCCESSURL = "";
        string.FAILUREURL = "";
        string.USERNAME = name;
        string.USERMOBILE = mobile;
        string.USEREMAIL = '';
        string.UDF1 = "udf1";
        string.UDF2 = "udf1";
        string.SERVICEID = serviceId;
        string.CONSUMERKEY = consumerKey;
        string.LOOKUPID = lookupId;
        string.OFFICECODE = officeCode;
        string.REVENUEHEAD = revenuHead;
        string.COMMTYPE = commtype;
        string.CHECKSUM = checkSum;
        var data = JSON.stringify(string);
        console.log("data=======>", data);
        resolve(data);
    })
}

/**
 * @author: Rakesh C
 * @version: 1.0.0
 * @date: October 17, 2018
 * @Description: Function for creating md5 checksum data.
 */
function generateCheckSum(merchantCode, prn, amount, checksumKey) {
    var string = merchantCode + '|' +
        prn + '|' +
        amount + '|' +
        checksumKey;
    return md5(string)
}
/**
 * @author: Sathiyan Baskaran
 * @version: 1.0.0
 * @date: October 17, 2018
 * @Description: AES-128 algorithm for decrypting data.
 */
function decryptHash(data) {
    return new Promise(async(resolve, reject) => {
        execPhp('encryption.php', function(error, php, outprint){
            php.decryption(data, function(err, result, output, printed){
                resolve(result);
            });
        });


    })
    /**
     * @author: Sathiyan Baskaran
     * @version: 1.0.0
     * @date: October 17, 2018
     * @Description: AES-256 algorithm for decrypting data.
     */

    function tripleDecryption(data) {
        return new Promise((resolve, reject) => {
            var date = format('yyyyMMddhhmmssSSS', new Date());
            console.log("eMitra====>", eMitra.eMitraSSOID);
            var checkSumPram = {};
            checkSumPram.SSOID = eMitra.eMitraSSOID, // "SSOTESTKIOSK1",
                checkSumPram.REQUESTID = "" + prn + "",
                checkSumPram.REQTIMESTAMP = date,
                checkSumPram.SSOTOKEN = "0"
            var checkSum = md5(JSON.stringify(checkSumPram));
            var string = {};
            string.MERCHANTCODE = eMitra.eMitraMerchantCode;
            string.REQUESTID = "" + prn + "";
            string.REQTIMESTAMP = date;
            string.SERVICEID = serviceId;
            string.SUBSERVICEID = '';
            string.REVENUEHEAD = revenuHead;
            string.CONSUMERKEY = consumerKey;
            string.CONSUMERNAME = name;
            string.COMMTYPE = commtype;
            string.SSOID = eMitra.eMitraSSOID;
            string.OFFICECODE = officeCode;
            string.CHECKSUM = checkSum;
            var data = JSON.stringify(string);
            console.log("data=======>", data);
            resolve(data);
        })
    }

}