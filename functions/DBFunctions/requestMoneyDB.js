/**
 * @author: Vidhi
 * @version: 1.0.0
 * @date: December 28, 2018
 * @Description: Functions related to request_money table intract with mySQL DB.
 */

const mysqlConnection = require('../../mysql_connection/query_execute');
const query = require('../../mysql_connection/quiries')
var moment = require('moment');

module.exports = {
    validUser: validUser,
    validMobile: validMobile,
    fetchOneSignalId: fetchOneSignalId, 
    findRecentRequestOfUser: findRecentRequestOfUser,
    findRequestToDelete: findRequestToDelete,
    createRequest: createRequest,
    deleteRequest: deleteRequest,
    addNotification: addNotification
}

async function validUser(connection = "", userId) {
    var res;
    if(connection){
        res = await mysqlConnection.query_execute(query.getValidUserWallet, [userId], connection);
    }
    else{
        res = await mysqlConnection.query_execute(query.getValidUserWallet, [userId]);
    }
    if (res.status != 200 || res.data.length == 0) {
        return false
    }
    return res.data[0]
}

async function validMobile(connection = "", recipientMobile) {
    var res;
    if(connection){
        res = await mysqlConnection.query_execute(query.getValidUserByMobileNo, [recipientMobile], connection);
    }
    else{
        res = await mysqlConnection.query_execute(query.getValidUserByMobileNo, [recipientMobile]);
    }
    if (res.status != 200 || res.data.length == 0) {
        return false
    }
    return res.data[0]
}

async function findRecentRequestOfUser(connection = "", param) {
    var res;
    var currentDate = moment(new Date(), 'YYYY-MM-DD HH:mm:ss');
    if(connection){
        res = await mysqlConnection.query_execute(query.fetchRequestMoney, param, connection);
    }
    else{
        res = await mysqlConnection.query_execute(query.fetchRequestMoney, param);
    }
    if (res.status == 200 && res.data.length == 0) {
        return true;
    }
    else if(res.status == 200){
        var dbdate = moment(res.data[0].date_created, 'YYYY-MM-DD HH:mm:ss');
        var dateDiff = currentDate.diff(dbdate, 'hours');
        if(dateDiff<3){
            return false;
        }
        return true;
    }
    else{
        return false;
    }
}

async function findRequestToDelete(connection = "", deleteDetails){
    var res;
    if(connection){
        res = await mysqlConnection.query_execute(query.fetchLastRequestSent, deleteDetails,connection)
    }
    else{
        res = await mysqlConnection.query_execute(query.fetchLastRequestSent, deleteDetails);
    }
    if(res.status == 200 & res.data.length != 0){
        return res.data[0];
    }
    else{
        return false;
    }
}

async function deleteRequest(connection = "", deleteParam){
    var res;
    if(connection){
        res = await mysqlConnection.query_execute(query.setDeleteStatus, deleteParam, connection)
    }
    else{
        res = await mysqlConnection.query_execute(query.setDeleteStatus, deleteParam)
    }
    if(res.status == 200){
        return true;
    }
    else{
        return false;
    }

}

async function fetchOneSignalId(connection = "", signalIDParam){
    var res;
    if(connection){
        res = await mysqlConnection.query_execute(query.slectOneSignalID, signalIDParam, connection)
    }
    else{
        res = await mysqlConnection.query_execute(query.slectOneSignalID, signalIDParam)
    }
    if (res.status != 200) {
        return false
    }
    return res.data[0].one_signal_id;
}

async function createRequest(connection = "", createParam){
    var res;
    if(connection){
        res = await mysqlConnection.insert_query(query.insertRequestMoney, createParam, connection)
    }
    else{
        res = await mysqlConnection.insert_query(query.insertRequestMoney, createParam)
    }
    if (res.status != 200) {
        return false
    }
    return res;
}

async function addNotification(connection = "", notificationParam){
    var res;
    if(connection){
        res = await mysqlConnection.insert_query(query.insertRequestMoney, notificationParam, connection)
    }
    else{
        res = await mysqlConnection.insert_query(query.insertRequestMoney, notificationParam)
    }
    if (res.status != 200) {
        return false
    }
    return res;
}