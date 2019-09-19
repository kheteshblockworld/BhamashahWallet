const queryExecute = require('./../mysql_connection/query_execute');
const query = require('./../mysql_connection/quiries');
const requestMoneyCreateService = require('./../functions/requestMoneyServices');
const errCode = require('../message/errMsg');
const  errMsgEN = require('../message/messageEN');
const errMsgHN = require('../message/messageHN');
const returnValue = require('../functions/CommonFunction')

const success = "true";
const notSuccess = "false";

module.exports = {
    requestCreate:requestCreate,
    requestRecieved:requestRecieved,
    requestSent:requestSent,
    requestDelete:requestDelete,
    requestReminder:requestReminder
}

function requestCreate(request){
    return new Promise((resolve, reject) => {
        var header = request.headers;
        var response;
        var lang = header.user_language ? header.user_language : "en";
        var access_token = header.access_token ? header.access_token : "";
        var amount = request.body.amount;
        var remark = request.body.remark;
        var recipientMobile = request.body.recipient_mobile;
        var msgInLang = (lang != 'hi') ? errMsgEN : errMsgHN;
       
        if(!lang || !lang.trim() || !access_token || !access_token.trim()){
            response = returnValue.requestFailMsg(400, "Request header not present", "false");
            var err = {
                "status": 400,
                "error":response
            }
            return reject(err);
        }
        else if(!amount || !amount.trim() || !remark || !remark.trim() || !recipientMobile || !recipientMobile.trim()){
            response = returnValue.requestFailMsg(errCode.ERROR_EA01,msgInLang.ERROR_EA01, "false");
            var err ={
                "status": 400,
                "error":response
            }
            return reject(err);
        }
        else{
            var sqlQuery = query.getUser;
            queryExecute.query_execute(sqlQuery,access_token)
            .then(async function(result)
            {
                if(result.data.length<1 && result.status == 200){
                    var message = returnValue.requestFailMsg(errCode.ERROR_EA00,msgInLang.ERROR_EA00,"false");
                    var err ={
                        "status": 400,
                        "error":message
                    }
                    return reject(err);
                }
                else if (result.status != 200){
                    var message = returnValue.requestFailMsg(errCode.ERROR_EA02,msgInLang.ERROR_EA02,"false");
                    var err ={
                        "status": 400,
                        "error":message
                    }
                    return reject(err); 
                }
                response = await requestMoneyCreateService.requestMoneyCreate(lang, result.data[0], recipientMobile, amount, remark)
                return resolve(response);
            }).catch(function(error){
                var status = (error.status) ? error.status : 400;
                var err ={
                    "status": status,
                    "error": error
                }
                return reject(err);
            })
        }
    })
}

function requestRecieved(request){
    return new Promise((resolve, reject) => {
        var header = request.headers;
        var response;
        var lang = header.user_language ? header.user_language : "en";
        var access_token = header.access_token ? header.access_token : "";
        var msgInLang = (lang != 'hi') ? errMsgEN : errMsgHN;
    
        if(!lang || !lang.trim() || !access_token || !access_token.trim()){
            response = returnValue.requestFailMsg(400, "Request header not present", "false");
            var err ={
                "status": 400,
                "error":response
            }
            return reject(err);
        }
        else{
            var sqlQuery = query.getUser;
            queryExecute.query_execute(sqlQuery,access_token)
            .then(async function(result)
            {
                if(result.data.length<1 && result.status == 200){
                    var message = returnValue.requestFailMsg(errCode.ERROR_EA00,msgInLang.ERROR_EA00,"false");
                    var err ={
                        "status": 400,
                        "error":message
                    }
                    return reject(err);
                }
                else if (result.status != 200){
                    var message = returnValue.requestFailMsg(errCode.ERROR_EA02,msgInLang.ERROR_EA02,"false");
                    var err ={
                        "status": 400,
                        "error":message
                    }
                    return reject(err); 
                }
                response = await requestMoneyCreateService.requestMoneyReceieve(lang, result.data[0]);
                return resolve(response);
            }).catch(function(error){
                var status = (error.status) ? error.status : 400;
                var err ={
                    "status": status,
                    "error":error
                }
                return reject(err);
            })
        }
    }) 
}

function requestSent(request){
    return new Promise((resolve, reject) => {
        var header = request.headers;
        var response;
        var lang = header.user_language ? header.user_language : "en";
        var access_token = header.access_token ? header.access_token : "";
        var msgInLang = (lang != 'hi') ? errMsgEN : errMsgHN;
    
        if(!lang || !lang.trim() || !access_token || !access_token.trim()){
            response = returnValue.requestFailMsg(400, "Request header not present","false");
            var err ={
                "status": 400,
                "error":response
            }
            return reject(err);
        }
        else{
            var sqlQuery = query.getUser;
            queryExecute.query_execute(sqlQuery,access_token)
            .then(async function(result)
            {
                if(result.data.length<1 && result.status == 200){
                    var message = returnValue.requestFailMsg(errCode.ERROR_EA00,msgInLang.ERROR_EA00,"false");
                    var err ={
                        "status": 400,
                        "error":message
                    }
                    return reject(err);
                }
                else if (result.status != 200){
                    var message = returnValue.requestFailMsg(errCode.ERROR_EA02,msgInLang.ERROR_EA02,"false");
                    var err ={
                        "status": 400,
                        "error":message
                    }
                    return reject(err); 
                }
                response = await requestMoneyCreateService.requestMoneySent(lang, result.data[0]);
                return resolve(response);
            }).catch(function(error){
                var status = (error.status) ? error.status : 400;
                var err ={
                    "status":status,
                    "error":error
                }
                return reject(err);
            })
        }
    }) 
}

function requestDelete(request){
    return new Promise((resolve, reject) => {
        var header = request.headers;
        var response;
        var lang = header.user_language ? header.user_language : "en";
        var access_token = header.access_token ? header.access_token : "";
        var recipient_id = request.body.recipient_id;
        var msgInLang = (lang != 'hi') ? errMsgEN : errMsgHN;
       
        if(!lang || !lang.trim() || !access_token || !access_token.trim()){
            response = returnValue.requestFailMsg(400, "Request header not present","false");
            var err ={
                "status": 400,
                "error":response
            }
            return reject(err);
        }
        else if(!recipient_id || !recipient_id.trim()){
            response = returnValue.requestFailMsg(errCode.ERROR_EA01,msgInLang.ERROR_EA01,"false");
            var err ={
                "status": 400,
                "error":response
            }
            return reject(err);
        }
        else{
            var sqlQuery = query.getUser;
            queryExecute.query_execute(sqlQuery,access_token)
            .then(async function(result)
            {
                if(result.data.length<1 && result.status == 200){
                    var message = returnValue.requestFailMsg(errCode.ERROR_EA00,msgInLang.ERROR_EA00,"false");
                    var err ={
                        "status": 400,
                        "error":message
                    }
                    return reject(err);
                }
                else if (result.status != 200){
                    var message = returnValue.requestFailMsg(errCode.ERROR_EA02,msgInLang.ERROR_EA02,"false");
                    var err ={
                        "status": 400,
                        "error":message
                    }
                    return reject(err); 
                }
                response = await requestMoneyCreateService.requestmoneyDelete(lang, result.data[0], recipient_id);
                return resolve(response);
            }).catch(function(error){
                var status = (error.status) ? error.status : 400;
                var err ={
                    "status":status,
                    "error":error
                }
                return reject(err);
            })
        }
    })
}

function requestReminder(request){
    return new Promise((resolve, reject) => {
        var header = request.headers;
        var response;
        var lang = header.user_language ? header.user_language : "en";
        var access_token = header.access_token ? header.access_token : "";
        var recipient_id = request.body.recipient_id;
        var msgInLang = (lang != 'hi') ? errMsgEN : errMsgHN;
       
        if(!lang || !lang.trim() || !access_token || !access_token.trim()){
            response = returnValue.requestFailMsg(400, "Request header not present","false");
            var err ={
                "status": 400,
                "error":response
            }
            return reject(err);
        }
        else if(!recipient_id || !recipient_id.trim()){
            response = returnValue.requestFailMsg(errCode.ERROR_EA01,msgInLang.ERROR_EA01,"false");
            var err ={
                "status": 400,
                "error":response
            }
            return reject(err);
        }
        else{
            var sqlQuery = query.getUser;
            queryExecute.query_execute(sqlQuery,access_token)
            .then(async function(result)
            {
                if(result.data.length<1 && result.status == 200){
                    var message = returnValue.requestFailMsg(errCode.ERROR_EA00,msgInLang.ERROR_EA00,"false");
                    var err ={
                        "status": 400,
                        "error":message
                    }
                    return reject(err);
                }
                else if (result.status != 200){
                    var message = returnValue.requestFailMsg(errCode.ERROR_EA02,msgInLang.ERROR_EA02,"false");
                    var err ={
                        "status": 400,
                        "error":message
                    }
                    return reject(err); 
                }
                response = await requestMoneyCreateService.requestMoneyReminder(lang, result.data[0], recipient_id);
                return resolve(response);
            }).catch(function(error){
                var status = (error.status) ? error.status : 400;
                var err ={
                    "status":status,
                    "error":error
                }
                return reject(err);
            })
        }
    })
}

