var request = require('request');
var config = require('config');
var api_config = config.get('api_config')
const mysqlConnection = require('../mysql_connection/query_execute');
const query = require('../mysql_connection/quiries')
const Utils = require('../util/utils')
R = require('ramda');


module.exports =   {
    getValidUserByWalletMobile:getValidUserByWalletMobile,
    getValidUser:getValidUser,
    getssomobile:getssomobile,
    getOtpByUserId:getOtpByUserId,
    deleteuserid:deleteuserid,
    getOtpByCode:getOtpByCode,
    addNewotp:addNewotp,
    getotpdata:getotpdata,
}

async function getValidUserByWalletMobile(mobile){
    var mobilenumber = mobile
    console.log("mobile",mobilenumber)
    var result =  await mysqlConnection.query_execute(query.findmobilebywallet, [mobilenumber])
        console.log(result)
        if(result.data.length!=0){
            var user_id = result.data[0]
            console.log("user_id",user_id)
            return user_id
        }
        else{
            return false
        }
}
async function getValidUser(user_id){
   var get =await mysqlConnection.query_execute(query.finduser, user_id)
   console.log("get",get)
        if(get.data.length==0){
        return false
        }
            return get
        

}
async function getssomobile(phone){ 

        console.log(phone)
       
   var result = await mysqlConnection.query_execute(query.findusermobile, phone)     
     if(result.data.length ===0){
        return false
     }
      return result.data[0]
    
}
function getOtpByUserId(user){ 
        mysqlConnection.query_execute(query.findOTP, user).then(function(get) { 
            if(get.data.length!=0){
                return get.data[0]
            }
            else{
                console.log("get",get)
                return false
            }
        })

}
function deleteuserid(user_id){
    return new Promise((resolve, reject) => {  
        mysqlConnection.query_execute(query.deleteuser, user_id).then(function(result) { 
        if(result.status ==200){
            return resolve(result)
        }
        else{
            return resolve(result)
        }
        
        })
    })
}
function getOtpByCode(otpcode,otpref){
 
    return new Promise((resolve, reject) => {  
        mysqlConnection.query_execute(query.otpcheck,[otpcode,otpref] ).then(function(result) { 
        if(result.data.length !=0){
            var otp = result.data[0].otp
            return resolve(otp)
        }
        else{
            return resolve(false)
        }
        
        })
    })

}
function addNewotp(otpcode,otpref,user_id){
    return new Promise((resolve, reject) => {  
        var now = new Date()
        var dateformat=Utils.dateFormate(now); 
        var storeotp = [user_id,otpcode,otpref,dateformat]
        mysqlConnection.insert_query(query.addotp, storeotp).then(function(result) { 
        if(result.status==200){
            var otp = result
            return resolve(otp)
        }
        else{
            return resolve(result)
        }
        
        })
    })

}

function getotpdata(otp,otpref){
    return new Promise((resolve, reject) => {  
        mysqlConnection.query_execute(query.otpcheck,[otp,otpref] ).then(function(result) { 
            if(result.data.length !=0){
                var otp = result.data[0]
                return resolve(otp)
            }
            else{
                return resolve(false)
            }
            
            })

    
    })
}