'use strict';
const mysqlConnection = require('../../mysql_connection/query_execute');
const query = require('../../mysql_connection/quiries')
var config = require('config');
var yesbankservices = config.get('yesbankservices');
const checksumgeneration = require('../../util/generateChecksum');
var request = require('request-promise');
var Utils = require('../../util/utils');
const walletDB = require('../DBFunctions/WalletDB')
const UsersDB = require('../DBFunctions/UsersDB')
let date = require('date-and-time');
var DBConfig = require('../../mysql_connection/query_execute');
const yesBankServices = require('../YesBankServices/yesBankServices');
module.exports = {
    closewallet: closewallet
}

function closewallet(user_id, value) {
    return new Promise(async (resolve, reject) => {
        var response = {}
        var errorCode = "ERROR_EA02"
        var connection = await DBConfig.getConnection()
        console.log(connection.threadId)
        await connection.beginTransaction()
        var params = [user_id]
        var lang = value.lang
        var id;
        var p1
        try{
        var data = await walletDB.getWalletBYID (params)
       
        console.log("data123", data.data[0].user_id)
        p1 = data.data[0].wallet_mobile
        console.log("walletmobile123", p1)
        id = data.data[0].user_id
        var user = [id]
        var checkuser = await UsersDB.readusersid(user)
        console.log("checkuser123", checkuser.data)
        var valuecheck = {
            p1: p1
        }
        
        var data = await yesBankServices.closewallet(valuecheck)
        console.log("checksum", data)
        
                
                if (data.message.status_code == "SUCCESS" && data.message.code == "00") {
                    var now = new Date()
                    var date_last_edit = date.format(now, 'YYYY/MM/DD HH:mm:ss');
                    console.log("date", date_last_edit)
                    var status, wallet_balance
                    status = "CLOSED"
                    wallet_balance = "0"
                    var arr = [wallet_balance, status, date_last_edit, user_id]
                   var result = await walletDB.updatewalletstatus (arr,connection)
                      
                        console.log("resultupdatewallet", result)
                        if (result.data.affectedRows != 1) {
                            
                            connection.rollback()
                            errorCode = "ERROR_EA02"
                            throw new Error("Error in updating wallet status into database")
                        } else {
                            var userstatus = "DELETED"
                            var userwallet = [userstatus, date_last_edit, id]
                           var result =  await UsersDB.updateuserstatus(userwallet,connection)
                                console.log("resultuserstable", result)
                                if (result.data.affectedRows != 1) {
                                    
                                    connection.rollback()
                                    errorCode = "ERROR_EA02"
                                    throw new Error("Error in updating user status into database")
                                } else {
                                    connection.commit()
                                    var getErrMsg = Utils.getErrorMessage(lang, data.message.status_code + "_" + data.message.code);
                                     response = {
                                        "statusReason": "OK",
                                        "data":{
                                        "code": getErrMsg.code,
                                        "message": getErrMsg.message
                                        },
                                        "isSuccessful": true,
                                        "sucess": true,
                                        "status": 200
                                    }
                                    return resolve(response)
                                }       
                            }

                }
                else if(data.message.status_code == "ERROR"){

                    var getErrMsg = Utils.getErrorMessage(lang, data.message.status_code + "_" + data.message.code);
                    response = {
                        "statusReason": "OK",
                        "data":{
                        "code": getErrMsg.code,
                        "message": getErrMsg.message
                        },
                        "isSuccessful": true,
                        "sucess": false,
                        "status": 200
                    }
                    return resolve(response)
                }
                else{
                    errorCode = "ERROR_EA02"
                    throw new Error("Error on curl CloseWallet")
                }
    }
            catch(err){
                await connection.rollback()
                await connection.end();
                var getErrMsg = Utils.getErrorMessage(lang,errorCode);
                response = {
                'success': false,
                'statusCode': 200,
                'Error': {
                'code': getErrMsg.code,
                'message': getErrMsg.message,
                'status_type': '',
                'status_popupmessage_type': ''
            },
                }
                return resolve(response)

            }
    })
}