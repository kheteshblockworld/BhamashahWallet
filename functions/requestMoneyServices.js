const queryExecute = require('./../mysql_connection/query_execute');
const query = require('./../mysql_connection/quiries');
const multichainAddData = require('../functions/multichainFunctions/addData');
const multichainReadData = require('../functions/multichainFunctions/readData');
const Utils = require('../util/utils');
var DBConfig = require('./../mysql_connection/query_execute')
const commonMsg = require('./CommonFunction');
const RequestDB = require('./../functions/DBFunctions/requestMoneyDB');
const errCode = require('../message/errMsg');
const  errMsgEN = require('../message/messageEN');
const errMsgHN = require('../message/messageHN');
const STATUS_ACTIVE = 1;
const STATUS_DELETED = 0;

module.exports = {
    requestMoneyCreate: requestMoneyCreate,
    requestMoneyReceieve: requestMoneyRecieve,
    requestMoneySent: requestMoneySent,
    requestmoneyDelete: requestMoneyDelete,
    requestMoneyReminder: requestMoneyReminder
}

/**
 * User_id : the person who is requesting the money
 * recipentMobile : the person mobile no whom we are mading the request
 * amount : the amount money we are requesting
 * Remark : message send while mading the request
 */

//To create entry for request money
function requestMoneyCreate(lang, userId, recipientMobile, amount, remark){
    return new Promise(async(resolve, reject)=>{
        var message;
        var smsMessage;
        var errCode = "ERROR_EA02";
        var response;
        var connection = await DBConfig.getConnection()
        console.log(connection.threadId)
        await connection.beginTransaction();
        try{
            var user = await RequestDB.validUser(connection, userId.user_id);
            var recepient = await RequestDB.validMobile(connection, recipientMobile);
            var param = [userId.user_id, recipientMobile,STATUS_ACTIVE];
            var request = await RequestDB.findRecentRequestOfUser(connection, param);
            var currentDate = new Date();
            request_money_values = [userId.user_id, recipientMobile, amount, remark, currentDate];
            var createRequest = await RequestDB.createRequest(connection, request_money_values);

            if(user == false){
                errCode = "ERROR_EA24";
                throw new Error("Can not create request, verify you account");
            }else if(recepient != false && recepient.user_id == userId.user_id){
                errCode = "ERROR_EA21"
                throw new Error("Error! Can not request money to yourself.");
            }
            else if(request == false){
                errCode = "ERROR_EA15"
                throw new Error("Request already sent. Please wait for 3 hours, before sending a new request.");
            }
            else if(createRequest == false){
                throw new Error("Something went wrong, try again.")
            }
            else{   
                var requesterValue = await getUserName(userId.user_id);
                var name = (requesterValue.name) ? requesterValue.name : recipientMobile ;

                if(recepient == false){
                    // Sent an sms
                    var content = await getContentdataforSlugValue("app-one-link");
                    smsMessage = Utils.getErrorMessage(lang, "SMS_REQUEST_MONEY_NEW");
                    smsMessage = smsMessage.message.replace('{appUrl}', content.content);
                }
                else{
                    //Send notification to whom request is made
                    var oneSignalID = await RequestDB.fetchOneSignalId(connection, [recepient.user_id])  
                    if (oneSignalID){
                        var notificationmsg = Utils.getErrorMessage(lang, "REQUEST_RECEIVED");
                        notificationmsg = notificationmsg.message.replace ("{name}",name);
                        var notification = await commonMsg.sendNotification(oneSignalID,notificationmsg,recepient.user_id, "Request received for money", "SUCCESS", 1);
                    }
                // sms message
                    smsMessage = Utils.getErrorMessage(lang, "SMS_REQUEST_MONEY");
                    }
                    // sent an sms 
                smsMessage = smsMessage.message.replace('{requesterName}', name);
                smsMessage = smsMessage.replace('{requesterWalletMobile}', requesterValue.sso_mobile);
                smsMessage = smsMessage.replace('{amount}', amount);
                var sendsms = await Utils.sendSMS(recipientMobile, smsMessage)
                
                //Add newly created request data in multichain
                //Adding data as requester as a key
                var requesterKey = userId.user_id+"_"+requesterValue.blockchain_key+"_RequestMoneyRequester";
                // Adding data as receiever as a key
                var recipentValue = await getUserName(recepient.user_id);
                var recipientKey = recepient.user_id+"_"+recipentValue.blockchain_key+"_RequestMoneyRecipient";
                var value = {};
                var input = {};
                value.id = createRequest.data.insertId;
                value.user_id = userId.user_id;
                value.wallet_mobile = recipientMobile;
                value.amount = amount;
                value.remark = remark;
                value.requesterName = name;
                value.recipientName = recipentValue.name;
                value.date_created = currentDate;
                value.status = STATUS_ACTIVE;
                input.data = value;
                input.meta = {
                    'submittedOn': new Date()
                }
                var requesterValue = await multichainAddData.addData(requesterKey, input)
                if(requesterValue.status != 200){
                    errCode = "ERROR_EA02";
                    throw new Error("Something went wrong, try again."); 
                }
                else{
                    input.key = recipientKey;
                    var recipientValue = await multichainAddData.addData(recipientKey, input)      
                    if(recipientValue.status != 200){
                        errCode = "ERROR_EA02";
                        throw new Error("Something went wrong, try again."); 
                    }
                    else{
                        errCode = "SUCCESS_SA02";
                        message = Utils.getErrorMessage(lang, errCode);
                        message = message.message.replace("{receiptName}",name);
                        response = commonMsg.requestSuccessMsg(errCode, message,"","true");
                        connection.commit(function(err) {
                            if (err) { 
                                errCode = "ERROR_EA02";
                                throw new Error("Something went wrong, try again.");
                            }
                        });
                        await connection.end();
                        return resolve(response);
                    }            
                }
            }
        }catch(err){
            await connection.rollback();
            console.error(err)
            var getErrMsg = Utils.getErrorMessage(lang, errCode)
            if(getErrMsg == false){
                getErrMsg.code= errorCode;
                getErrMsg.message = err;
            }
            response = commonMsg.requestFailMsg(errCode, getErrMsg, "false");
            await connection.end();
            return reject(response);
        }
 })
}


/**
 * userId : user for whom active request has to fetch
 * lang : the language either hindi or english
 */

//To check the number of active requests receiver has in the queue
 function requestMoneyRecieve(lang, userId){
    return new Promise((resolve, reject)=>{
        var message;
        var msgInLang = (lang != 'hi') ? errMsgEN : errMsgHN;
        var validUser = query.getValidUserWallet;

        //To check whether the person with completed KYC exist or not
        queryExecute.query_execute(validUser, userId.user_id)
        .then(function(response){
            if(response.data.length<1){
                message = commonMsg.requestFailMsg(errCode.ERROR_R26, msgInLang.ERROR_R26,"false");
                return reject(message); 
            }
            var requestRecievedQuery = query.fetchRequestRecieved;
            var param = [response.data[0].wallet_mobile, STATUS_ACTIVE];

            //Fetch receive(active) request receiever has
            queryExecute.query_execute(requestRecievedQuery, param)
            .then(async function(requestMoneyResponse){
                //Fetch data from receiever multichain
                var recipientUserValue = await getUserName(userId.user_id);
                var key = userId.user_id+"_"+recipientUserValue.blockchain_key+"_RequestMoneyRecipient";
                await multichainReadData.readData(key).then(async function (result) {
                    if(result.status == 200 && requestMoneyResponse.data.length > 0 && result.data.message!="data not found!")
                    {
                        message = await commonMsg.requestSuccessMsg(errCode.SUCCESS_SA00, msgInLang.SUCCESS_SA00,result.data,"", "true");
                        return resolve(message);
                    }
                    else{
                    message = commonMsg.requestFailMsg(400, "No recieve money request data","false");
                    return reject(message);
                    }
                })
            }).catch(err =>{
                response = commonMsg.requestFailMsg(errCode.ERROR_EA02, msgInLang.ERROR_EA02, "false");
                return reject(response);
            })
        }).catch(err =>{
            response = commonMsg.requestFailMsg(errCode.ERROR_EA02, msgInLang.ERROR_EA02, "false");
            return reject(response);
        })
    }) 
 }


 /**
 * userId : user for whom active request has to fetch
 * lang : the language either hindi or english
 */

 //To check the number of active requests receiver has sent
 function requestMoneySent(lang, userId){
    return new Promise((resolve, reject)=>{
        var msgInLang = (lang != 'hi') ? errMsgEN : errMsgHN;
        var requestRecievedQuery = query.fetchRequestSent;
        var param = [userId.user_id, STATUS_ACTIVE];

        //Fetch requester sent(active) request
        queryExecute.query_execute(requestRecievedQuery, param)
        .then(async function(sentResponse){

            //Fetch data as requester key from multichain
            var requesterUserValue = await getUserName(userId.user_id);
            var key = userId.user_id+"_"+requesterUserValue.blockchain_key+"_RequestMoneyRequester";
            await multichainReadData.readData(key).then(async function (result) {
            if(result.status == 200 && sentResponse.data.length > 0 && result.data.message!="data not found!")
            {
                message = await commonMsg.requestSuccessMsg(errCode.SUCCESS_SA00, msgInLang.SUCCESS_SA00, result.data,"true");
                return resolve(message);
            }
            else{
                message = commonMsg.requestFailMsg(400, "No sent money request data", "false");
                return reject(message);
            }
            });
        }).catch(err =>{
            response = commonMsg.requestFailMsg(errCode.ERROR_EA02, msgInLang.ERROR_EA02, "false");
            return reject(response);
        })
    })
 }


/**
 * userId : user for whom request to delete
 * lang : the language either hindi or english
 * recieptId : id from request money table
 */

 //To delete a request from request_money table
 function requestMoneyDelete(lang, userId, recieptId){
     return new Promise(async (resolve,reject)=>{
        var response;
        var param = [recieptId, userId.user_id, STATUS_ACTIVE];
        var errCode = "ERROR_EA02";
        var connection = await DBConfig.getConnection()
        console.log(connection.threadId)
        await connection.beginTransaction();
        try{
            var requestToDelete = await RequestDB.findRequestToDelete(connection, param);
            var param = [STATUS_DELETED, recieptId];
            var setDeletStatus = await RequestDB.deleteRequest(connection, param);
            if(requestToDelete == false){
                errCode = "ERROR_EA16";
                throw new Error("Request not found");
            }
            else if(setDeletStatus == false){
                errCode = "ERROR_EA17";
                throw new Error("Unable to delete request");
            }
            else{
                var requesterUserValue = await getUserName(userId.user_id);
                var recipentValue = await getUserName("",requestToDelete.wallet_mobile);
                var recipientKey = recipentValue.user_id+"_"+recipentValue.blockchain_key+"_RequestMoneyRecipient";
                var requesterKey = userId.user_id+"_"+requesterUserValue.blockchain_key+"_RequestMoneyRequester";
                var value = {};
                var input = {};
                value.id = requestToDelete.id;
                value.user_id = userId.user_id;
                value.wallet_mobile = requestToDelete.wallet_mobile;
                value.amount = requestToDelete.amount;
                value.remark = requestToDelete.remark;
                value.requesterName = requesterUserValue.name;
                value.recipientName = recipentValue.name;
                value.date_created = requestToDelete.date_created;
                value.status = STATUS_DELETED;
                input.data = value;
                input.meta = {
                    'submittedOn': new Date()
                }

                var requesterValueUpdated = await multichainAddData.addData(requesterKey,input)
                
                if(requesterValueUpdated.status == 200 && requesterValueUpdated.response == "record already exist!"){
                    errorCode = 'ERROR_MULTICHAIN_01';
                    throw new Error( "Record already exist!") 
                }
                else if(requesterValueUpdated.status != 200){
                    errCode = "ERROR_EA02";
                    throw new Error("Something went wrong, try again."); 
                }
                else{
                        var receiptValueUpdated = await multichainAddData.addData(recipientKey,input)
                        if(receiptValueUpdated.status == 200 && receiptValueUpdated.response == "record already exist!"){
                            errorCode = 'ERROR_MULTICHAIN_01';
                            throw new Error( "Record already exist!") 
                        }
                        else if(receiptValueUpdated.status != 200){
                            errCode = "ERROR_EA02";
                            throw new Error("Something went wrong, try again."); 
                        }
                        else{
                            errCode = "SUCCESS_SA03";
                            message = Utils.getErrorMessage(lang, errCode);
                            response = commonMsg.requestSuccessMsg(errCode, message,"","true");
        
                            connection.commit(function(err) {
                                if (err) { 
                                    errCode = "ERROR_EA02";
                                    throw new Error("Something went wrong, try again.");
                                }
                            });
                            await connection.end();
                            return resolve(response);
                        }   
                } 
            }
        }catch(err){
            await connection.rollback();
            console.error(err)
            var getErrMsg = Utils.getErrorMessage(lang, errCode)
            if(getErrMsg == false){
                getErrMsg.code= errorCode;
                getErrMsg.message = err;
            }
            response = commonMsg.requestFailMsg(errCode, getErrMsg, "false");
            await connection.end();
            return reject(response);
        }
    })   
 }


 /**
 * userId : user who ask for money
 * lang : the language either hindi or english
 * recieptId : id from request money table
 */

 //Send Reminder to reciever of a provided request 
 function requestMoneyReminder(lang, userId, recieptId){
    return new Promise(async(resolve, reject)=>{
        var response;
        var smsMessage;
        var msgInLang = (lang != 'hi') ? errMsgEN : errMsgHN  
        var param = [recieptId, userId.user_id, STATUS_ACTIVE];
        var queryToRemind = query.fetchLastRequestSent;

        //Get active request made by user 
        queryExecute.query_execute(queryToRemind, param)
        .then(async function(valueToRemind){

            //Fetch data as requester as a key from multichain
            var requesterUserValue = await getUserName(userId.user_id);
            var key = userId.user_id+"_"+requesterUserValue.blockchain_key+"_RequestMoneyRequester";
            await multichainReadData.readData(key).then(function (result) {
            if(result.status != 200 || result.response == "data not found!" || valueToRemind.data.length< 1 || result.data[0].data.id != recieptId){
                response = commonMsg.requestFailMsg(errCode.ERROR_EA16, msgInLang.ERROR_EA16, "false");
                return reject(response);
            }
            console.log(result.data);

            //Check whether there is any request in the queue by the user to the reciever mobile number if not send only sms else both
            var getRecieptWallet = query.getValidUserByMobileNo;
            queryExecute.query_execute(getRecieptWallet, [result.data[0].data.wallet_mobile])
            .then(async function(walletValue){
                if(walletValue.data.length<1){
                    //send sms
                    var content = await getContentdataforSlugValue("app-one-link");
                    smsMessage = msgInLang.SMS_REQUEST_MONEY_NEW;
                    smsMessage = smsMessage.replace('{appUrl}', content.content);
                }
                else{
                    //Send notification
                    var user_name = await getUserName(userId.user_id);
                    var requesterMobile = await getSenderWallet(userId.user_id).wallet_mobile;
                    await queryExecute.query_execute(query.slectOneSignalID, walletValue.data[0].user_id)
                    .then(async function(requesterSignalId){
                        if(requesterSignalId.data.length>0){
                            var message = msgInLang.REQUEST_MONEY_REMINDER;
                            message = message.replace('{requesterName}', user_name.name);
                            message = message.replace('{amount}', valueToRemind.data[0].amount);
                            message = message.replace('{requesterWalletMobile}',requesterMobile);
                            var notification = commonMsg.sendNotification(requesterSignalId.data[0],message,walletValue.data[0].user_id, "Request received for money", "SUCCESS",1);
                        }
                        //sms message
                       smsMessage = msgInLang.SMS_REQUEST_MONEY;

                    }).catch(err=>{
                        response = commonMsg.requestFailMsg("400","signal id is absent", "false");
                        return reject(response);
                    })

                    //Send sms
                    smsMessage = smsMessage.replace('{requesterName}', user_name.name);
                    smsMessage = smsMessage.replace('{requesterWalletMobile}', requesterMobile);
                    smsMessage = smsMessage.replace('{amount}', valueToRemind.data[0].amount);
                    var sms = await Utils.sendSMS(result.data[0].data.wallet_mobile, smsMessage);


                    var value = msgInLang.SUCCESS_SA06;
                    var receiptName = result.data[0].data.recipientName;
                    var name = (!receiptName) ? result.data[0].data.wallet_mobile:receiptName;
                    value = value.replace('{receiptName}', name); 
                    response = await commonMsg.requestSuccessMsg(errCode.SUCCESS_SA06, value, "", "true");
                    return resolve(response);    
                }
            }).catch(err=>{
                response = commonMsg.requestFailMsg(errCode.ERROR_EA02, msgInLang.ERROR_EA02, "false");
                return reject(response);
            })
            }).catch(err=>{

            })
        }).catch(err=>{
            response = commonMsg.requestFailMsg(errCode.ERROR_EA02, msgInLang.ERROR_EA02, "false");
            return reject(response);
        })
    })
 }

 function getUserName(userId, userMobile){
    return new Promise((resolve,reject)=>{
    if(userId){
        queryExecute.query_execute(query.getUserName, [userId])
        .then(function(name){
            if (name.data.length>0){
                return resolve(name.data[0]);
            }
            else{
                return resolve("user_wallet");
            }
        })
     }
    else{
        queryExecute.query_execute(query.getUserDetail, [userMobile])
        .then(function(userValue){
            if (userValue.data.length>0){
                return resolve(userValue.data[0]);
            }
            else{
                return resolve("user_wallet");
            }
        })
      }
    })
 }

 function getSenderWallet(userId){
    return new Promise((resolve,reject)=>{
    queryExecute.query_execute(query.getValidUserWallet, [userId])
     .then(function(walletDetails){
         if(walletDetails.data.length>0){
             return resolve(walletDetails.data[0]);
         }
         else{
             return resolve("wallet_mobile");
         }
     })
    })
 }
 
function getContentdataforSlugValue(slugValue){
    return new Promise((resolve,reject)=>{
        queryExecute.query_execute(query.getContent, [slugValue])
        .then(function(contentData){
            if(contentData.data.length>0){
                return resolve(contentData.data[0]);
            }
            else{
                return resolve("no content data for"+slugValue);
            }
        })
    })
}