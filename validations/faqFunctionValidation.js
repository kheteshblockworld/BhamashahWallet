const queryExecute = require('./../mysql_connection/query_execute');
const query = require('./../mysql_connection/quiries');
const faqService = require('./../functions/faqServices.js');
const errCode = require('../message/errMsg');
const errMsgEN = require('../message/messageEN');
const errMsgHN = require('../message/messageHN');
const returnValue = require('../functions/CommonFunction');

module.exports = {
    faqCreate: faqCreate,
    faqRead: faqRead,
    faqUpdate: faqUpdate,
    faqDelete: faqDelete
}

function faqCreate(request){
    return new Promise((resolve, reject) => {
        var header = request.headers;
        var body = request.body;
        var response;
        var lang = header.user_language ? header.user_language : "en";
        var access_token = header.access_token ? header.access_token : "";
        var question = body.question;
        var answer = body.answer;
        var msgInLang = (lang != 'hi') ? errMsgEN : errMsgHN;
        if(!access_token || !access_token.trim()){
            response = returnValue.requestFailMsg(400, "Request header not present", "false");
            var err = {
                "status": 400,
                "error":response
            }
            return reject(err);
        }
        else if(!question || !question.trim() || !answer || !answer.trim()){
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
                if(result.data.length<1){
                    var message = returnValue.requestFailMsg(errCode.ERROR_EA00,msgInLang.ERROR_EA00, "false");
                    var err ={
                        "status": 400,
                        "error":message
                    }
                    return reject(err);
                }
                response = await faqService.createFaq(lang, question, answer);
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
    });
}

function faqRead(request){
    return new Promise((resolve, reject) => {
        var header = request.headers;
        var response;
        var lang = header.user_language ? header.user_language : "en";
        var access_token = header.access_token ? header.access_token : "";
        var msgInLang = (lang != 'hi') ? errMsgEN : errMsgHN;
    
        if(!access_token || !access_token.trim()){
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
                if(result.data.length<1){
                    var message = returnValue.requestFailMsg(errCode.ERROR_EA00,msgInLang.ERROR_EA00,"false");
                    var err ={
                        "status": 400,
                        "error":message
                    }
                    return reject(err);
                }
                response = await faqService.getFaqs(lang);
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

function faqUpdate(request){
    return new Promise((resolve, reject) => {
        var header = request.headers;
        var body = request.body;
        var response;
        var lang = header.user_language ? header.user_language : "en";
        var access_token = header.access_token ? header.access_token : "";
        var id = body.id;
        var answer = body.answer;
        var msgInLang = (lang != 'hi') ? errMsgEN : errMsgHN;
       
        if(!access_token || !access_token.trim()){
            response = returnValue.requestFailMsg(400, "Request header not present","false");
            var err ={
                "status": 400,
                "error":response
            }
            return reject(err);
        }
        else if(!id || !answer || !answer.trim()){
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
                if(result.data.length<1){
                    var message = returnValue.requestFailMsg(errCode.ERROR_EA00,msgInLang.ERROR_EA00,"false");
                    var err ={
                        "status": 400,
                        "error":message
                    }
                    return reject(err);
                }
                response = await faqService.updateFaq(id, answer, lang);
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

function faqDelete(request){
    return new Promise((resolve, reject) => {
        var header = request.headers;
        var response;
        var lang = header.user_language ? header.user_language : "en";
        var access_token = header.access_token ? header.access_token : "";
        var id = request.body.id;
        var msgInLang = (lang != 'hi') ? errMsgEN : errMsgHN;
       
        if(!access_token || !access_token.trim()){
            response = returnValue.requestFailMsg(400, "Request header not present","false");
            var err ={
                "status": 400,
                "error":response
            }
            return reject(err);
        }
        else if(!id){
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
                if(result.data.length<1){
                    var message = returnValue.requestFailMsg(errCode.ERROR_EA00,msgInLang.ERROR_EA00,"false");
                    var err ={
                        "status": 400,
                        "error":message
                    }
                    return reject(err);
                }
                response = await faqService.deleteFaq(id, lang);
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