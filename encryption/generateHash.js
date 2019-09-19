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




module.exports = {
    generateHash: generateHash,
    decryptHash: decryptHash,
    generateHashCheckSum: generateHashCheckSum
}

function generateHash(req) {
    var data = req;
    console.log("data====>", data.SSOID);
    return new Promise((resolve, reject) => {
        var key = eMitra.eMitraEncryptionKey;
        var hash = sha256(key);
        console.log("hash=====>", hash);
        const hashjs = crypto.createHash("sha256").update(key);
        console.log("hashjs=====>", hashjs);
        var iv = hash.substr(0, 16);
        console.log("iv=====>", iv);
        let keyjs = hash.slice(0, 16);
        console.log("keyjs=====>", keyjs);



        var cipher = crypto.createCipheriv('aes-128-cbc', keyjs, iv);
        var crypted = cipher.update(data, 'utf8', 'binary');
        var cbase64 = new Buffer(crypted, 'binary').toString('base64');
        console.log(crypted);
        console.log(cbase64);
        crypted += cipher.final('binary');
        console.log("hahahaaaaaa:" + crypted.toString('hex'));
        var crypted64 = new Buffer(crypted, 'binary').toString('base64');
        console.log("crypted64=====>>", crypted64);
        resolve(crypted64);
    })
}

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
        string.MERCHANTCODE = eMitra.eMitraMerchantCode;
        string.REQUESTID = prn;
        string.REQTIMESTAMP = date;
        string.SERVICEID = serviceId;
        string.SUBSERVICEID = '';
        string.REVENUEHEAD = revenuHead;
        string.CONSUMERKEY = consumerKey;
        string.CONSUMERNAME = name;
        string.COMMTYPE = commtype;
        string.SSOID = eMitra.eMitraSSOID;
        string.OFFICECODE = officeCode;
        string.SSOTOKEN = '0';
        string.PAYMODE = "771";
        string.BANKREFNUMBER = "";
        string.MOBILENUMBER = mobile;
        string.EMAILID = "";
        string.CHECKSUM = checkSum;
        var data = JSON.stringify(string);
        console.log("data=======>",data);
        resolve(data);
    })
}

function decryptHash(data) {
    return new Promise((resolve, reject) => {
        var key = eMitra.eMitraEncryptionKey;
        var hash = sha256(key);
        console.log("hash=====>", hash);
        const hashjs = crypto.createHash("sha256").update(key);
        console.log("hashjs=====>", hashjs);
        var iv = hash.substr(0, 16);
        console.log("iv=====>", iv);
        let keyjs = hash.slice(0, 16);
        // let keyjs = hashjs.digest().slice(0, 16);
        console.log("keyjs=====>", keyjs);
        var crypted = new Buffer(data, 'base64').toString('binary');
        var decipher = crypto.createDecipheriv('aes-128-cbc', keyjs, iv);
        var decoded = decipher.update(crypted, 'binary', 'utf8');
        decoded += decipher.final('utf8');
        console.log(decoded);
    })

}