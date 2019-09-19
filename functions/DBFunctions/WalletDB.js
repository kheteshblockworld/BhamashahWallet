/**
 * @author: Rakesh C
 * @version: 1.0.0
 * @date: October 22, 2018
 * @Description: Functions related to wallet table intract with mySQL DB.
 */


const mysqlConnection = require('../../mysql_connection/query_execute');
const query = require('../../mysql_connection/quiries')
//Wallet Constant

module.exports.KYC_STATUS_NEW_USER = 'NEW_USER';
module.exports.KYC_STATUS_NON_KYC = 'NON_KYC';
module.exports.KYC_STATUS_AADHAAR_KYC = 'AADHAAR_KYC';
module.exports.KYC_STATUS_FULL_KYC = 'FULL_KYC';
// account_type 'mobile','bank','VPA'
module.exports.ACCOUNT_TYPE_MOBILE = 'mobile';
module.exports.ACCOUNT_TYPE_BANK = 'bank';
module.exports.ACCOUNT_TYPE_VPA = 'VPA';

// kyc_type 'AADHAAR','DEMO','DOCUMENT'
module.exports.KYC_TYPE_AADHAAR = 'AADHAAR';
module.exports.KYC_TYPE_DEMO = 'DEMO';
module.exports.KYC_TYPE_DOCUMENT = 'DOCUMENT';

//status : Wallet Status


module.exports = {
    checkWallet: checkWallet,
    checkWalletByID: checkWalletByID,
    getValidWalletByMobile: getValidWalletByMobile,
    getValidWalletByUserId: getValidWalletByUserId,
    addUserInWallet: addUserInWallet,
    getValidWalletByaddress: getValidWalletByaddress,
    Beneficiary:Beneficiary,
    updateWalletBalance:updateWalletBalance,
    updateWalletAddress:updateWalletAddress,
    getAddressesByMobile:getAddressesByMobile,
    updatewalletaadhar:updatewalletaadhar,
    updatestatus:updatestatus,
    getWalletBYID:getWalletBYID,
    updatewalletstatusactive:updatewalletstatusactive,
    updatewalletstatus:updatewalletstatus,
    updateuserstatus:updateuserstatus,
    updatewstatus:updatewstatus,
    feedbackstatus:feedbackstatus,
    loadreversalfind:loadreversalfind,
    gettransactionbyid:gettransactionbyid,
    updatetransactionloadmeta:updatetransactionloadmeta,
    updatetransstatus:updatetransstatus
}

async function checkWallet(mobile) {

    var res = await mysqlConnection.query_execute(query.checkWalletByMobile, [mobile])
    if (res.data.length === 0) {
        return false
    }
    return res.data[0]
}

async function updateWalletBalance(wallet_balance, userId, connection = "") {

    var res = await mysqlConnection.query_execute(query.updateWalletBalance, [wallet_balance, userId],connection)
    if (res.data.affectedRows === 0) {
        return false
    }
    return true
}

async function checkWalletByID(id) {

    var res = await mysqlConnection.insert_query(query.getWalletByID, [id])
    if (res.data.length === 0) {
        return false
    }
    return res.data[0]
}

async function getValidWalletByMobile(mobile) {
    var res = await mysqlConnection.query_execute(query.getWalletByMobile, [mobile])
    if (res.data.length === 0) {
        return false
    }
    return res.data[0]
}

async function getValidWalletByUserId(id) {

    var res = await mysqlConnection.query_execute(query.getWalletByID, [id])
    if (res.data.length == 0) {
        return false
    }
    return res.data[0]

}
async function Beneficiary(id) {

    var res = await mysqlConnection.query_execute(query.Beneficiary, [id])
    console.log(res)
    if (res.data.length === 0) {
        return false
    }
    return res.data[0]

}

async function addUserInWallet(params,connection = "") {

    var res = await mysqlConnection.insert_query(query.addUserInWallet, params,connection)
    if (res.status != 200) {
        return false
    }
    return true

}

async function updateWalletAddress(userId, Addressess) {
    var res = await mysqlConnection.query_execute(query.updateWalletAddress, [Addressess, userId])
    console.log(res)
    if (res.data.length === 0) {
        return false
    }
    return res.data[0]

}

async function getAddressesByMobile(mobile) {
    var res = await mysqlConnection.query_execute(query.getAddressesByMobile, [mobile])
    console.log(res)
    if (res.data.length === 0) {
        return false
    }
    return res.data[0].addressess

}

async function getValidWalletByaddress(params) {
    console.log(params)

    var res = await mysqlConnection.query_execute(query.getuserbyaddress, params)
    console.log(res)
    if (res.data.length === 0) {
        return false
    }
    return res

}


async function updatewalletaadhar(params,connection="") {
    console.log(params)

    var res = await mysqlConnection.query_execute(query.updatewalletaadhar, params,connection)
    console.log(res)
    if (res.data.length === 0) {
        return false
    }
    return res

}


async function updatestatus(params,connection = "") {
    console.log(params)

    var res = await mysqlConnection.query_execute(query.updatestatus, params,connection)
    console.log(res)
    if (res.data.length === 0) {
        return false
    }
    return res

}
async function getWalletBYID(params) {
    console.log(params)

    var res = await mysqlConnection.query_execute(query.getWalletBYID, params)
    console.log(res)
    if (res.data.length === 0) {
        return false
    }
    return res

}


async function updatewalletstatusactive(params,connection="") {
    console.log(params)

    var res = await mysqlConnection.query_execute(query.updatewalletstatusactive, params,connection)
    console.log(res)
    if (res.data.length === 0) {
        return false
    }
    return res
}

async function updatewalletstatus(params) {
    console.log(params)
    var res = await mysqlConnection.query_execute(query.updatewalletstatus, params)
    console.log(res)
        if (res.data.length === 0) {
            return false
        }
        return res

}

async function updateuserstatus (params) {
    console.log(params)

    var res = await mysqlConnection.query_execute(query.updateuserstatus, params)
    console.log(res)
        if (res.data.length === 0) {
            return false
        }
        return res

}
async function updatewstatus (params) {
    console.log(params)

    var res = await mysqlConnection.query_execute(query.updatewstatus, params)
    console.log(res)
        if (res.data.length === 0) {
            return false
        }
        return res

}
async function feedbackstatus(params) {
    console.log(params)

    var res = await mysqlConnection.insert_query(query.feedbackstatus, params)
    console.log(res)
        if (res.data.length === 0) {
            return false
        }
        return res

}

async function loadreversalfind(params) {
    console.log(params)

    var res = await mysqlConnection.query_execute(query.loadreversalfind, params)
    console.log(res)
    if (res.data.length === 0) {
        return false
    }
    return res

}

async function gettransactionbyid(params) {
    console.log(params)

    var res = await mysqlConnection.query_execute(query.gettransactionbyid, params)
    console.log(res)
    if (res.data.length === 0) {
        return false
    }
    return res

}

async function updatetransactionloadmeta(params,connection = "") {
    var res = await mysqlConnection.query_execute(query.transaction_load_meta, params,connection)
    console.log(res)
    if (res.data.length === 0) {
        return false
    }
    return true

}

async function updatetransstatus(params,connection = "") {
    var res = await mysqlConnection.query_execute(query.updatetransstatus, params,connection)
    console.log(res)
    if (res.data.length === 0) {
        return false
    }
    return true

}