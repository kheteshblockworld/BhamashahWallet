'use strict';
var validator = require('validator');
const yesBankServicesFun = require('../../functions/YesBankServices/yesBankServices');
const multichainAddData = require('../../functions/multichainFunctions/addData');
const multichainReadData = require('../../functions/multichainFunctions/readData');
const multichainUpdateData = require('../../functions/multichainFunctions/updateData');
const getChecksum = require('../../util/generateChecksum');
var request = require('request');
const transcationType = require('../../message/transcationType');
var config = require('config');
const mysqlConnection = require('../../mysql_connection/query_execute');
const query = require('../../mysql_connection/quiries')
const  transactionCountDB= require('../../functions/DBFunctions/TransactionCountDB');
var uniqid = require('uniqid');
const Utils = require('../../util/utils')
const invokeSDK = require('../../sdk/invoke')
const querySDK = require('../../sdk/query')
var dateFormat = require('dateformat');

module.exports = {
    getLeastConsumedHitsAPI: getLeastConsumedHitsAPI,
    getHighestConsumedHitsAPI:getHighestConsumedHitsAPI,
    Todaytransactioncount:Todaytransactioncount,
    TotalNumberOfAPIserving:TotalNumberOfAPIserving,
    getAppNodesCount: getAppNodesCount,
    getActionBillPaymentCountByStatus: getActionBillPaymentCountByStatus,
    getActionBillPaymentVerifyCountByStatus: getActionBillPaymentVerifyCountByStatus,
    getRecentBillHistoryCountByStatus: getRecentBillHistoryCountByStatus,
    getActionBillPaymentCountByTransStatus: getActionBillPaymentCountByTransStatus,
    getActionBillPaymentVerifyCountByTransStatus: getActionBillPaymentVerifyCountByTransStatus,
    getRecentBillHistoryCountByTransStatus: getRecentBillHistoryCountByTransStatus,
    getAppNodesCount: getAppNodesCount,
    getAllAPIStatusCount : getAllAPIStatusCount,
    getAllAPITransStatusCount: getAllAPITransStatusCount,
    getTotalRequestAmountCount: getTotalRequestAmountCount,
    getPendingStatusAmountCount: getPendingStatusAmountCount,
    getPaidStatusAmountCount: getPaidStatusAmountCount,
    getActiveRequestStatusCount: getActiveRequestStatusCount,
    getNonActiveRequestCount: getNonActiveRequestCount,
    getapiResponseTime: getapiResponseTime,
    getUserCount: getUserCount,
    getWalletUserCountByStatus: getWalletUserCountByStatus,
    getWalletBalance: getWalletBalance,
    usercounttotal:usercounttotal,
    walletcounttotal:walletcounttotal,
    getUtilityPayment: getUtilityPayment,
    getUtilityTransStatus: getUtilityTransStatus,
    getTotalTransCount: getTotalTransCount,
    getLoadTransStaus:getLoadTransStaus,
    getwallettowalletTransStatus:getwallettowalletTransStatus,
    getwallettoBankTransStatus:getwallettoBankTransStatus,
    getDailyCountTest:getDailyCountTest,
    getWeekCountTest:getWeekCountTest,
    getMonthCountTest:getMonthCountTest,
    getYearCountTest:getYearCountTest
}
async function getMonthCountTest(callback){
    const IndexOf_CurrentDate= await mysqlConnection.query_execute('SELECT * FROM TransactionCountDayWeekMonth ORDER BY Date DESC')
    console.log(IndexOf_CurrentDate.data);
    try{
    var sum=0
    for(var i=0;i<=30;i++){
         sum= parseInt(sum)+parseInt(IndexOf_CurrentDate.data[i].Count)
         console.log("Index wise addition",parseInt(sum));  
    }}
    catch(err){
        if(err){
            callback(" ",{status:204,"message":"data not availaible"});
        }else{
    console.log("Total Transaction Counts for Month",parseInt(sum));
    callback(" ",{status:200,"Total_Month_Transaction_Count":parseInt(sum)});
    }
}
}
async function getYearCountTest(callback){
    const IndexOf_CurrentDate= await mysqlConnection.query_execute('SELECT * FROM TransactionCountDayWeekMonth ORDER BY Date DESC')
    console.log(IndexOf_CurrentDate.data);
    var sum=0
    for(var i=0;i<=365;i++){
         sum= parseInt(sum)+parseInt(IndexOf_CurrentDate.data[i].Count)
         console.log("Index wise addition",parseInt(sum));  
    }

    console.log("Total Transaction Counts for yearly",parseInt(sum));
    callback("",{status:200,"Total_Year_Transaction_Count":parseInt(sum)});
}

async function getWeekCountTest(callback){
    const IndexOf_CurrentDate= await mysqlConnection.query_execute('SELECT * FROM TransactionCountDayWeekMonth ORDER BY Date DESC')
    console.log(IndexOf_CurrentDate.data);
    try{
    var sum=0
    for(var i=0;i<=6;i++){
         sum= parseInt(sum)+parseInt(IndexOf_CurrentDate.data[i].Count)
         console.log("Index wise addition",parseInt(sum));  
    }
}
catch(err){
    if(err){
        callback(" ",err);
    }
}
console.log("Total Transaction Counts for week",parseInt(sum));
callback("",{status:200,"Total_Week_Transaction_Count":parseInt(sum),"Date_&_Count":IndexOf_CurrentDate.data}); 
}

 async function getDailyCountTest(callback){
    //Get counts for current date    
    console.log("insert query")
    const Count=1;
    const now = new Date();
    console.log("now Date",now);
    const CurrentDate = Utils.datechange(now);
    console.log("Current Date",CurrentDate);
    const result= await mysqlConnection.query_execute('SELECT * FROM TransactionCountDayWeekMonth WHERE Date = ?', CurrentDate)
    console.log(result);
    if(result.data.length != 0){
    console.log("true");
    const transactionCountUpdate = await mysqlConnection.query_execute(query.updateCountForTx, [CurrentDate,Count])
    console.log(transactionCountUpdate.data);
    }else{
    console.log("false");
    const transactionCountInsert = await mysqlConnection.insert_query(query.addSuccessCountForTx, [CurrentDate,Count])
    console.log(transactionCountInsert);
   }
   callback("", {status:200,TotalCount_Daily:result.data[0]});

}

async function getAllAPIStatusCount() {
    var APIDetails = await transactionCountDB.getAllAPIStatusCount();
   if(APIDetails !== false){
    var obj = APIDetails
    console.log("APIDetails",APIDetails)
    return ({
        "statusCode": 200,
         "data":obj
    })
   }else{
    return ({
        "statusCode": 400,
        "message": "error while fetching data"
    }) 
}
   }

   async function getAllAPITransStatusCount() {
    var APIDetails = await transactionCountDB.getAllAPITransStatusCount();
   if(APIDetails !== false){
    var obj = APIDetails
    
    return ({
        "statusCode": 200,
         "data":obj
    })
   }else{
    return ({
        "statusCode": 400,
        "message": "error while fetching data"
    }) 
}
   }
async function getLeastConsumedHitsAPI() {
    var APIDetails = await transactionCountDB.getLeastHitsConsumedCount();
   if(APIDetails !== false){
    var obj = {
        "API_Name" : APIDetails.api_name,
        "Total_Least_Hits_Count" : APIDetails.total_count
    }
    
    return ({
        "statusCode": 200,
         "data":obj
    })
   }else{
    return ({
        "statusCode": 400,
        "message": "error while fetching data"
    }) 
}
   }

   async function usercounttotal() {
    var APIDetails = await transactionCountDB.getusercounttotal();
    console.log("api",APIDetails)
   if(APIDetails !== false){
    var obj = {
        "UserCount" : APIDetails.usercount
    }
    
    return ({
        "statusCode": 200,
         "data":obj
    })
   }else{
    return ({
        "statusCode": 400,
        "message": "error while fetching data"
    }) 
}
   }

   async function walletcounttotal() {
    var APIDetails = await transactionCountDB.getwalletcounttotal();
    console.log("api",APIDetails)
   if(APIDetails !== false){
    var obj = {
        "WalletCount" : APIDetails.walletcount
    }
    
    return ({
        "statusCode": 200,
         "data":obj
    })
   }else{
    return ({
        "statusCode": 400,
        "message": "error while fetching data"
    }) 
}
   }
   async function getHighestConsumedHitsAPI() {
    var APIDetails = await transactionCountDB.getHighestHitsConsumedCount();
    console.log("APIDetails",APIDetails)
   if(APIDetails !== false){
    var obj = {
        "API_Name" : APIDetails.api_name,
        "Total_Highest_Hits_Count" : APIDetails.total_count
    }
    
    return ({
        "statusCode": 200,
         "data":obj
    })
   }else{
    return ({
        "statusCode": 400,
        "message": "error while fetching data"
    }) 
}
   }
   async function TotalNumberOfAPIserving() {
    var APIDetails = await transactionCountDB.gettotalnumberofAPIserving();
    console.log("APIDetails",APIDetails.TotalNumberofAPIserving)
   if(APIDetails !== false){
    var obj = {
        
        "Total_NumberOFServing" : APIDetails.TotalNumberofAPIserving
    }
    
    return ({
        "statusCode": 200,
         "data":obj
    })
   }else{
    return ({
        "statusCode": 400,
        "message": "error while fetching data"
    }) 
}
   }

   async function getActionBillPaymentCountByStatus() {
    var APIDetails = await transactionCountDB.getActionBillPaymentCountByStatus();
   if(APIDetails !== false){
    var obj = APIDetails;
    
    return ({
        "statusCode": 200,
         "data":obj
    })
   }else{
    return ({
        "statusCode": 400,
        "message": "error while fetching data"
    }) 
}
   }

   async function getActionBillPaymentVerifyCountByStatus() {
    var APIDetails = await transactionCountDB.getActionBillPaymentVerifyCountByStatus();
   if(APIDetails !== false){
    var obj = APIDetails;
    
    return ({
        "statusCode": 200,
         "data":obj
    })
   }else{
    return ({
        "statusCode": 400,
        "message": "error while fetching data"
    }) 
}
   }

   async function getRecentBillHistoryCountByStatus() {
    var APIDetails = await transactionCountDB.getRecentBillHistoryCountByStatus();
   if(APIDetails !== false){
    var obj = APIDetails;
    
    return ({
        "statusCode": 200,
         "data":obj
    })
   }else{
    return ({
        "statusCode": 400,
        "message": "error while fetching data"
    }) 
}
   }

   async function getActionBillPaymentCountByTransStatus() {
    var APIDetails = await transactionCountDB.getActionBillPaymentCountByTransStatus();
   if(APIDetails !== false){
    var obj = APIDetails;
    
    return ({
        "statusCode": 200,
         "data":obj
    })
   }else{
    return ({
        "statusCode": 400,
        "message": "error while fetching data"
    }) 
}
   }

   async function getActionBillPaymentVerifyCountByTransStatus() {
    var APIDetails = await transactionCountDB.getActionBillPaymentVerifyCountByTransStatus();
   if(APIDetails !== false){
    var obj = APIDetails;
    
    return ({
        "statusCode": 200,
         "data":obj
    })
   }else{
    return ({
        "statusCode": 400,
        "message": "error while fetching data"
    }) 
}
   }

   async function getRecentBillHistoryCountByTransStatus() {
    var APIDetails = await transactionCountDB.getRecentBillHistoryCountByTransStatus();
   if(APIDetails !== false){
    var obj = APIDetails;
    
    return ({
        "statusCode": 200,
         "data":obj
    })
   }else{
    return ({
        "statusCode": 400,
        "message": "error while fetching data"
    }) 
}
   }
   
   async function getAppNodesCount() {

    var obj = {
        "TotalNodes": 4
    }
    return ({
        "statusCode": 200,
         "data":obj
    })

   }
   
   function Todaytransactioncount () {
    return new Promise( async (resolve,reject)=>{

       var now = new Date() 
       console.log("now",now)
       var date_from = Utils.datechange(now);
       console.log("now",date_from)
       var limit = "00:00:00"
       var datelimit = date_from + ' '+limit
       console.log("datelimit",datelimit) 
       var date_created = Utils.dateFormate(now);
       console.log("now",date_created)
      var params = [datelimit,date_created]
       var res = await mysqlConnection.query_execute(query.gettodaytransaction, params)
       console.log(res,"res")
       console.log(res.data[0],"res")
       var err = {
           "status":404,
           "error": "data not found"
       }
           if (res.data.length === 0) {
               return reject(err)
           }else{
            var data = []
               for(var i=0; i<res.data.length;i++){
    var record = {
"Type":res.data[i].type,
"status":res.data[i].status,
"count": res.data[i].count
}
data.push(record)
console.log("data",data)
        }
    }
        return resolve({
            "status": res.status,
            "data":data,
            "message":res.message
        })
    })
       
   
   }

  
   async function getTotalRequestAmountCount(bodyValue,callback){
    var result;
    var date1 = bodyValue.date1;
    var date2 = bodyValue.date2;
    if(!date1 || !date2 || !date1.trim() || !date2.trim()){
        result = await mysqlConnection.query_execute(query.getDailyTotalRequestAmountCount,0);
    }
    else{
        result = await mysqlConnection.query_execute(query.getTotalRequestAmountCount, [date1, date2]);
    }

    if(result.data.length == 0 || result.status != 200){
       var error = {
            "status": result.status,
            "error": result.message
        }
    }
    else{
       var value = {
            "status": result.status,
            "data": result.data[0].total_amount
        }
    }
    callback (error, value);
 
}

async function getPendingStatusAmountCount(bodyValue,callback){
    var result;
    var date1 = bodyValue.date1;
    var date2 = bodyValue.date2;
    if(!date1 || !date2 || !date1.trim() || !date2.trim()){
        result = await mysqlConnection.query_execute(query.getDailyTotalRequestStatusAmountCount,[transcationType.REQUEST_STATUS_PENDING]);
    }
    else{
        result = await mysqlConnection.query_execute(query.getTotalRequestStatusAmountCount, [transcationType.REQUEST_STATUS_PENDING, date1, date2]);
    }
    if(result.data.length == 0 || result.status != 200){
       var error = {
            "status": result.status,
            "error": result.message
        }
    }
    else{
       var value = {
            "status": result.status,
            "amount": (result.data[0].total_amount),
            "statusCount": result.data[0].total_status
        }
    }
    callback (error, value);
}

async function getPaidStatusAmountCount(bodyValue,callback){
    var result;
    var date1 = bodyValue.date1;
    var date2 = bodyValue.date2;
    if(!date1 || !date2 || !date1.trim() || !date2.trim()){
        result = await mysqlConnection.query_execute(query.getDailyTotalRequestStatusAmountCount,[transcationType.REQUEST_STATUS_PAID]);
    }
    else{
        result = await mysqlConnection.query_execute(query.getTotalRequestStatusAmountCount, [transcationType.REQUEST_STATUS_PAID, date1, date2]);
    }
    if(result.data.length == 0 || result.status != 200){
       var error = {
            "status": result.status,
            "error": result.message
        }
    }
    else{
       var value = {
            "status": result.status,
            "amount": result.data[0].total_amount,
            "statusCount": result.data[0].total_status
        }
    }
    callback (error, value);
}

async function getActiveRequestStatusCount(bodyValue,callback){
    var result;
    var date1 = bodyValue.date1;
    var date2 = bodyValue.date2;
    if(!date1 || !date2 || !date1.trim() || !date2.trim()){
        result = await mysqlConnection.query_execute(query.getDailyTotalStatusAmountCount,[transcationType.REQUEST_STATUS_ACTIVE]);
    }
    else{
        result = await mysqlConnection.query_execute(query.getTotalStatusAmountCount, [transcationType.REQUEST_STATUS_ACTIVE, date1, date2]);
    }
    if(result.data.length == 0 || result.status != 200){
       var error = {
            "status": result.status,
            "error": result.message
        }
    }
    else{
       var value = {
            "status": result.status,
            "amount": result.data[0].total_amount,
            "statusCount": result.data[0].total_status     
        }
    }
    callback (error, value);
}

async function getNonActiveRequestCount(bodyValue,callback){
    var result;
    var date1 = bodyValue.date1;
    var date2 = bodyValue.date2;
    if(!date1 || !date2 || !date1.trim() || !date2.trim()){
        result = await mysqlConnection.query_execute(query.getDailyTotalStatusAmountCount,[transcationType.REQUEST_STATUS_DELETED]);
    }
    else{
        result = await mysqlConnection.query_execute(query.getTotalStatusAmountCount, [transcationType.REQUEST_STATUS_DELETED, date1, date2]);
    }
    if(result.data.length == 0 || result.status != 200){
       var error = {
            "status": result.status,
            "error": result.message
        }
    }
    else{
       var value = {
            "status": result.status,
            "amount": result.data[0].total_amount,
            "statusCount": result.data[0].total_status   
        }
    }
    callback (error, value);
}

async function getapiResponseTime(bodyValue,callback){
    var result;
    var date1 = bodyValue.date1;
    var date2 = bodyValue.date2;
    if(!date1 || !date2 || !date1.trim() || !date2.trim()){
        result = await mysqlConnection.query_execute(query.getDailyApiResponseTime);
    }
    else{
        result = await mysqlConnection.query_execute(query.getApiResponseTime, [date1, date2]);
    }
    if(result.data.length == 0 || result.status != 200){
       var error = {
            "status": result.status,
            "error": result.message
        }
    }
    else{
       var value = {
            "status": result.status,
            "data": result.data 
        }
    }
    callback (error, value);
}

async function getWalletBalance(callback){
    var result;
    result = await mysqlConnection.query_execute(query.getWalletBalance);
    if(result.data.length == 0 || result.status != 200){
       var error = {
            "status": result.status,
            "error": result.message
        }
    }
    else{
       var value = {
            "status": result.status,
            "data": result.data[0].balance 
        }
    }
    callback (error, value);
}

/**
 * @author: Sandhya Parkar
 * @version: 1.0.0
 * @date: November 20 , 2018
 * @Description: Unique users count accessing the portal, count can be calculated by current week, current month , current year or the 
 * dates provided as input. It will also calculate the total count.
 */
 async function getUserCount(request,callback){
    var result;
    var start_date = request.body.start_date;
    var end_date = request.body.end_date;
    var currentWeek = request.body.currentWeek;
    var currentMonth =request.body.currentMonth;
    var currentYear= request.body.currentYear;
    var count;
    var date;
    var totalCount = 0;
    if(start_date == "" && end_date == ""){
        if(currentMonth =="2"){
            result = await  mysqlConnection.query_execute( query.getUserCountByCurrentMonth);
        }else if(currentWeek == "1"){
            result = await  mysqlConnection.query_execute( query.getUserCountByCurrentWeek);    
        }else if(currentYear == "3"){
            result = await  mysqlConnection.query_execute( query.getUserCountByCurrentYear);    
        }
    }
    else{
        var params = [start_date,end_date]
        result = await mysqlConnection.query_execute(query.getUserCountByDates, params);
        console.log("result======>",result.data[0].date_created);
    }
    if(result.data.length == 0 && result.status == 200){
       var error = {
            "statusCode": result.status,
            "error": result.error
        }
    }
    else{
        var rec = []
        for(let i=0;i<result.data.length; i++){
             date= result.data[i].login_timestamp
           
             count = result.data[i].count
             
            console.log("date", date)
            
            console.log("count", count)
                    var records ={
                       "date": date ,
                       "count": count
                    }  
                    totalCount = totalCount + count     
                    rec.push(records)
                }
                console.log("value",rec)
for(let j=0; j < rec.length; j++){
console.log("result", rec[j])

}

            console.log(result.status)
            console.log("m in success")

       var value = {
            "statusCode": result.status,
           "data": rec,
           "Total Count": totalCount  
        }
    }
    callback (error, value);
}



/**
 * @author: Sandhya Parkar
 * @version: 1.0.0
 * @date: November 20 , 2018
 * @Description: Wallet users count by status (Active / Inactive). By default it will show the active users count.
 */
async function getWalletUserCountByStatus(request,callback){
    var result;
//    var status = request.body.status;
 
    // if(status){
        result = await mysqlConnection.query_execute(query.getWalletUsersCountBySatus);
        console.log("result======>",result.data[0].count);
    // }
   

    if(result.data.length == 0 || result.status != 200){
       var error = {
            "statusCode": result.status,
            "error": result.error
        }
    }
    else{
       var value = {
            "statusCode": result.status,
            "data": result.data
        }
    }
    callback (error, value);
 
}



async function getUtilityPayment(callback){
    var result;
    result = await mysqlConnection.query_execute(query.getUtilityPayment,["BillPayment"]);
    if(result.data.length == 0 || result.status != 200){
       var error = {
            "status": result.status,
            "error": result.message
        }
    }
    else{
       var value = {
            "status": result.status,
            "data": result.data[0].total_count 
        }
    }
    callback (error, value);
}

async function getUtilityTransStatus(callback){
    var result;
    result = await mysqlConnection.query_execute(query.getUtilityTransStatus,["BillPayment"]);
    if(result.data.length == 0 || result.status != 200){
       var error = {
            "status": result.status,
            "error": result.message
        }
    }
    else{
       var value = {
            "status": result.status,
            "data": result.data 
        }
    }
    callback (error, value);
}

async function getLoadTransStaus(callback){
    var result;
    result = await mysqlConnection.query_execute(query.getUtilityTransStatus,["load"]);
    if(result.data.length == 0 || result.status != 200){
       var error = {
            "status": result.status,
            "error": result.message
        }
    }
    else{
       var value = {
            "status": result.status,
            "data": result.data 
        }
    }
    callback (error, value);
}

async function getwallettowalletTransStatus(callback){
    var result;
    result = await mysqlConnection.query_execute(query.getUtilityTransStatus,["FundTransfer"]);
    if(result.data.length == 0 || result.status != 200){
       var error = {
            "status": result.status,
            "error": result.message
        }
    }
    else{
       var value = {
            "status": result.status,
            "data": result.data 
        }
    }
    callback (error, value);
}

async function getwallettoBankTransStatus(callback){
    var result;
    result = await mysqlConnection.query_execute(query.getUtilityTransStatus,["IMPSTransfer"]);
    if(result.data.length == 0 || result.status != 200){
       var error = {
            "status": result.status,
            "error": result.message
        }
    }
    else{
       var value = {
            "status": result.status,
            "data": result.data 
        }
    }
    callback (error, value);
}

async function getTotalTransCount(callback){
    var result;
    result = await mysqlConnection.query_execute(query.getTotalTransCount);
    if(result.data.length == 0 || result.status != 200){
       var error = {
            "status": result.status,
            "error": result.message
        }
    }
    else{
       var value = {
            "status": result.status,
            "data": result.data[0].total_count 
        }
    }
    callback (error, value);
}

/**
 * @author: Sandhya Parkar
 * @version: 1.0.0
 * @date: December 19 , 2018
 * @Description: Unique Transaction count calculated by current date, current week, current month & current year  
 *
 */
// async function getCurrentDateTransactionCount(callback){
//     var result;
//     result = await mysqlConnection.query_execute(query.getTransactionCountByCurrentDate);
//     if(result.data.length == 0 || result.status != 200){
//        var error = {
//             "status": result.status,
//             "error": result.message
//         }
//     }
//     else{
//        var value = {
//             "status": result.status,
//             "data": result.data
//         }
//     }
//     callback (error, value);
// }
