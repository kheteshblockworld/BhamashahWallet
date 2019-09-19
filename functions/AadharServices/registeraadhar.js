/**
 * @author: Harinishree
 * @version: 1.0.0
 * @date: October20, 2018
 * @Description: AAdharservice.
 */

'use strict';
const mysqlConnection = require('../../mysql_connection/query_execute');
const query = require('../../mysql_connection/quiries');
const checksumgeneration = require('../../util/generateChecksum');
const walletDB = require('../DBFunctions/WalletDB')
const UsersDB = require('../DBFunctions/UsersDB')
var config = require('config');
var yesbank = config.get('yesbankservices');
var request = require('request-promise');
var format = require('date-format');
var Utils = require('../../util/utils')
const blockdata = require('../../sdk/invoke');
var DBConfig = require('../../mysql_connection/query_execute');
const yesBankServices = require('../YesBankServices/yesBankServices');
module.exports = {
    registeraadhar: registeraadhar,
    aadharotp: aadharotp
}

async function registeraadhar(user_id, value) {
    return new Promise(async (resolve, reject) => {
        var response = {}
        var errorCode = "ERROR_EA02"
        var connection = await DBConfig.getConnection()
        console.log(connection.threadId)
        await connection.beginTransaction()
        var params = [user_id]
        console.log("value123", value)
        var user_language = value.user_language
        var action = "REGAADHAAR"
        var p1, p2, p3, p4, p5, checksum;
        p2 = value.aadhar_no;
        p3 = value.auth_token;
        p4 = "Y",
            p5 = "Authentication"
        var PSK_secrect_key = yesbank.PskSecretKey;
        var wlap_code = yesbank.wlapCode;
        var wlap_secret_key = yesbank.wlapSecretKey;


        mysqlConnection.query_execute(query.getWalletBYID, params).then(async function (result, error) {
            try {
                console.log("result", result)
                console.log(result.data[0].wallet_mobile)
                p1 = result.data[0].wallet_mobile;
                var value = {
                    PSK_secrect_key: PSK_secrect_key,
                    wlap_code: wlap_code,
                    wlap_secret_key: wlap_secret_key,
                    p1: p1,
                    p2: p2,
                    p3: p3,
                    p4: p4,
                    p5: p5
                }
                var request = await yesBankServices.aadharservice(value)
                console.log("body1234", request);


                if (request.message.status_code != "") {
                    var getErrMsg = Utils.getErrorMessage(user_language, request.message.status_code + "_" + request.message.code);
                    if (request.message.status_code == "ERROR") {
                        getErrMsg.message = request.message
                        errorCode = request.message.status_code + "_" + request.message.code
                        console.log("errorCode", errorCode)
                        throw new Error("Error on register aadhar")

                    } else {
                        var aadhaar_id = p2;
                        var updatewallet = [aadhaar_id, user_id]

                        if (request.message.status_code == "SUCCESS" && request.message.code == "M01") {
                            var updateaadhar = await walletDB.updatewalletaadhar(updatewallet, connection)
                            console.log("updateaadhar", updateaadhar)
                            var kyc_status = "AADHAAR_KYC"
                            var updatekyc_status = [kyc_status, user_id]
                            var dataupdate = await walletDB.updatestatus(updatekyc_status, connection)
                            console.log("dataupdate", dataupdate)
                            if (dataupdate.data.affectedRows == 0) {
                                // return resolve({
                                //     "status": 401,
                                //     "message": "Error while updating data in database"
                                // })

                                throw new Error("Error while updating data in database")
                            } else {
                                connection.commit()
                                var getErrMsg = Utils.getErrorMessage(user_language, request.message.status_code + "_" + request.message.code);
                                response = {
                                    "statusReason": "OK",
                                    "data": {
                                        code: getErrMsg.code,
                                        status_code: getErrMsg.status_code,
                                        message: getErrMsg.message,
                                        transaction_id: request.message.transaction_id,
                                        otp_trans_id: request.message.otp_trans_id
                                    },
                                    "isSuccessful": true,
                                    "success": true,
                                    "status": 200

                                }
                                return resolve(response)

                            }

                        }
                    }

                } else {
                    errorCode = "ERROR_EA02"
                    throw new Error("error on curl REGAADHAAR")
                }



                // .catch(function(error) {
                //     return reject({
                //         "message": error
                //     })
                // })
            } catch (err) {
                console.log("err", err)
                connection.rollback()
                var getErrMsg = Utils.getErrorMessage(user_language, errorCode);
                console.log("getErrMsg", getErrMsg)
                response = {
                    'success': false,
                    'status': 200,
                    'data': {
                        'code': getErrMsg.code,
                        'message': getErrMsg.message,
                        'status_type': '',
                        'status_popupmessage_type': ''
                    },
                }
                return resolve(response)
            }
        })

    })

}


async function aadharotp(user_id, data) {
    return new Promise(async (resolve, reject) => {
        var response = {}
        var connection = await DBConfig.getConnection()
        console.log(connection.threadId)
        await connection.beginTransaction()
        var walletuser = [user_id]
        console.log("value123", data)
        var user_language = data.user_language
        var errorCode = "ERROR_EA02"
        var p1, p2, p3, p4, p5, p6, p7, checksum;
        p3 = data.transaction_id;
        p4 = data.otp;
        p5 = data.otp_transaction_id;
        p6 = "Y";
        p7 = "Authentication";


        mysqlConnection.query_execute(query.getWalletBYID, walletuser).then(async function (result, error) {
            try {
                console.log("result123", result)
                console.log(result.data[0].wallet_mobile)
                p1 = result.data[0].wallet_mobile;
                p2 = result.data[0].aadhaar_id;
                console.log("p1,p2", p1, p2)
                var value = {
                    p1: p1,
                    p2: p2,
                    p3: p3,
                    p4: p4,
                    p5: p5,
                    p6: p6,
                    p7: p7
                }
                var data = await yesBankServices.aadharotp(value)
                console.log("result12345", data)
                if (data.message.status_code != "") {
                    var getErrMsg = Utils.getErrorMessage(user_language, data.message.status_code + "_" + data.message.code);
                    if (data.message.status_code == "ERROR") {
                        getErrMsg.message = data.message
                        errorCode = data.message.status_code + "_" + data.message.code
                        console.log("errorCode", errorCode)
                        throw new Error("Error on verifying aadhar otp")

                    }
                    if (data.message.status_code = "SUCCESS") {
                        // var body = {
                        //     code: "M03",
                        //     status_code: "SUCCESS",
                        //     mobile_number: "7708863499",
                        //     message: "Aadhaar number validated successfully",
                        //     name: "Rakesh C",
                        //     DOB: "1993-12-10T00:00:00.000+05:30",
                        //     gender: "male",
                        //     address: "1/244, RAJA STREET, NATRAMPALLI, AMMANAGKOIL, -, Ammanangkoil, Vellore, Tamil Nadu, 635651",
                        //     wallet_status: "active"
                        // }
                        var wallet_info = {
                            "wallet_present": false,
                            "aadhaar_id": "",
                            "mobile": "",
                            "balance": "",
                        }
                        console.log("wallet_info", wallet_info)
                        var checkstatus = await walletDB.getWalletBYID(walletuser)
                        console.log("checkstatus", checkstatus.data[0].kyc_status)
                        var kyc_status = checkstatus.data[0].kyc_status
                        if (kyc_status == "AADHAAR_KYC" || kyc_status == "FULL_KYC") {

                            var wallet_info = {
                                "wallet_present": true,
                                "aadhaar_id": checkstatus.data[0].aadhaar_id,
                                "mobile": checkstatus.data[0].wallet_mobile,
                                "balance": checkstatus.data[0].wallet_balance,
                            }
                            console.log("walletinfo", wallet_info)
                            var id = [user_id]
                            console.log("id", id)
                            var dob, gender, address
                            var userupdate = await UsersDB.readusersid(id)
                            console.log("userupdate", userupdate.data[0].id)
                            console.log("userupdate", userupdate)
                            if (userupdate.data[0].id !== 0) {
                                var id = user_id
                                console.log("dob1234", id)
                                dob = data.message.DOB ? format('yyyy-MM-dd hh:mm:ss', new Date(data.message.DOB)) : null;
                                console.log("dob1234", dob)
                                gender = data.message.gender ? data.message.gender : null;
                                address = data.message.address ? data.message.address : null
                                var values = [dob, gender, address, id]
                                var userupdatevalue = await UsersDB.updateuserdata(values, connection)
                                console.log("userupdatevalue", userupdatevalue)
                                if (userupdatevalue.data.affectedRows == 0) {
                                    errorCode = "ERROR_EA02"
                                    throw new Error("Error while updating database")
                                } else {
                                    var updatebcsdk = await UsersDB.readusersid(id)
                                    console.log("updatebcsdk", updatebcsdk)
                                    var key = updatebcsdk.data[0].blockchian_key
                                    console.log("key", key)
                                    var value = {
                                        "id": updatebcsdk.data[0].id,
                                        "sso_id": updatebcsdk.data[0].sso_id,
                                        "name": updatebcsdk.data[0].name,
                                        "sso_mobile": updatebcsdk.data[0].sso_mobile,
                                        "email": updatebcsdk.data[0].email,
                                        "bhamashah_id": updatebcsdk.data[0].bhamashah_id,
                                        "bhamashah_mid": updatebcsdk.data[0].bhamashah_id,
                                        "adhar_id": updatebcsdk.data[0].adhar_id,
                                        "dob": updatebcsdk.data[0].dob,
                                        "gender": updatebcsdk.data[0].gender,
                                        "address": updatebcsdk.data[0].address,
                                        "language": updatebcsdk.data[0].language,
                                        "status": updatebcsdk.data[0].status,
                                        "date_created": updatebcsdk.data[0].date_created
                                    }


                                    console.log("value", value)


                                    var params = {
                                        "key": key,
                                        "value": value
                                    }
                                    var bcstore = await blockdata.addDataWithOutArrayList(params)
                                    console.log("blockchain", bcstore)
                                    if (bcstore.status != 200) {
                                        errorCode = "ERROR_EA02"
                                        throw new Error("Error while storing blockchain")
                                    } else {
                                        kyc_status == "AADHAAR_KYC"
                                        var status = "ACTIVE"
                                        var stat = [kyc_status, status, user_id]
                                        var updatewalletstatus = await walletDB.updatewalletstatusactive(stat, connection)
                                        console.log("updatewalletstatus", updatewalletstatus)

                                        if (updatewalletstatus.data.affectedRows == 0) {
                                            connection.rollback()
                                            errorCode = "ERROR_EA02"
                                            throw new Error("Error in verifyAadhaarOtp")
                                        } else {
                                            connection.commit()
                                            errorCode = "SUCCESS_M03"
                                            var getErrMsg = Utils.getErrorMessage(user_language, data.message.status_code + "_" + data.message.code);
                                            var detail = {
                                                "code": getErrMsg.code,
                                                "message": getErrMsg.message,
                                                "wallet_status": kyc_status,
                                                "wallet_present": wallet_info.wallet_present,
                                                "wallet_mobile": wallet_info.mobile,
                                                "wallet_balance": wallet_info.balance,
                                                "wallet_aadhaar_id": wallet_info.aadhaar_id
                                            }
                                            response = {

                                                "statusReason": "OK",
                                                "data": detail,
                                                "isSuccessful": true,
                                                "success": true,
                                                "status": 200
                                            }
                                            return resolve(response)
                                        }

                                    }

                                }
                            }
                        }

                    }

                } else {
                    errorCode = "ERROR_EA02"
                    throw new Error("Error in verifyAadhaarOtp.")
                }

            } catch (err) {
                console.log("err", err)
                connection.rollback()
                var getErrMsg = Utils.getErrorMessage(user_language, errorCode);
                console.log("getErrMsg", getErrMsg)
                response = {
                    'success': false,
                    'status': 200,
                    'Error': {
                        'code': getErrMsg.code,
                        'message': getErrMsg.message,
                        'status_type': '',
                        'status_popupmessage_type': ''
                    },
                };
                return resolve(response)
            }

        })

    })

}