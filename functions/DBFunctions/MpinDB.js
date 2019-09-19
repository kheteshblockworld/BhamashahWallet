const mysqlConnection = require('../../mysql_connection/query_execute');
const query = require('../../mysql_connection/quiries')
var DBConfig = require('../../mysql_connection/query_execute')

module.exports = {
    getSSOuser: getSSOuser,
    insertuser: insertuser,
    updateuserdate:updateuserdate,
    getSSOuser:getSSOuser,
    deletedeviceid:deletedeviceid,
    finduserbyusermpin:finduserbyusermpin,
    creatempin:creatempin,
    updatempin:updatempin,
    finduserbyuser:finduserbyuser,
    finduserbywallet:finduserbywallet,
    finddeviceid:finddeviceid,
    updateonesignalid:updateonesignalid,
    updatenewmpin:updatenewmpin,
    getValidUserByWalletMobile:getValidUserByWalletMobile,
    getValidUser:getValidUser,
    getssomobile:getssomobile,
    getOtpByUserId:getOtpByUserId,
    deleteuserid:deleteuserid,
    getOtpByCode:getOtpByCode,
    addNewotp:addNewotp,
    getotpdata:getotpdata,
}


async function getSSOuser(user) {
   
    var userID = await  mysqlConnection.query_execute(query.getSSOuser, user)
    if (userID.data.length === 0) {
        return false
    }
    return userID
}

async function insertuser(insertdata) {
  var response = false;
  var connection = await DBConfig.getConnection()
  console.log(connection.threadId)

  await connection.beginTransaction()
  try {
  var insertnew =  await mysqlConnection.insert_query(query.insertuser, insertdata)
//   if (insertnew.data.length === 0) {
//     return false
// }
// return insertnew.data[0]
   if(!insertnew){
     throw new Error ("Unable to add user")
   }
    response = true;
   connection.commit(function (err) {
    if (err) {
        return connection.rollback();
    }
    console.log('success!');
});
  }catch(err){
    console.error(err)
    console.log(connection.threadId)
    await connection.rollback()
    await connection.end();
  }
}

 async function updateuserdate(params) {
    var updatedata =  await mysqlConnection.query_execute(query.updateuserdate, params)
    console.log("updatedata",updatedata)
    if (updatedata.data.length === 0) {
      return false
  }
  console.log("updatedata.data[0]",updatedata.data[0])
  return true
  }


  async function getSSOuser(user) {
    var getuser =  await mysqlConnection.query_execute(query.getSSOuser, user)
    if (getuser.data.length === 0) {
      return false
  }
  return getuser.data[0]
  }

  async function deletedeviceid(user) {
    var device =  await mysqlConnection.query_execute(query.deletedeviceid, user)
    if (device.data.length === 0) {
      return false
  }
  return device
  }

  async function finduserbyusermpin(user) {
    var login =  await  mysqlConnection.query_execute(query.finduserbyusermpin, user)
    if (login.data.length === 0) {
      return false
  }
  return login.data[0]
  }

  async function creatempin(storearr) {
    var insert =  await mysqlConnection.insert_query(query.creatempin, storearr)
    if (insert.data.length === 0) {
      return false
  }
  return insert
  }

  async function updatempin(params) {
    var updatempin =  await  mysqlConnection.query_execute(query.updatempin, params)
    if (updatempin.data.length === 0) {
      return false
  }
  return updatempin
  }

  async function finduserbyuser(userid) {
    var user =  await mysqlConnection.query_execute(query.finduserbyuser, userid)
    if (user.data.length === 0) {
      return false
  }
  return user.data[0]
  }

  async function finduserbywallet(userid) {
    var userwallet =  await mysqlConnection.query_execute(query.finduserbywallet, userid)
    if (userwallet.data.length === 0) {
      return false
  }
  return userwallet.data[0]
  }

  async function finddeviceid(user) {
    var devicedata =  await mysqlConnection.query_execute(query.finddeviceid, user)
    if (devicedata.data.length === 0) {
      return false
  }
  return devicedata.data[0]
  }

  async function updateonesignalid(params) {
    var signalid = await mysqlConnection.query_execute(query.updateonesignalid, params)
    if (signalid.data.length === 0) {
      return false
  }
  return signalid
  }

  async function updatenewmpin(params) {
    var updatempin = await mysqlConnection.query_execute(query.updatenewmpin, params)
    if (updatempin.data.length === 0) {
      return false
  }
  return updatempin
  }

  async function getValidUserByWalletMobile(mobile) {
    var validmobile = await mysqlConnection.query_execute(query.findmobilebywallet, [mobile])
    console.log("monnnd",validmobile)
    if (validmobile.data.length === 0) {
      return false
  }
  return validmobile.data[0]
  }

  async function getValidUser(user_id) {
    var validuser = await  mysqlConnection.query_execute(query.finduser, user_id)
    if (validuser.data.length === 0) {
      return false
  }
  return validuser
  }

  async function getssomobile(phone) {
    var ssomobile = await mysqlConnection.query_execute(query.findusermobile, phone)
    if (ssomobile.data.length === 0) {
      return false
  }
  return ssomobile.data[0]
  }

  async function getOtpByUserId(user) {
    var getotp = await mysqlConnection.query_execute(query.findOTP, user)
    if (getotp.data.length === 0) {
      return false
  }
  return getotp.data[0]
  }

  async function deleteuserid(user_id) {
    var deleteuser = await   mysqlConnection.query_execute(query.deleteuser, user_id)
    if (deleteuser.data.length === 0) {
      return false
  }
  return deleteuser
  }

  async function getOtpByCode(otpcode,otpref) {
    var otp = await mysqlConnection.query_execute(query.otpcheck,[otpcode,otpref] )
    if (otp.data.length === 0) {
      return false
  }
  return otp.data[0].otp
  }

  async function addNewotp(otpcode,otpref,user_id) {
    var now = new Date()
    var dateformat=Utils.dateFormate(now); 
    var storeotp = [user_id,otpcode,otpref,dateformat]
    var addotp = await mysqlConnection.insert_query(query.addotp, storeotp)
    if (addotp.data.length === 0) {
      return false
  }
  return addotp
  }

  async function getotpdata(otp,otpref) {
    var getotp = await mysqlConnection.query_execute(query.otpcheck,[otp,otpref])
    if (getotp.data.length === 0) {
      return false
  }
  return getotp.data[0]
  }