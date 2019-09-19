/**
 * @author: Sathiyan B
 * @version: 1.0.0
 * @date: December 22, 2018
 * @Description: SQL Queries Functions for Emitra Services.
 */

const mysqlConnection = require('../../mysql_connection/query_execute');
const querys = require('../../mysql_connection/quiries');


module.exports = {
    searchQuery: searchQuery,
    TranscationAdd: TranscationAdd,
    findTranscationId: findTranscationId,
    walletQuery: walletQuery,
    addTranscationMeta: addTranscationMeta,
    updateTranscationMeta: updateTranscationMeta,
    updateTranscationStatus: updateTranscationStatus,
    updateTranscation: updateTranscation,
    updateWalletBalance: updateWalletBalance,
    selectrevenuehead: selectrevenuehead,
    updateTxId: updateTxId,
    selectTranscationMeta:selectTranscationMeta
}

async function searchQuery(accessToken,connection='') {
   
    var userID = await mysqlConnection.query_execute(querys.findaccesstoken_access_token, [accessToken],connection);
    console.log("userID====>",userID.data.length);
    if (userID.data.length == 0) {
        return false;
    }
    return userID.data[0].user_id;
}

async function TranscationAdd(queryParam,connection='') {
   
    var result = await mysqlConnection.insert_query(querys.addTranscation, queryParam,connection);
    if (result.status == 200) {
        return true
    }else{
        return false
    }
}

async function findTranscationId(transaction_id,connection='') {
   
    var result = await mysqlConnection.query_execute(querys.findTranscationid, [transaction_id], connection);

    if (result.data.length == 0) {
        return false
    }else{
        return result.data[0].id
    }
}

async function walletQuery(searchQuery,connection='') {
   
    var result = await mysqlConnection.query_execute(querys.walletQuery, [searchQuery], connection);

    if (result.data.length == 0) {
        return false
    }else{
        return result
    }
}


async function addTranscationMeta(queryParamMeta,connection='') {
   
    var result = await mysqlConnection.insert_query(querys.addTranscationMetaEmitra, queryParamMeta, connection);
    console.log("result====>",result);
    if (result.status == 200) {
        return true
    }
    return false
}
async function selectTranscationMeta(transactionid) {
   
    var result = await mysqlConnection.query_execute(querys.selectTransactionMeta, [transactionid]);
    console.log("result====>",result);
    if (result.data.length == 00) {
        return false
    }
    return result
}

async function updateTranscationMeta(queryParamMeta,connection='') {
   
    var result = await mysqlConnection.query_execute(querys.updateTranscationMeta, queryParamMeta, connection);
    console.log("result====>",result);
    if (result.message == 'Success' && result.data.affectedRows == '1') {
        return true
    }
    return false
}

async function updateTranscationStatus(transStatusParams,connection='') {
   
    var result = await mysqlConnection.query_execute(querys.updateTranscationStatus, transStatusParams, connection);
    if (result.message == 'Success' && result.data.affectedRows == '1') {
        return true
    }
    return false
}

async function updateWalletBalance(transStatusParams,connection='') {
   
    var result = await mysqlConnection.query_execute(querys.updateWalletBal, transStatusParams, connection);
    if (result.message == 'Success' && result.data.affectedRows == '1') {
        return true
    }
    return false
}


async function selectrevenuehead(serviceId,connection='') {
    var result = await mysqlConnection.query_execute(querys.selectrevenuehead, [serviceId], connection);
    if (result.data.length == 0) {
        return false;
    }
    return result;
}

async function updateTranscation(transStatusParams,connection='') {
   
    var result = await mysqlConnection.query_execute(querys.updateTranscation, transStatusParams, connection);
    if (result.message == 'Success' && result.data.affectedRows == '1') {
        return true
    }
    return false
}

async function updateTxId(transStatusParams,connection='') {
   
    var result = await mysqlConnection.query_execute(querys.updateTxId, transStatusParams, connection);
    if (result.message == 'Success' && result.data.affectedRows == '1') {
        return true
    }
    return false
}
