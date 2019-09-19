const mysqlConnection = require('../../mysql_connection/query_execute');
const query = require('../../mysql_connection/quiries');

// account_type 'mobile','bank','VPA'
const ACCOUNT_TYPE_MOBILE = 'mobile';
const ACCOUNT_TYPE_BANK = 'bank';
const ACCOUNT_TYPE_VPA = 'VPA';

//status : Beneficiary Status
const STATUS_ACTIVE = "ACTIVE";
const STATUS_INACTIVE = "INACTIVE";
const STATUS_DELETED = "DELETED";
module.exports = {
    getValidBeneficiary:getValidBeneficiary,
    findifsc: findifsc,
    getWalletByID: getWalletByID
}


async function getValidBeneficiary(userId,type,accountNo,ifsc = '') {

    var res= await mysqlConnection.query_execute(query.getValidBeneficiary, [userId,type,accountNo,ifsc,STATUS_ACTIVE])
    if (res.data.length == 0) {
        return false
    }
    return res
}

async function findifsc(ifscCode) {
   
    var ifsc = await mysqlConnection.query_execute(query.findifsc, ifscCode)
    if (ifsc.data.length === 0) {
        return false
    }
    return ifsc.data[0]

}
async function getWalletByID(userid, connection = "") {
   
    var wallet;
    if(connection){
        wallet = await mysqlConnection.query_execute(query.getWalletByID, userid, connection)
    }
    else{
        wallet = await mysqlConnection.query_execute(query.getWalletByID, userid)
    }
    if (wallet.data.length === 0) {
        return false
    }
    return wallet.data[0]

}