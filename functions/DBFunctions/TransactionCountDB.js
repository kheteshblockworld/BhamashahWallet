/**
 * @author: Sheshnath Agrahari
 * @version: 1.0.0
 * @date: Nov 19, 2018
 * @Description: Tokens genetarion and check tokens function intract with mySQL DB.
 */

const mysqlConnection = require('../../mysql_connection/query_execute');
const query = require('../../mysql_connection/quiries')

module.exports = {
    addTransactionCount: addTransactionCount,
    getActionBillPaymentCountByStatus: getActionBillPaymentCountByStatus,
    getActionBillPaymentVerifyCountByStatus : getActionBillPaymentVerifyCountByStatus,
    getRecentBillHistoryCountByStatus : getRecentBillHistoryCountByStatus,
    getHighestHitsConsumedCount: getHighestHitsConsumedCount,
    gettotalnumberofAPIserving:gettotalnumberofAPIserving,
    getActionBillPaymentCountByTransStatus: getActionBillPaymentCountByTransStatus,
    getActionBillPaymentVerifyCountByTransStatus : getActionBillPaymentVerifyCountByTransStatus,
    getRecentBillHistoryCountByTransStatus : getRecentBillHistoryCountByTransStatus,
    getLeastHitsConsumedCount: getLeastHitsConsumedCount,
    getAllAPIStatusCount : getAllAPIStatusCount,
    getAllAPITransStatusCount : getAllAPITransStatusCount,
    getusercounttotal:getusercounttotal,
    getwalletcounttotal:getwalletcounttotal

}


async function addTransactionCount(apiName, status) {
   
    if(status==true){
        var transactionCount = await mysqlConnection.insert_query(query.addSuccessCount, [apiName])
        console.log(transactionCount,"transactionCount")
    }else{
        var transactionCount = await mysqlConnection.insert_query(query.addFailureCount, [apiName])
    }
   
}

async function getLeastHitsConsumedCount() {
   
    var transactionCount = await mysqlConnection.query_execute(query.getAPIHitCounts)
    if (transactionCount.status==200) {
        return transactionCount.data[0];
    }
    return false

}
async function getHighestHitsConsumedCount() {
   
    var transactionCount = await mysqlConnection.query_execute(query.getAPIhighestHitCounts)
    if (transactionCount.status==200) {
        return transactionCount.data[0];
    }
    return false

}
async function gettotalnumberofAPIserving() {
   
    var transactionCount = await mysqlConnection.query_execute(query.TotalNumberofAPIServing)
    if (transactionCount.status==200) {
        return transactionCount.data[0];
    }
    return false

}

async function getusercounttotal() {
   
    var transactionCount = await mysqlConnection.query_execute(query.getusercounttotal)
    if (transactionCount.status==200) {
        return transactionCount.data[0];
    }
    return false

}

async function getwalletcounttotal() {
   
    var transactionCount = await mysqlConnection.query_execute(query.getwalletcounttotal)
    if (transactionCount.status==200) {
        return transactionCount.data[0];
    }
    return false

}

async function getAllAPIStatusCount() {
   
    var transactionCount = await mysqlConnection.query_execute(query.getAllAPIStatus)
    if (transactionCount.status==200) {
        return transactionCount.data;
    }
    return false

}
async function getAllAPITransStatusCount() {
   
    var transactionCount = await mysqlConnection.query_execute(query.getAllAPITransStatus, [""])
    if (transactionCount.status==200) {
        return transactionCount.data;
    }
    return false

}

async function getActionBillPaymentCountByStatus() {
   
    var transactionCount = await mysqlConnection.query_execute(query.getCountByStatus, ["actionBillPayment"])
    if (transactionCount.status==200) {
        return transactionCount.data;
    }
    return false

}

async function getActionBillPaymentVerifyCountByStatus() {
   
    var transactionCount = await mysqlConnection.query_execute(query.getCountByStatus,["actionBillPaymentVerify"])
    if (transactionCount.status==200) {
        return transactionCount.data;
    }
    return false

}

async function getRecentBillHistoryCountByStatus() {
   
    var transactionCount = await mysqlConnection.query_execute(query.getCountByStatus,["recentBillHistory"])
    if (transactionCount.status==200) {
        return transactionCount.data;
    }
    return false

}

async function getActionBillPaymentCountByTransStatus() {
   
    var transactionCount = await mysqlConnection.query_execute(query.getCountByTransStatus,["actionBillPayment"])
    if (transactionCount.status==200) {
        return transactionCount.data;
    }
    return false

}

async function getActionBillPaymentVerifyCountByTransStatus() {
   
    var transactionCount = await mysqlConnection.query_execute(query.getCountByTransStatus,["actionBillPaymentVerify"])
    if (transactionCount.status==200) {
        return transactionCount.data;
    }
    return false

}

async function getRecentBillHistoryCountByTransStatus() {
   
    var transactionCount = await mysqlConnection.query_execute(query.getCountByTransStatus,["recentBillHistory"])
    if (transactionCount.status==200) {
        return transactionCount.data;
    }
    return false

}


