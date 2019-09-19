var request = require('request');
var config = require('config');
const mysqlConnection = require('../../mysql_connection/query_execute');
const query = require('../../mysql_connection/quiries')
var uniqid = require('uniqid');
var dateFormat = require('dateformat');


module.exports = {
    createAccessTocken: createAccessTocken
}

function createAccessTocken(userID,deviceID) {
    return new Promise( function(resolve, reject) {

 console.log("user",userID)
 console.log("user",deviceID)
 mysqlConnection.query_execute(query.deletedeviceid_access_token, deviceID).then(function(result) {
    //console.log(result)
    if(result.status == 200){
    var accessTokenId = uniqid();
    var accessTokenCode = deviceID+accessTokenId;
    console.log(accessTokenCode)
 mysqlConnection.query_execute(query.findaccesstoken_access_token, accessTokenCode).then(function(result) {
    //console.log(result.data)  
if(result.status == 200 && result.data.length == 0){  
    mysqlConnection.query_execute(query.finduser_access_token, userID).then(function(result) {
             //console.log(result)
             var accessToken = {};
             accessToken = result.data
             if(accessToken.length == 0 && result.status == 200){  
             accessToken.user_id = userID;
             accessToken.device_id = deviceID;
             accessToken.access_token = accessTokenCode;
             accessToken.date_last_edit = dateFormat("yyyy-mm-dd HH:MM:ss");
             var accessTokenParams = [accessToken.user_id, accessToken.device_id, accessToken.access_token, accessToken.date_last_edit]
                mysqlConnection.insert_query(query.insertaccesstoken_access_token, accessTokenParams).then(function(result) {
                    console.log(result)
                    //console.log(accessToken)
                    resolve (accessToken);
                    
                })
             }else{
             accessToken.user_id = userID;
             accessToken.device_id = deviceID;
             accessToken.access_token = accessTokenCode;
             accessToken.date_last_edit = dateFormat("yyyy-mm-dd HH:MM:ss");
                var accessTokenParams = [accessToken.user_id, accessToken.device_id, accessToken.access_token, accessToken.date_last_edit]
                mysqlConnection.query_execute(query.updateaccesstoken_access_token, accessTokenParams).then(function(result) {
                    console.log(result)
                    resolve (accessToken);
                })
                }        
    })
   
  
    
}

})
}else{
    resolve (false);
}
} ) 
} )      
}
