const mysqlConnection = require('../../mysql_connection/query_execute');
const query = require('../../mysql_connection/quiries')

module.exports = {
   getBckeyForUser:getBckeyForUser,
   readusersid:readusersid,
   updateuserdata:updateuserdata,
   getUserById:getUserById,
   updateuserstatus:updateuserstatus,
   logout: logout,
   getBeneficiary : getBeneficiary,
   getbeneficiaryByStatus : getbeneficiaryByStatus
}


async function getBckeyForUser(userId) {
   
    var userID = await mysqlConnection.query_execute(query.getBckeyForUser, [userId])
    if (userID.data.length === 0) {
        return false
    }
    return userID.data[0].blockchain_key

}


async function readusersid (params) {
    console.log(params)

    var res = await mysqlConnection.query_execute(query.readusersid, params)
    console.log(res)
        if (res.data.length === 0) {
            return false
        }
        return res

}

async function updateuserdata (params,connection="") {
    console.log(params)

    var res = await mysqlConnection.query_execute(query.updateuserdata, params,connection)
    console.log(res)
        if (res.data.length === 0) {
            return false
        }
        return res

}


async function updateuserstatus (params,connection="") {
    console.log(params)

    var res = await mysqlConnection.query_execute(query.updateuserstatus, params,connection)
    console.log(res)
        if (res.data.length === 0) {
            return false
        }
        return res

}


async function getUserById(userId, connection = "") {
   
    var userID ;
    if(connection){
        userID = await mysqlConnection.query_execute(query.findUsers, userId, connection)
    }
    else{
        userID = await mysqlConnection.query_execute(query.findUsers, userId)
    }
    if (userID.data.length === 0) {
        return false
    }
    return userID.data[0]

}

async function getBeneficiary(beneficiaryArr) {
   
    var res = await mysqlConnection.query_execute(query.getBeneficiary, beneficiaryArr)
    if (res.status === 200) {
        return res
        
    }else{
        return false
    }
    

}
async function getbeneficiaryByStatus(beneficiaryArr) {
   
    var res = await mysqlConnection.query_execute(query.fetchBeneficiary, beneficiaryArr)
    if (res.status === 200) {
        return res
        
    }else{
        return false
    }
    

}


async function logout(id) {
   
    var res = await mysqlConnection.query_execute(query.Logout, ["null",id])
    if (res.status === 200) {
        return res
        
    }else{
        return false
    }
   

}
