const queryExecute = require('./../mysql_connection/query_execute');
const query = require('./../mysql_connection/quiries');
const errCode = require('../message/errMsg');
const  errMsgEN = require('../message/messageEN');
const errMsgHN = require('../message/messageHN');
const commonMsg = require('./CommonFunction');

module.exports = {
    getFaqs: getFaqs,
    updateFaq: updateFaq,
    deleteFaq: deleteFaq,
    createFaq: createFaq
}

function getFaqs(lang){
    return new Promise((resolve, reject)=>{
        var msgInLang = (lang != 'hi') ? errMsgEN : errMsgHN;
        var getQuery = query.getFaqList;
        var param = [lang, 1];
        var response;
        queryExecute.query_execute(getQuery, param)
        .then(async function(getList)
            {
                if(getList.data.length<1){
                    response = commonMsg.requestFailMsg(400, "No faqs data in DB","false");
                    return reject(response);
                }
                else{
                    response = await commonMsg.faqSuccessMsg(errCode.SUCCESS_SA00, msgInLang.SUCCESS_SA00, getList.data, "true");
                    return resolve(response);
                }
            }).catch(err=>{
                response = commonMsg.requestFailMsg(errCode.ERROR_EA02, msgInLang.ERROR_EA02, "false");
                return reject(response);
            })
        }).catch(err=>{
            response = commonMsg.requestFailMsg(errCode.ERROR_EA02, msgInLang.ERROR_EA02, "false");
            return reject(response);
        })
}

function updateFaq(id, answer,lang){
    return new Promise((resolve, reject)=>{
        var msgInLang = (lang != 'hi') ? errMsgEN : errMsgHN;
        var updateQuery = query.updateFaq;
        var param = [answer,id];
        var response;
        queryExecute.query_execute(updateQuery, param)
        .then(async function(updateList)
            {
                if(updateList.status != 200){
                    response = commonMsg.requestFailMsg(errCode.ERROR_EA16, msgInLang.ERROR_EA16, "false");
                    return reject(response);
                }
                else{
                    response = await commonMsg.faqSuccessMsg(errCode.SUCCESS_SA00, msgInLang.SUCCESS_SA00, "", "true");
                    return resolve(response);
                }
            }).catch(err=>{
                response = commonMsg.requestFailMsg(errCode.ERROR_EA02, msgInLang.ERROR_EA02, "false");
                return reject(response);
            })
        }).catch(err=>{
            response = commonMsg.requestFailMsg(errCode.ERROR_EA02, msgInLang.ERROR_EA02, "false");
            return reject(response);
        })
}

function deleteFaq(id, lang){
    return new Promise((resolve, reject)=>{
        var msgInLang = (lang != 'hi') ? errMsgEN : errMsgHN;
        var deleteQuery = query.deleteFaq;
        var param = [id];
        var response;
        queryExecute.query_execute(deleteQuery, param)
        .then(async function(deleteList)
            {
                if(deleteList.data.length<1){
                    response = commonMsg.requestFailMsg(errCode.ERROR_EA16, msgInLang.ERROR_EA16, "false");
                    return reject(response);
                }
                else{
                    response = await commonMsg.faqSuccessMsg(errCode.SUCCESS_SA03, msgInLang.SUCCESS_SA03, "", "true");
                    return resolve(response);
                }
            }).catch(err=>{
                response = commonMsg.requestFailMsg(errCode.ERROR_EA17, msgInLang.ERROR_EA17, "false");
                return reject(response);
            })
        }).catch(err=>{
            response = commonMsg.requestFailMsg(errCode.ERROR_EA17, msgInLang.ERROR_EA17, "false");
            return reject(response);
        })
}

function createFaq(lang, ques, ans){
    return new Promise((resolve, reject)=>{
        var msgInLang = (lang != 'hi') ? errMsgEN : errMsgHN;
        var createQuery = query.createFaq;
        var param = [lang, ques, ans, 1, new Date()];
        var response;
        queryExecute.insert_query(createQuery, param)
        .then(async function(createList)
            {
                response = await commonMsg.faqSuccessMsg(errCode.SUCCESS_SA00, msgInLang.SUCCESS_SA00, "", "true");
                return resolve(response);
            }).catch(err=>{
                response = commonMsg.requestFailMsg(errCode.ERROR_EA02, msgInLang.ERROR_EA02, "false");
                return reject(response);
            })
        }).catch(err=>{
            response = commonMsg.requestFailMsg(errCode.ERROR_EA02, msgInLang.ERROR_EA02, "false");
            return reject(response);
        })
}