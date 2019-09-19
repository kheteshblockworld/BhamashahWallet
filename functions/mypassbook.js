'use strict';

var bcSdk = require('../sdk/invoke');
var bcstore = require('../sdk/query');
const mysqlConnection = require('./../mysql_connection/query_execute');
const query = require('./../mysql_connection/quiries');
const walletDB = require('./DBFunctions/WalletDB')
const readtransactionhistory = require('./../sdk/wallet');
var Utils = require('./../util/utils')
var format = require('date-format');
var moment = require('moment');

module.exports = {

    readpassbook: readpassbook,
    mypassbookdb: mypassbookdb
}


/**
 * A module that will add data into the blockchain!
 * @module readData
 */
/** Add Data into blockchain.*/

function readpassbook(user_language, access_token, days, page) {
    return new Promise(async (resolve, reject) => {
        var arr = [access_token]
        mysqlConnection.query_execute(query.readaadharkyc, arr).then(function (getuserid) {
            console.log("getuserid", getuserid.data[0].user_id)
            var user_id = getuserid.data[0].user_id
            var params = [user_id]
            mysqlConnection.query_execute(query.findaddress, params)
                .then(function (result) {
                    var address = result.data[0].address
                    console.log("address", address)
                    readtransactionhistory.transactionHistory(address).then(function (result) {
                        console.log("result", result.response)
                        var passbook_rec = result.response
                        if (passbook_rec.length == 0) {
                            return resolve({
                                "status": 401,
                                "message": "Record was not there please check the address"
                            })
                        } else {

                            var record = []
                            var Type

                            for (let i = 0; i < passbook_rec.length; i++) {
                                console.log("passbook_rec[i].balance", passbook_rec[i].balance)
                                console.log("passbook_rec[i].balance", passbook_rec[i].time)

                                for (let j = 0; j < passbook_rec[i].balance.assets.length; j++) {
                                    console.log("myassets", passbook_rec[i].balance.assets[j])
                                    //	var value = passbook_rec[i].balance.assets[j].qty > 0 ? "credited": "Depited"
                                    var value = passbook_rec[i].balance.assets[j].qty
                                    if (value > 0) {
                                        Type = "Credited"
                                    } else {
                                        Type = "Debited"
                                    }
                                    for (let j = 0; j < passbook_rec[i].myaddresses.length; j++) {
                                        console.log("myaddress", passbook_rec[i].myaddresses[j])
                                        for (let j = 0; j < passbook_rec[i].addresses.length; j++) {
                                            console.log("myaddress", passbook_rec[i].addresses[j])

                                            var time = passbook_rec[i].time
                                            var formattedTime = new Date(time * 1000)
                                            console.log("formattedTime", formattedTime)
                                            var finaldata = {
                                                "amount": passbook_rec[i].balance.assets[j],
                                                "Fromaddress": passbook_rec[i].myaddresses[j],
                                                "Toaddress": passbook_rec[i].addresses[j],
                                                "Type": Type,
                                                "time": formattedTime
                                            }
                                            record.push(finaldata)
                                        }
                                    }
                                }
                            }
                        }

                        return resolve({
                            "status": 200,
                            "message": result
                        })

                    })


                })
        }).catch(function (err) {
            callback(err, "");
        })
    })

}


async function mypassbookdb(user_language, access_token, days, page) {
    return new Promise(async (resolve, reject) => {
        var response = {}
        var errorCode = "ERROR_EA02"
        var arr = [access_token]
        
            mysqlConnection.query_execute(query.readaadharkyc, arr).then(async function (getuserid) {
                try {
                    if(getuserid.data.length == 0){
                        errorCode = "ERROR_EA00"
                        throw new Error("data was not there")
                    }
                // console.log("getuserid", getuserid.data[0].user_id)
                var next_page
                var user_id = getuserid.data[0].user_id
                var show_to_user = 1
                var content = []
                var getaddress = await mysqlConnection.query_execute(query.checkWalletByID, [user_id])
                console.log("getaddress", getaddress)
                var address = getaddress.data[0].address
                var page_size = 10;
                var LIMIT = page_size + 1;
                var fromdate, todate;
                var fromlimit, tolimit;
                var value = []
                var date = new Date()
                todate = date.toLocaleString()
                // console.log("fromdate",todate.toLocaleString())
                var params
                // console.log("days",days)
                if (page == 1) {
                    fromlimit = 10
                    tolimit = 0
                } else {
                    fromlimit = 10
                    tolimit = (page - 1) * 10
                }

                if (days == 1) {
                    // fromdate = date.toLocaleString()
                    var now = new Date()
                    console.log("now", now)
                    var date_from = Utils.datechange(now);
                    console.log("now", date_from)
                    var limit = "00:00:00"
                    fromdate = date_from + ' ' + limit
                    console.log("datelimit", fromdate)
                    todate = Utils.dateFormate(date);
                    console.log("now", todate)
                } else if (days == 7) {
                    fromdate = moment().subtract(7, 'days').format("YYYY-MM-DD HH:mm:ss")
                    // console.log("todate",fromdate)
                } else {
                    fromdate = "2003-10-23 23:59:59"
                }
                console.log("fromdate,todate", todate, fromdate)
                params = [show_to_user, user_id, fromdate, todate, fromlimit, tolimit]
                var showuser = await mysqlConnection.query_execute(query.getdatabydate, params)
                // console.log("checktransactionstatus",showuser.data)
                var transaction = {}
                var record = []
                var data = showuser.data;
                console.log("data", data.length);
                if (data.length >= page_size) {
                    next_page = true
                } else {
                    next_page = false
                }
                if (data.length > 0) {
                    for (let i = 0; i < data.length; i++) {

                        transaction["transaction_id"] = data[i].transaction_id
                        transaction["amount"] = data[i].amount
                        transaction["transaction_reference_number"] = data[i].transaction_reference_number
                        transaction["yes_bank_reference_number"] = data[i].yes_bank_reference_number
                        transaction["user_id"] = data[i].user_id
                        transaction["blockchain_transaction_id"] = data[i].blockchain_transaction_id
                        if (data[i].transaction_type == "1") {
                            transaction["transaction_type"] = "credit";
                            // console.log("transaction",transaction)
                        } else if (data[i].transaction_type == "0") {
                            transaction["transaction_type"] = "Debit"
                            // console.log("transaction",transaction)
                        } else {
                            transaction["transaction_type"] = "Debit"

                        }
                        transaction["status"] = data[i].status
                        value.push(transaction)
                        transaction = {};
                        //  for (let j = 0; j < value.length; j++) {
                        console.log("value", value)
                        console.log("transaction_type====>", value[i].transaction_type);
                        if (value[i].status == "COMPLETE") {
                            if (value[i].blockchain_transaction_id != null) {
                                var blockchain_transaction_id = value[i].blockchain_transaction_id

                                // console.log("entering", blockchain_transaction_id)
                                var blockchainresult = await readtransactionhistory.getTransactionDetails(blockchain_transaction_id)
                                console.log("result", blockchainresult.response.time)
                                console.log("", blockchainresult.response.addresses)
                                var address = blockchainresult.response.addresses
                                var fmt = blockchainresult.response.time
                                var dc = new Date(fmt * 1000)
                                var time = dc.toLocaleString()
                                console.log("time", time)
                                value[i].time = time
                                if (value[i].transaction_type == "credit") {

                                    var addressess = Object.keys(address)
                                    var amount = address[addressess[1]]
                                    var add = addressess[0]
                                    value[i].amount = amount
                                    console.log(" value[j].amount", value[i].amount)
                                    var sendadd = addressess[1]

                                    var getuseridinwallet = await walletDB.getValidWalletByaddress(sendadd)
                                    console.log("getuseridinwallet", getuseridinwallet.data[0].user_id)
                                    var username = await mysqlConnection.query_execute(query.findUsers, [getuseridinwallet.data[0].user_id])
                                    value[i].Receiver = username.data[0].name
                                    console.log("username", value[i].Receiver)
                                    // console.log("value[j]", value[j])
                                    var getsendidinwallet = await walletDB.getValidWalletByaddress(add)
                                    console.log("getsendidinwallet", getsendidinwallet.data[0].user_id)
                                    var sendname = await mysqlConnection.query_execute(query.findUsers, [getsendidinwallet.data[0].user_id])
                                    value[i].sender = sendname.data[0].name
                                    console.log("sendername", value[i].sender)
                                    record.push(value[i])
                                    console.log("value1", value)

                                } else if (value[i].transaction_type == "Debit") {
                                    console.log("checkvalueDebit")
                                    var addressess = Object.keys(address)
                                    var receiverad = addressess[0]
                                    var amount = address[addressess[1]]
                                    var add = addressess[1]
                                    value[i].amount = amount
                                    console.log(" value[j].amount", value[i].amount)

                                    var getuseridinwallet = await walletDB.getValidWalletByaddress(add)
                                    console.log("getuseridinwallet", getuseridinwallet.data[0].user_id)
                                    var username = await mysqlConnection.query_execute(query.findUsers, [getuseridinwallet.data[0].user_id])
                                    value[i].name = username.data[0].name
                                    console.log("username", value[i].name)
                                    var getreceiveradd = await walletDB.getValidWalletByaddress(receiverad)
                                    console.log("getreceiveradd", getreceiveradd.data[0].user_id)
                                    var recead = await mysqlConnection.query_execute(query.findUsers, [getreceiveradd.data[0].user_id])
                                    // console.log("value[j]", value[j])
                                    value[i].receiver = recead.data[0].name
                                    record.push(value[i])
                                    console.log("value2", value)
                                    // console.log("record2",record)
                                }
                            }
                        } else {
                            if (data[i].sender_id != null) {
                                var sender_id = data[i].sender_id
                                var id = [sender_id]
                                var userdata = await mysqlConnection.query_execute(query.readuser, id)
                                //  console.log("checktransactionstatus",userdata.data[0].name)
                                value[i].sender = userdata.data[0].name
                            } else {
                                value[i].sender = ""
                            }
                            if (data[i].reciver_id != null) {
                                var id = [data[i].reciver_id]
                                var beneficiary = await mysqlConnection.query_execute(query.readreceiver_id, id)
                                // console.log("beneficiary",beneficiary)
                                value[i].reciver = {
                                    "name": beneficiary.data[0].name,
                                    "type": beneficiary.data[0].name,
                                    "account_no": beneficiary.data[0].account_no
                                }

                            } else {
                                value[i].reciver = ""
                            }
                            record.push(value[i])
                        }

                    }
                    var slug = "transaction-detail-contact"
                    var contentdata = [user_language, slug]
                    var transactionContact = await mysqlConnection.query_execute(query.getcontent, contentdata)
                    console.log("transactionContact", transactionContact.data[0].language)
                    content.push({
                        "language": transactionContact.data[0].language,
                        "title": transactionContact.data[0].slug
                    })
                    console.log("value===>", record);

                    var getErrMsg = Utils.getErrorMessage(user_language, 'SUCCESS_TH0');
                    response = {
                        "statusReason": "OK",
                        "code": getErrMsg.code,
                        "message": getErrMsg.message,
                        "data": {
                            "status_popupmessage_type": "",
                            "pagination": {
                                "next_page": next_page,
                                "page": page,
                                "transaction_detail_contact": content
                            },
                        },
                        "status_type": "",
                        "transactions": [{
                            record
                        }],
                        "isSuccessful": true,
                        "success": true,
                        "status": 200
                    }


                    return resolve(response);
                } else {
                   errorCode = "ERROR_EA02"
                    throw new Error("data was not there")

                }

            } catch (err) {
                console.log("err",err)
                
                var getErrMsg = Utils.getErrorMessage(user_language, errorCode);
                console.log("getErrMsg",getErrMsg,user_language)
                response = {
                    "data": {
                        "code": getErrMsg.code,
                        "message": getErrMsg.message,
                        "status_popupmessage_type": "",
                        "status_type": "",
                    },
                    "success": false,
                    "status": 200
                }
                resolve(response);
            }
            
            })
        
    })
}