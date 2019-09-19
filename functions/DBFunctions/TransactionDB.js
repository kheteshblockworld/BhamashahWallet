/**
 * @author: Neelima
 * @version: 1.0.0
 * @date: October 22, 2018
 * @Description: Functions related to wallet table intract with mySQL DB.
 */
const mysqlConnection = require('../../mysql_connection/query_execute');
var uniqid = require('uniqid');
const query = require('../../mysql_connection/quiries');
var format = require('date-format');
var utils = require('../../util/utils');

var constant = require('../../message/transcationType');
const REQUEST_STATUS_PENDING = 0;
const REQUEST_STATUS_PAID = 1;

const STATUS_ACTIVE = 1;
const STATUS_DELETED = 0;

const TYPE_LOAD = 'load';
const TYPE_LOADREVERSAL = 'loadreversal';
const TYPE_SPEND = 'Spend';
const TYPE_SPENDREVERSAL = 'SpendReversal';
const TYPE_FUNDTRANSFER = 'FundTransfer';
const TYPE_IMPSTRANSFER = 'IMPSTransfer';
const TYPE_BILLPAYMENT = 'BillPayment';
const SHOW_USER_YES = 1;
const SHOW_USER_NO = 0;
module.exports = {
    getValidRequest: getValidRequest,
    getPlayerId: getPlayerId,
    updateValidRequest: updateValidRequest,
    sendNotification: sendNotification,
    addNew: addNew,
    updateNew: updateNew,
    loadReversalStatus: loadReversalStatus,
    addMetaTransaction: addMetaTransaction,
    updateAPIResponseTime: updateAPIResponseTime,
    getTransaction: getTransaction,
    getTransactionbyId: getTransactionbyId,
    updateYesBankStatus: updateYesBankStatus,
    statusUpdate: statusUpdate,
    findTranscation: findTranscation,
    scloadReversal:scloadReversal
}

async function getValidRequest(userId, recipentMobile, qty) {

    var res = await mysqlConnection.query_execute(query.getValidRequest, [userId, recipentMobile, qty, REQUEST_STATUS_PENDING, STATUS_ACTIVE])
    if (res.data.length == 0) {
        return false
    }
    return res
}


async function findTranscation(queryParams) {

    var res = await mysqlConnection.query_execute(query.findTranscation, queryParams)
    if (res.data.length == 0) {
        return false
    }
    return res
}


function updateValidRequest(userId, recipentMobile, qty,connection="") {
    return new Promise((resolve, reject) => {
        mysqlConnection.query_execute(query.updateValidRequest, [request_status, userId, recipentMobile, qty, status],connection).then(function (result) {
            console.log("resultupdate", result)
            return resolve({
                "status": 200,
                "message": result
            })
        })
    })
}
async function updateYesBankStatus(transaction_reference_number, yes_bank_reference_number, status, txid,connection = "") {
    var res = await mysqlConnection.query_execute(query.updateBankStatus, [transaction_reference_number, yes_bank_reference_number, status, txid],connection)
    if (res.data.length == 0) {
        return false
    }
    return res.data[0]
}

function sendNotification(user_id, title, content, type, status) {
    return new Promise((resolve, reject) => {
        var date_created = format('yyyy-MM-dd hh:mm:ss', new Date());
        var param = [user_id, title, content, type, status, date_created];
        mysqlConnection.insert_query(query.insertIntoNotification, param)
            .then(function (result) {
                console.log(result, "result")
                return resolve(result);
            }).catch(err => {
                return reject(err);
            })
    })
}

function getPlayerId(userId) {
    return new Promise((resolve, reject) => {
        mysqlConnection.query_execute(query.getPlayerId, [userId]).then(function (result) {
            console.log(getPlayerId, "getPlayerId")
            if (result) {
                return resolve(result.data[0].one_signal_id);
            }

            return reject(false);
        })
    })
}
async function addNew(userId, amount, transactionType, type, transactionStatus, tag = '', remark = '', sender_id = null, reciver_id = null, showToUser = "", reversalTransactionReference = null, connection = "") {
    var transaction_id = uniqid.process();
    var date_created = utils.getCurrentTime();

    var res = await mysqlConnection.insert_query(query.addTranscation, [transaction_id, reversalTransactionReference, userId, amount, transactionType, type, sender_id, reciver_id, tag, "", "", remark, transactionStatus, showToUser, date_created], connection)
    console.log(res)
    if (res.data.affectedRows === 0) {
        return false
    }
    //var result = await getTransaction(transaction_id)
    return transaction_id
}

async function getTransaction(transaction_id) {
    var res = await mysqlConnection.query_execute(query.getTranscationDetailByTxid, [transaction_id])
    if (res.status != 200) {
        return false
    }
    return res.data[0]
}

function updateNew(transaction_reference_number, status, txid, transaction_id,connection = "") {
    return new Promise((resolve, reject) => {

        var params = [transaction_reference_number, status, txid, transaction_id]
        mysqlConnection.query_execute(query.updateNew, params,connection).then(function (result) {
            console.log("resultupdate", result)
            return resolve({
                "status": 200,
                "message": result
            })
        })
    })
}

async function updateYesBankStatus(transaction_reference_number, yes_bank_reference_number, status, txid, connection = "") {
    var res = await mysqlConnection.query_execute(query.updateBankStatus, [transaction_reference_number, yes_bank_reference_number, status, txid], connection)
    if (res.data.length== 0) {
        return false
    }
    return true
}

async function scloadReversal(params) {
    var result= await mysqlConnection.query_execute(query.scloadReversal, params)
        console.log(result,"result")
        if (result.data.length == 0) {
            return false
        }
        return result.data
}

async function loadReversalStatus(userID, date) {
    var result = await mysqlConnection.query_execute(query.loadReversalStatus, [constant.TYPE_LOAD, constant.STATUS_PROCESSING, date, userID])
    if (result.data.length == 0) {
        return false
    }
    return result.data[0]

}

async function addMetaTransaction(txid, rrpTxid, payMode, payModeBid, status, connection = "") {
    var res = await mysqlConnection.insert_query(query.addMetaTransaction, [txid, rrpTxid, payMode, payModeBid, status, connection])
    console.log(res)
    if (res.data.length == 0) {
        return false
    }
    return res.data[0]
}

async function statusUpdate(txid, status, connection = "") {
    var res = await mysqlConnection.query_execute(query.updateTXStatus, [status, txid], connection)
    if (res.data.affectedRows == 0) {
        return false
    }
    return true
}

function addMetaTransaction(txid, rrpTxid, payMode, payModeBid, status) {
    mysqlConnection.query_execute(query.addMetaTransaction, [txid, rrpTxid, payMode, payModeBid, status]).then(function (result) {
        console.log(result)
        if (res.data.length == 0) {
            return false
        }
        return res.data[0]
    })
}

async function updateAPIResponseTime(name, status, type, startTime, endTime) {
    var responseTime = endTime.getTime() - startTime.getTime();
    var param = [status, type, startTime, endTime, responseTime, name];
    var res = await mysqlConnection.query_execute(query.updateAPIResponseTime, param)
    console.log(res)
    if (res.data.length === 0 || res.status != 200) {
        return false
    }
    return res;
}
async function getTransactionbyId(id) {
    var res = await mysqlConnection.query_execute(query.getTranscationByid, [id])
    if (res.data.length == 0) {
        return false
    }
    return res.data[0]
}