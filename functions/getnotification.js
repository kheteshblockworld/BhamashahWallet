'use strict';

var bcSdk = require('../sdk/invoke');
var bcstore = require('../sdk/query');
const mysqlConnection = require('./../mysql_connection/query_execute');
const query = require('./../mysql_connection/quiries');
const walletDB = require('./DBFunctions/WalletDB')
const readtransactionhistory = require('./../sdk/wallet');
var Utils = require('./../util/utils')
var format = require('date-format');
var moment = require('moment');

module.exports = {
getnotificationdb:getnotificationdb
}


 async function getnotificationdb(user_language, access_token,page) {
    return new Promise(async (resolve, reject) => {
        var response = {}
        var errorCode = "ERROR_EA02"
        var transactionPageSize = 10
         var next_page
         var page_size,limit,fromlimit,tolimit;
        var arr = [access_token]
        var trans = {}
        var format = []
        try{
   var data = await mysqlConnection.query_execute(query.readaadharkyc, arr)
        console.log("data",data)
        if(data.data.length == 0){
            errorCode = "ERROR_EA00"
            
            throw new Error("data was not there")
        }
        else{
var user_id = data.data[0].user_id
console.log("userid=>>>",user_id)
page_size = transactionPageSize
limit = page_size+1

if (page == 1) {
    fromlimit = 10
    tolimit = 0
} else {
    fromlimit = 10
    tolimit = (page - 1) * 10
}
var det = [user_id,fromlimit, tolimit]
var notify = await mysqlConnection.query_execute(query.getnotification, det)
console.log("notify",notify)
if (notify.data.length >= page_size) {
    next_page = true
} else {
    next_page = false
}
if(notify.data.length==0){

    errorCode = "ERROR_EA02"
    throw new Error("data was not there")

}
else{
    for(let i=0;i<notify.data.length;i++){
        trans["Title"]=notify.data[i].title
        trans["content"]=notify.data[i].content
        trans["Type"]=notify.data[i].type
        trans["date_created"]=notify.data[i].date_created

        format.push(trans)
        trans = {}
    }
    var getErrMsg = Utils.getErrorMessage(user_language, 'SUCCESS_SA09');
    response = {
        "success":true,
        "data":{
            "code":getErrMsg.code,
            "message": getErrMsg.message,
            "pagination":{
                "page":page,
                "next_page":next_page
            },
            "notifications": format
        },
        "status":200
    }
    return resolve(response)
    
}

        }
    }
    catch(err){
        var getErrMsg = Utils.getErrorMessage(user_language, errorCode);
     response = {
        "success" : false,
        "error" : {
            "code": getErrMsg.code ,
            "message":getErrMsg.message
        },
        "status":200
    }
    return resolve(response)
    }
    })
}

          
