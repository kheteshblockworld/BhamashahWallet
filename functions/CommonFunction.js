const queryExecute = require('./../mysql_connection/query_execute');
const query = require('./../mysql_connection/quiries');
var format = require('date-format');
const config = require('config');
const notifyConfig = config.get('notificationConfig');
var oneSignal = require('onesignal-node');  
const RequestDB = require('./../functions/DBFunctions/requestMoneyDB');
var notificationClient;
var notificationObject;

module.exports = {
    sendNotification : sendNotification,
    requestSuccessMsg : requestSuccessMsg,
    requestFailMsg : requestFailMsg,
    faqSuccessMsg: faqSuccessMsg
}

function sendNotification(signal_id,message,userId,title,type,status){
    return new Promise(async(resolve, reject)=>{
        if(!notificationClient){
            notificationClient = new oneSignal.Client({    
                userAuthKey: "",    
                app: { appAuthKey: notifyConfig.onesignalApiSecretKey, appId: notifyConfig.oneSignalApiKey}   
            });
        }
        notificationObject = new oneSignal.Notification({    
            contents: {    
                en: title,    
                tr: message    
            },    
            include_player_ids:[signal_id]
        });   

        var currentDate = format('yyyy-MM-dd hh:mm:ss', new Date());
        var param = [userId,title,message,type,status,currentDate];
        var connection = await queryExecute.getConnection()
        console.log(connection.threadId)
        await connection.beginTransaction();
        try{
            var notioficationResult = await notificationClient.sendNotification(notificationObject)     
           console.log(notioficationResult);
    
            if (notioficationResult.httpResponse.statusCode != 200) {    
                throw new Error("Something went wrong, try again."); 
            } else {    
                var inserNotification = RequestDB.addNotification(connection, param);
                if(inserNotification == false){
                    throw new Error("Something went wrong, try again."); 
                }
                else{
                    connection.commit(function(err) {
                        if (err) { 
                            throw new Error("Something went wrong, try again.");
                        }
                    });
                    await connection.end();
                    return resolve("Notification Updated")
                }
            }  
        }catch(err){
            await connection.rollback();
            console.error(err)
            await connection.end();
            return reject(err);
        }   
    }) 
}

function requestSuccessMsg(code, content, requestData, success){
    return new Promise((resolve, reject)=>{
        var data;
        if(requestData == null){
            data = {
                "code": code,
                "status_popupmessage_type": "",
                "status_type": "",
                "message": content
            }
        }
        else{
            data = {
                "code": code,
                "status_popupmessage_type": "",
                "status_type": "",
                "requests": requestData,
                "message": content
            }
        }
       
        var value = {
            "statusReason": "OK",
            "data": data,
            "isSuccessful": true,
            "success": success,
            "statusCode": 200
            }
        return resolve(value);
    }).catch(err=>{
        return reject(err);
    })
}

function requestFailMsg(code, content, success){
    var error = {
        "code": code,
        "status_popupmessage_type": "",
        "status_type": "",
        "message": content
    }
    var value = {
        "statusReason": "OK",
        "isSuccessful": true,
        "success": success,
        "error": error,
        "statusCode": 200
    }
    return value;
}


//faq success Message
function faqSuccessMsg(code, content, faqData, success)
{
    return new Promise((resolve, reject)=>{
    var data;
    if(faqData == null || faqData == "" || faqData == " "){
        data = {
            "code": code,
            "status_popupmessage_type": "",
            "status_type": "",
            "message": content
        }
    }
    else{
        data = {
            "code": code,
            "status_popupmessage_type": "",
            "status_type": "",
            "faqs": faqData,
            "message": content
        }
    }
   
    var value = {
        "statusReason": "OK",
        "data": data,
        "isSuccessful": true,
        "success": success,
        "statusCode": 200
        }
    return resolve(value);
    }).catch(err=>{
        return reject(err);
    })
}