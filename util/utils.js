
/**
 * @author: Rakesh C
 * @version: 1.0.0
 * @date: October 16, 2018
 * @Description: Utils file to add common function.
 */

var uniqid = require('uniqid');
var date = require('date-and-time');
var R = require('ramda');
var request = require('request');
var config = require('config');
var api_config = config.get('sendmessage')
const errorCode = require('../message/errMsg.json')
const errorMessegeEN = require('../message/messageEN.json')
const errorMessegeHN = require('../message/messageHN.json')

 

module.exports = {
   getUniqId: getUniqId,
   dateFormate:dateFormate,
   cnvStrToHex:cnvStrToHex,
   cnvHexToStr:cnvHexToStr,
   maskMobileNumber:maskMobileNumber,
   Otpgenerator:Otpgenerator,
   Otprefgenerator:Otprefgenerator,
   getmessage:getmessage,
   sendSMS:sendSMS,
   getErrorMessage:getErrorMessage,
   datechange:datechange,
   getCurrentTime:getCurrentTime
}

function getUniqId(mobile) {
   var id = uniqid(mobile + "_");
   console.log(id)
   return id;
}

function dateFormate(now){
   var dateformat = date.format(now, 'YYYY-MM-DD HH:mm:ss')
   return dateformat
}

function getCurrentTime(){
    var now =  new Date();
    var dateformat = date.format(now, 'YYYY-MM-DD HH:mm:ss')
    return dateformat
}

function cnvStrToHex(str) {
    var value = str;
    if(typeof str != "string") {
        value = String(str)
    }

    let bufStr = Buffer.from(value, 'utf8');
    hexstring = bufStr.toString('hex')

    return hexstring;
}

function cnvHexToStr(hex) {

    var rtnString = Buffer.from(hex, 'hex').toString();

    return rtnString
}
function datechange(now){
    var dateonly = date.format(now, 'YYYY-MM-DD')
    return dateonly
 }
 
/**
 * 
 * @author: Vikram Viswanathan
 * @param {*} mobileNumber: Provide a mobile number in any form (all digits, number with dash, number with space)
 * @returns {*} maskedMobileNumber: a masked supplied number only exposing the last 4 digits
 * @date: September 28, 2018
 * @Description: This function uses a Ramda (a practical Javascript Library). Ramda functions are automatically 
 * curried. This allows you to easily build up new functions from old ones simply by not supplying the final 
 * parameters. The parameters to Ramda functions are arranged to make it convenient for currying. The data to 
 * be operated on is generally supplied last.
 */
function maskMobileNumber (mobileNumber) {
    console.log(mobileNumber)
    var ensureOnlyNumbers = R.replace(/[^0-9]+/g, '');
    var maskAllButLastFour = R.replace(/[0-9](?=([0-9]{4}))/g, 'X');
    var maskedMobileNumber = R.compose(maskAllButLastFour, ensureOnlyNumbers);
    console.log("+++", mobileNumber);
    console.log("Mask --<", maskedMobileNumber(mobileNumber));
    return maskedMobileNumber(mobileNumber);
}

function Otpgenerator(num){
    var otpCode = "";
    var possible = "0123456789";
    for (var i = 0; i < num; i++)
        otpCode += possible.charAt(Math.floor(Math.random() * possible.length));
    // var otp = otp.toString()
    console.log("otp", otpCode);
    return otpCode
}

function Otprefgenerator(id){
    var otpref = "";
    var possible = "0123456789";
    for (var i = 0; i < id; i++)
        otpref += possible.charAt(Math.floor(Math.random() * possible.length));
    console.log("otpref", otpref);
    return otpref
}

function sendSMS(mobile,message){
    return new Promise((resolve, reject) => {  
   var smsGatewayUrl = api_config.smsGatewayUrl
   var username = api_config.username
   var password= api_config.password
   var smsservicetype = api_config.smsservicetype
   var senderid = api_config.senderid
   var content = message
   var mobileno = mobile
   console.log(mobileno)
  
   
   var options = {
    url:smsGatewayUrl ,
    method: 'POST',
    form: {
        username:username,
        password:password,
        smsservicetype:smsservicetype,
        senderid:senderid,
        content:content,
        mobileno:mobileno
     },
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    
};

request(options, function (err, res, body) {
    if (!res.body) {
                var result = {
                     "status": 401,
                     "message":"Please Provide Correct User Details"
                 }
                 return result
                }
                else{
            var success = res.body
            console.log("response",res.body)
            return resolve(success)
                }

})
})
}

function getmessage(message,lang){
  
    var message = "{otpCode} is the OTP for forget mpin for you wallet {maskedWallet}"
    var lang = "en"
    var res ={
        "message":message,
        "lsng":lang
    }
    return (res)

}
function getErrorMessage(Lang,errorId) {
    console.log(Lang,errorId)
    
    if(errorCode[errorId]){
    return {
        "code":errorCode[errorId],
        "message":Lang != "hi" ? errorMessegeEN[errorId] :errorMessegeHN[errorId]
    }
}
return false
 }
