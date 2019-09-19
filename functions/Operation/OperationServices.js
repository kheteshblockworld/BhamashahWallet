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
const UserDB = require('../../functions/DBFunctions/UsersDB')
const BeneficiaryDB = require('../../functions/DBFunctions/BeneficiaryDB')

var uniqid = require('uniqid');
const Utils = require('../../util/utils')
const invokeSDK = require('../../sdk/invoke')
const querySDK = require('../../sdk/query')
var dateFormat = require('dateformat');
var DBConfig = require('../../mysql_connection/query_execute')

module.exports = {
    addBeneficiary: addBeneficiary,
    fetchBeneficiary: fetchBeneficiary,
    deleteBeneficiary: deleteBeneficiary,
    listBeneficiary: listBeneficiary,
    addOwnBankAccount: addOwnBankAccount,
    verifyBankAccount: verifyBankAccount,
    modifyOwnBankAccount: modifyOwnBankAccount
}

var yesBankServices = {
    "pskSecretKey": "69f2acc6f0cc52b981eaf06813f9fba3",
    "wlapCode": "bhamasha",
    "wlapSecretKey": "bhamasha123",
    "yesQAUrl": "http://ybl2.sodelsolutions.com/white_labeled_partners/white_labeled_wallet_v2.json"
};



function addBeneficiary(req) {
    return new Promise(async (resolve, reject) => {
        var user = req.user;
        var lang = req.lang;
        var beneficiaryName = req.beneficiary_name;
        var identifierType = req.identifier_type;
        var accountNumber = req.account_number;
        var ifscCode = req.ifsc_code;
        var mobileNumber = req.mobile_no;
        var email = req.email;
        var connection = await DBConfig.getConnection()
        console.log(connection.threadId)
        await connection.beginTransaction()
        var errorCode = 'ERROR_EA02';
        var response;
        try {
            var users = await UserDB.getUserById(user.user_id)
            var ifsccode = await BeneficiaryDB.findifsc(ifscCode)
            var wallet = await BeneficiaryDB.getWalletByID(user.user_id)
            if (users == false) {
                errorCode = 'ERROR_1';
                throw new Error("User not found")

            } else if (identifierType !== 'mobile' && ifsccode == false) {
                errorCode = 'ERROR_EA18';
                throw new Error("Incorrect IFS Code.")

            } else if (identifierType == 'mobile' && accountNumber == wallet.wallet_mobile) {
                errorCode = 'ERROR_EA23';
                throw new Error("Can not add yourself as Payee.")

            } else {
                var beneficiaryArr = [user.user_id, identifierType, accountNumber, ifscCode];

                var result = await UserDB.getBeneficiary(beneficiaryArr)
                console.log(result)
                if (result !== false) {
                    if (result.data.length == 0) {

                        /*
                         * p1 - Mobile Number
                         * p2 - Beneficiary Name
                         * p3 - Identifier Type
                         * p4 - Account Number
                         * p5 - IFSC Code
                         */
                        var params = {
                            "p1": wallet.wallet_mobile,
                            "p2": beneficiaryName,
                            "p3": identifierType,
                            "p4": accountNumber,
                            "p5": ifscCode,
                        }
                        yesBankServicesFun.addBeneficiary(params, async function(yesBankResponse, error) {

                            try {

                                console.log(yesBankResponse)
                                if (error) {
                                    throw new Error("Something went wrong, try again.")

                                } else {

                                    if (yesBankResponse.status == 200 && yesBankResponse.message.status_code == "SUCCESS") {

                                        var status = transcationType.STATUS_ACTIVE;
                                        var date_created = dateFormat("yyyy-mm-dd HH:MM:ss");
                                        var date_last_edit = dateFormat("yyyy-mm-dd HH:MM:ss");
                                        var insertParams = [
                                            yesBankResponse.message.beneficiary_id,
                                            user.user_id,
                                            beneficiaryName,
                                            identifierType,
                                            accountNumber,
                                            ifscCode,
                                            email,
                                            status,
                                            mobileNumber,
                                            date_created,
                                            date_last_edit
                                        ]

                                        mysqlConnection.insert_query(query.addNewBeneficiary, insertParams, connection).then(function(result) {
                                            console.log(result)
                                        try{
                                            if (result.status == 200) {
                                               
                                                // ================================multichain=========================== 
                                                var key = yesBankResponse.message.beneficiary_id + "_" + users.blockchain_key + "_Beneficiary"
                                                var value = {};
                                                var input = {};
                                                value.beneficiary_id = yesBankResponse.message.beneficiary_id;
                                                value.user_id = user.user_id;
                                                value.name = beneficiaryName;
                                                value.type = identifierType;
                                                value.account_no = accountNumber;
                                                value.ifsc_code = ifscCode;
                                                value.email = email;
                                                value.status = status;
                                                value.mobile_no = mobileNumber;
                                                value.date_created = date_created;
                                                value.date_last_edit = date_last_edit;
                                                input.data = value;
                                                input.meta = {
                                                    'submittedOn': new Date()
                                                }
                                                multichainAddData.addData(key, input).then(async function(result) {
                                                    try {
                                                        if (result.status === 200) {
                                                            var finalObj = {
                                                                "statusReason": "OK",
                                                                "data": {
                                                                    "code": yesBankResponse.message.code,
                                                                    "message": yesBankResponse.message.message,
                                                                    'status_type': '',
                                                                    'status_popupmessage_type': '',
                                                                    "beneficiary_id": yesBankResponse.message.beneficiary_id
                                                                },
                                                                "isSuccessful": true,
                                                                "success": true,
                                                                "statusCode": 200
                                                            }
                                                            await connection.commit();
                                                            return resolve(finalObj)
                                                            
                                                        } else {
                
                                                            errorCode = "ERROR_MULTICHAIN"
                                                            throw new Error(result.message) 
                
                                                        }
                                                    } catch (err) {
                                                        console.error(err)
                                                        var errMess = Utils.getErrorMessage(lang, errorCode)
                                                        if (errMess == false) {
                                                            var getErrMsg = {};
                                                            getErrMsg.code = errorCode;
                                                            getErrMsg.message = err.message;
                                                        } else {
                                                            var getErrMsg = Utils.getErrorMessage(lang, errorCode)
                                                        }
                                                        response = {
                                                            'success': false,
                                                            'statusCode': 200,
                                                            'data': {
                                                                'code': getErrMsg.code,
                                                                'message': getErrMsg.message,
                                                                'status_type': '',
                                                                'status_popupmessage_type': ''
                                                            },
                                                        };
                                                        await connection.rollback()
                                                        return resolve(response)
                                                        
                                                    }
                
                                                })


                                                //============================end ===================================


                                            } else {
                                                throw new Error("error on saving beneficiary detail in database")
                                            }
                                        } catch (err) {
                                            console.error(err)
                                            var errMess = Utils.getErrorMessage(lang, errorCode)
                                            if (errMess == false) {
                                                var getErrMsg = {};
                                                getErrMsg.code = errorCode;
                                                getErrMsg.message = err.message;
                                            } else {
                                                var getErrMsg = Utils.getErrorMessage(lang, errorCode)
                                            }
                                            response = {
                                                'success': false,
                                                'statusCode': 200,
                                                'data': {
                                                    'code': getErrMsg.code,
                                                    'message': getErrMsg.message,
                                                    'status_type': '',
                                                    'status_popupmessage_type': ''
                                                },
                                            };
                                         
                                            return resolve(response)
                                            
                                        }
                                        })
                                    } else if (yesBankResponse.status == 200 && yesBankResponse.message.status_code == "ERROR") {

                                        errorCode = yesBankResponse.message.status_code + "_" + yesBankResponse.message.code;
                                        throw new Error(yesBankResponse.message.message)

                                    } else {

                                        throw new Error("Something went wrong, try again.")

                                    }
                                }
                            } catch (err) {
                                console.error(err)
                                var errMess = Utils.getErrorMessage(lang, errorCode)
                                if (errMess == false) {
                                    var getErrMsg = {};
                                    getErrMsg.code = errorCode;
                                    getErrMsg.message = err.message;
                                } else {
                                    var getErrMsg = Utils.getErrorMessage(lang, errorCode)
                                }
                                response = {
                                    'success': false,
                                    'statusCode': 200,
                                    'data': {
                                        'code': getErrMsg.code,
                                        'message': getErrMsg.message,
                                        'status_type': '',
                                        'status_popupmessage_type': ''
                                    },
                                };
                             
                                return resolve(response)
                            }
                         
                        });

                    } else {
                        var beneficiary = result.data[0];
                        if (beneficiary.status == transcationType.STATUS_DELETED) {
                            beneficiary.status = transcationType.STATUS_ACTIVE;
                            beneficiary.mobile_no = mobileNumber;
                            beneficiary.email = email;
                            var updateParams = [
                                beneficiary.status,
                                beneficiary.mobile_no,
                                beneficiary.email,
                                beneficiary.beneficiary_id,
                            ]
                            mysqlConnection.query_execute(query.updateBeneficiary, updateParams,connection).then(async function(result) {
                                console.log(result)
                           try{
                            if(result.status == 200){


                                // ================================multichain=========================== 
                                var key = beneficiary.beneficiary_id + "_" + users.blockchain_key + "_Beneficiary";
                                var value = {};
                                var input = {};

                                value.beneficiary_id = beneficiary.beneficiary_id;
                                value.user_id = beneficiary.user_id;
                                value.name = beneficiary.name;
                                value.type = beneficiary.type;
                                value.account_no = beneficiary.account_no;
                                value.ifsc_code = beneficiary.ifsc_code;
                                value.email = email;
                                value.status = transcationType.STATUS_ACTIVE;
                                value.mobile_no = mobileNumber;
                                value.date_created = beneficiary.date_created;
                                value.date_last_edit = beneficiary.date_last_edit;
                                input.data = value;
                                input.meta = {
                                    'submittedOn': new Date()
                                }

                                multichainAddData.addData(key, input).then(async function(result) {
                                    try {
                                        if (result.status === 200) {
                                            var getErrMsg = Utils.getErrorMessage(lang, "SUCCESS_BE00")
                                            var finalObj = {
                                                "statusReason": "OK",
                                                "data": {
                                                    "code": getErrMsg.code,
                                                    "message": getErrMsg.message,
                                                    'status_type': '',
                                                    'status_popupmessage_type': '',
                                                    "beneficiary_id": beneficiary.beneficiary_id
                                                },
                                                "isSuccessful": true,
                                                "success": true,
                                                "statusCode": 200
                                            }
                                            await connection.commit();
                                            return resolve(finalObj)
                                            
                                        } else {

                                            errorCode = "ERROR_MULTICHAIN"
                                            throw new Error(result.message) 

                                        }
                                    } catch (err) {
                                        console.error(err)
                                        var errMess = Utils.getErrorMessage(lang, errorCode)
                                        if (errMess == false) {
                                            var getErrMsg = {};
                                            getErrMsg.code = errorCode;
                                            getErrMsg.message = err.message;
                                        } else {
                                            var getErrMsg = Utils.getErrorMessage(lang, errorCode)
                                        }
                                        response = {
                                            'success': false,
                                            'statusCode': 200,
                                            'data': {
                                                'code': getErrMsg.code,
                                                'message': getErrMsg.message,
                                                'status_type': '',
                                                'status_popupmessage_type': ''
                                            },
                                        };
                                        await connection.rollback()
                                        return resolve(response)
                                        
                                    }

                                })

                            
                                //============================end ===================================
                            }else{
                                
                                throw new Error("Error in updating Beneficiary")  
                            }
                            
                            }catch(err) {
                                console.error(err)
                                var errMess = Utils.getErrorMessage(lang, errorCode)
                                if (errMess == false) {
                                    var getErrMsg = {};
                                    getErrMsg.code = errorCode;
                                    getErrMsg.message = err.message;
                                } else {
                                    var getErrMsg = Utils.getErrorMessage(lang, errorCode)
                                }
                                response = {
                                    'success': false,
                                    'statusCode': 200,
                                    'data': {
                                        'code': getErrMsg.code,
                                        'message': getErrMsg.message,
                                        'status_type': '',
                                        'status_popupmessage_type': ''
                                    },
                                };
                                
                                return resolve(response)
                            
                            }
                     
                             
                            })
                        } else {
                            errorCode = 'ERROR_BD03';
                            throw new Error("Beneficiary already added")

                        }
                    }
                } else {
                    throw new Error("Something went wrong, try again.")
                }

            }
        } catch (err) {
            console.error(err)
            var errMess = Utils.getErrorMessage(lang, errorCode)
            if (errMess == false) {
                var getErrMsg = {};
                getErrMsg.code = errorCode;
                getErrMsg.message = err.message;
            } else {
                var getErrMsg = Utils.getErrorMessage(lang, errorCode)
            }
            response = {
                'success': false,
                'statusCode': 200,
                'data': {
                    'code': getErrMsg.code,
                    'message': getErrMsg.message,
                    'status_type': '',
                    'status_popupmessage_type': ''
                },
            };
            
            return resolve(response)
        }
        await connection.close()   
    })

}

function fetchBeneficiary(req, callback) {
    var user = req.user;
    var lang = req.lang;
    var beneficiaryId = req.beneficiary_id;
    var errorCode = "ERROR_EA02";
    var response;
    var beneficiaryArr = [beneficiaryId, transcationType.STATUS_ACTIVE];
    mysqlConnection.query_execute(query.fetchBeneficiary, beneficiaryArr).then(function(result) {
        console.log(result)
        try {
            if (result.status == 200 && result.data.length !== 0) {
                var beneficiary = result.data[0];
                mysqlConnection.query_execute(query.findUsers, user.user_id).then(function(result) {
                    console.log(result)
                    try {
                        if (result.status == 200 && result.data.length !== 0) {
                            var users = result.data[0];
                            var key = beneficiaryId + "_" + users.blockchain_key + "_Beneficiary"
                            multichainReadData.readData(key).then(function(result) {
                                try {
                                    if (result.status == 200) {

                                        if(result.data.length !==0 && result.data[result.data.length - 1].data.status == "ACTIVE"){
                                            var benRes = result.data[result.data.length - 1].data;
                                            var finalObj = {
                                                "statusReason": "OK",
                                                "data": {
                                                    "ifsc_code": benRes.ifsc_code,
                                                    "beneficiary_name": benRes.name,
                                                    "beneficiary_id": benRes.beneficiary_id,
                                                    "status_popupmessage_type": "",
                                                    "account_type": benRes.type,
                                                    "code": 200,
                                                    "status_type": "",
                                                    "mobile": benRes.mobile_no,
                                                    "account_no": benRes.account_no,
                                                },
                                                "isSuccessful": true,
                                                "success": true,
                                                "statusCode": 200
                                            }
                                            callback(finalObj)
                                        }
                                       

                                    } else {

                                        errorCode = "ERROR_MULTICHAIN"
                                        throw new Error(result.message)
                                    }
                                } catch (err) {
                                    console.error(err)
                                    var errMess = Utils.getErrorMessage(lang, errorCode)
                                    if (errMess == false) {
                                        var getErrMsg = {};
                                        getErrMsg.code = errorCode;
                                        getErrMsg.message = err.message;
                                    } else {
                                        var getErrMsg = Utils.getErrorMessage(lang, errorCode)
                                    }
                                    response = {
                                        'success': false,
                                        'statusCode': 200,
                                        'data': {
                                            'code': getErrMsg.code,
                                            'message': getErrMsg.message,
                                            'status_type': '',
                                            'status_popupmessage_type': ''
                                        },
                                    };
                                    callback(response)
                                }
                            })
                        } else {
                            errorCode = "ERROR_R26"
                            throw new Error("User not found!")

                        }
                    } catch (err) {
                        console.error(err)
                        var errMess = Utils.getErrorMessage(lang, errorCode)
                        if (errMess == false) {
                            var getErrMsg = {};
                            getErrMsg.code = errorCode;
                            getErrMsg.message = err.message;
                        } else {
                            var getErrMsg = Utils.getErrorMessage(lang, errorCode)
                        }
                        response = {
                            'success': false,
                            'statusCode': 200,
                            'data': {
                                'code': getErrMsg.code,
                                'message': getErrMsg.message,
                                'status_type': '',
                                'status_popupmessage_type': ''
                            },
                        };
                        callback(response)
                    }
                })

            } else {

                errorCode = "ERROR_R26"
                throw new Error("User not found!")
            }
        } catch (err) {
            console.error(err)
            var errMess = Utils.getErrorMessage(lang, errorCode)
            if (errMess == false) {
                var getErrMsg = {};
                getErrMsg.code = errorCode;
                getErrMsg.message = err.message;
            } else {
                var getErrMsg = Utils.getErrorMessage(lang, errorCode)
            }
            response = {
                'success': false,
                'statusCode': 200,
                'data': {
                    'code': getErrMsg.code,
                    'message': getErrMsg.message,
                    'status_type': '',
                    'status_popupmessage_type': ''
                },
            };
            callback(response)
        }
    })
}

async function deleteBeneficiary(req, callback) {
    var user = req.user;
    var lang = req.lang;
    var beneficiaryId = req.beneficiary_id;
    var errorCode = "ERROR_EA02";
    var response;
    var connection = await DBConfig.getConnection()
    console.log(connection.threadId)
    await connection.beginTransaction()
    mysqlConnection.query_execute(query.findUsers, user.user_id).then(function(result) {
        console.log(result)
        try {
            if (result.status == 200 && result.data.length !== 0) {
                var users = result.data[0];

                var beneficiaryArr = [user.user_id, beneficiaryId];
                mysqlConnection.query_execute(query.getBeneficiaryByUserIDandBenID, beneficiaryArr).then(function(result) {
                    console.log(result)
                    try {
                        if (result.status == 200 && result.data.length !== 0 && result.data[0].status !== transcationType.STATUS_DELETED) {
                            var beneficiary = result.data[0];
                            beneficiary.status = transcationType.STATUS_DELETED;
                            var updateParams = [beneficiary.status, beneficiary.beneficiary_id, beneficiary.user_id]
                            mysqlConnection.query_execute(query.updateBeneficiaryStatus, updateParams, connection).then(function(result) {
                                console.log(result)
                                try {
                                    if (result.status == 200) {

                                        // ================================multichain=========================== 
                                        var key = beneficiary.beneficiary_id + "_" + users.blockchain_key + "_Beneficiary";
                                        var value = {};
                                        var input = {};

                                        value.beneficiary_id = beneficiary.beneficiary_id;
                                        value.user_id = beneficiary.user_id;
                                        value.name = beneficiary.name;
                                        value.type = beneficiary.type;
                                        value.account_no = beneficiary.account_no;
                                        value.ifsc_code = beneficiary.ifsc_code;
                                        value.email = beneficiary.email;
                                        value.status = transcationType.STATUS_DELETED;
                                        value.mobile_no = beneficiary.mobile_no;
                                        value.date_created = beneficiary.date_created;
                                        value.date_last_edit = beneficiary.date_last_edit;
                                        input.data = value;
                                        input.meta = {
                                            'submittedOn': new Date()
                                        }


                                        multichainAddData.addData(key, input).then(function(result) {
                                                console.log(result)
                                                try {
                                                    if (result.status === 200) {
                                                        
                                                        errorCode = "SUCCESS_BD00"
                                                        var getErrMsg = Utils.getErrorMessage(lang, errorCode)

                                                        var finalObj = {
                                                            "statusReason": "OK",
                                                            "data": {
                                                                "code": getErrMsg.code,
                                                                "status_popupmessage_type": "",
                                                                "status_type": "",
                                                                "message": getErrMsg.message
                                                            },
                                                            "isSuccessful": true,
                                                            "success": true,
                                                            "statusCode": 200
                                                        }
                                                        callback(finalObj)
                                                        connection.commit()
                                                    } else {

                                                        errorCode = "ERROR_MULTICHAIN"
                                                        throw new Error(result.message) 

                                                    }
                                                } catch (err) {
                                                    
                                                    console.error(err)
                                                    var errMess = Utils.getErrorMessage(lang, errorCode)
                                                    if (errMess == false) {
                                                        var getErrMsg = {};
                                                        getErrMsg.code = errorCode;
                                                        getErrMsg.message = err.message;
                                                    } else {
                                                        var getErrMsg = Utils.getErrorMessage(lang, errorCode)
                                                    }
                                                    response = {
                                                        'success': false,
                                                        'statusCode': 200,
                                                        'data': {
                                                            'code': getErrMsg.code,
                                                            'message': getErrMsg.message,
                                                            'status_type': '',
                                                            'status_popupmessage_type': ''
                                                        },
                                                    };
                                                    callback(response)
                                                    connection.rollback()
                                                    connection.close()
                                                }
                                            })

                                        //============================end ===================================




                                    } else {

                                        errorCode = "ERROR_BD01"
                                        throw new Error("No such beneficiary found.")


                                    }
                                } catch (err) {
                                    console.error(err)
                                    var errMess = Utils.getErrorMessage(lang, errorCode)
                                    if (errMess == false) {
                                        var getErrMsg = {};
                                        getErrMsg.code = errorCode;
                                        getErrMsg.message = err.message;
                                    } else {
                                        var getErrMsg = Utils.getErrorMessage(lang, errorCode)
                                    }
                                    response = {
                                        'success': false,
                                        'statusCode': 200,
                                        'data': {
                                            'code': getErrMsg.code,
                                            'message': getErrMsg.message,
                                            'status_type': '',
                                            'status_popupmessage_type': ''
                                        },
                                    };
                                    callback(response)
                                }

                            })
                        } else {
                            errorCode = "ERROR_BD01";
                            throw new Error("No such beneficiary found.")

                        }
                    } catch (err) {
                        console.error(err)
                        var errMess = Utils.getErrorMessage(lang, errorCode)
                        if (errMess == false) {
                            var getErrMsg = {};
                            getErrMsg.code = errorCode;
                            getErrMsg.message = err.message;
                        } else {
                            var getErrMsg = Utils.getErrorMessage(lang, errorCode)
                        }
                        response = {
                            'success': false,
                            'statusCode': 200,
                            'data': {
                                'code': getErrMsg.code,
                                'message': getErrMsg.message,
                                'status_type': '',
                                'status_popupmessage_type': ''
                            },
                        };
                        callback(response)
                    }
                })
            } else {
                errorCode = "ERROR_EA02";
                throw new Error("Something went wrong, try again.");


            }
        } catch (err) {
            
            console.error(err)
            var errMess = Utils.getErrorMessage(lang, errorCode);
            if (errMess == false) {
                var getErrMsg = {};
                getErrMsg.code = errorCode;
                getErrMsg.message = err.message;
            } else {
                var getErrMsg = Utils.getErrorMessage(lang, errorCode);
            }
            response = {
                'success': false,
                'statusCode': 200,
                'data': {
                    'code': getErrMsg.code,
                    'message': getErrMsg.message,
                    'status_type': '',
                    'status_popupmessage_type': ''
                },
            };
           
            callback(response)
        }
        connection.close()
    })
}

function listBeneficiary(req, callback) {
    var user = req.user;
    var lang = req.lang;
    var beneficiaryType = req.beneficiary_type;
    var errorCode = "ERROR_EA02";
    var response;
    var beneficiaryArr = [user.user_id, beneficiaryType];
    mysqlConnection.query_execute(query.getUserBeneficiaries, beneficiaryArr).then(function(result) {
        console.log(result)
        try {
            if (result.status == 200 && result.data.length !== 0) {
                var beneficiary = result.data;
                var activeBen = [];
                beneficiary.forEach(element => {
                    if (element.status == "ACTIVE") {
                        var newElement = {
                            "ifsc_code": element.ifsc_code,
                            "beneficiary_id": element.beneficiary_id,
                            "name": element.name,
                            "mobile_no": element.mobile_no,
                            "type": element.type,
                            "account_no": element.account_no
                        };
                        activeBen.push(newElement)
                    } else {
                        //do nothing
                    }
                });
                var finalObj = {
                    "statusReason": "OK",
                    "data": {
                        "status_popupmessage_type": "",
                        "status_type": "",
                        "beneficiary_list": activeBen
                    },
                    "isSuccessful": true,
                    "success": true,
                    "statusCode": 200
                }
                callback(finalObj)

            } else {

                errorCode = "ERROR_BD02";
                throw new Error("Beneficiaries list empty")

            }
        } catch (err) {
            console.error(err)
            var errMess = Utils.getErrorMessage(lang, errorCode)
            if (errMess == false) {
                var getErrMsg = {};
                getErrMsg.code = errorCode;
                getErrMsg.message = err.message;
            } else {
                var getErrMsg = Utils.getErrorMessage(lang, errorCode)
            }
            response = {
                'success': false,
                'statusCode': 200,
                'data': {
                    'code': getErrMsg.code,
                    'message': getErrMsg.message,
                    'status_type': '',
                    'status_popupmessage_type': ''
                },
            };
            callback(response)
        }
    })
}

async function addOwnBankAccount(req, callback) {
    var user = req.user;
    var lang = req.lang;
    var accountNumber = req.account_no;
    var ifscCode = req.ifsc_code;
    var connection = await DBConfig.getConnection()
    console.log(connection.threadId)
    await connection.beginTransaction()
    var errorCode = "ERROR_EA02";
    var response;
    try{
        var users = await UserDB.getUserById(user.user_id,connection)
        var wallet = await BeneficiaryDB.getWalletByID(user.user_id,connection) 
        
        if (users == false) {
            errorCode = 'ERROR_1';
            throw new Error("User not found")
        }
        else if(wallet == false){
            errorCode = "ERROR_2";
            throw new Error("User wallet not found")
        }
        else{
            /*
            * p1 - Mobile Number
            * p2 - Account Number
            * p3 - IFSC Code
            */
            var params = {
                "p1": wallet.wallet_mobile,
                "p2": accountNumber,
                "p3": ifscCode,
            }
            yesBankServicesFun.addOwnBankAccount(params,async function (yesBankResponse, error) {
                try{
                    console.log(yesBankResponse)
                    if (error) {
                        throw new Error( "Something went wrong, try again.")  
                    } else{
                        if (yesBankResponse.status == 200 && yesBankResponse.message.status_code == "SUCCESS" && yesBankResponse.message.code == "00") {
                            mysqlConnection.query_execute(query.findUserBankAccount, user.user_id,connection).then(async function (accountDetails,error) {
                                console.log(accountDetails)
                                try{ 
                                if (error) {
                                    throw new Error( "error on finding user bank account")  
                                }
                                else{
                                    var accountObj = {
                                        'user_id': user.user_id,
                                        'account_no': accountNumber,
                                        'ifsc_code': ifscCode,
                                        'is_verified': transcationType.ACCOUNT_NOTVERIFIED,
                                        'account_validation_id': yesBankResponse.message.account_validation_reference,
                                        'account_created_at': dateFormat("yyyy-mm-dd HH:MM:ss"),
                                        'account_verified_at': null,
                                        'created_at': dateFormat("yyyy-mm-dd HH:MM:ss"),
                                        'updated_at': null
                                    }
                                    
                                    var account = [
                                        accountObj.user_id,
                                        accountObj.account_no,
                                        accountObj.ifsc_code,
                                        accountObj.is_verified,
                                        accountObj.account_validation_id,
                                        accountObj.account_created_at,
                                        accountObj.account_verified_at,
                                        accountObj.created_at,
                                        accountObj.updated_at
                                    ]

                                    if (accountDetails.status == 200 && accountDetails.data.length == 0) {
                                        mysqlConnection.insert_query(query.addNewAccount, account,connection).then(async function (result, error) {
                                            try{
                                                console.log(result)
                                                if (error) {
                                                    throw new Error( "error on inserting user account into database")  
                                                }
                                            }catch (err) {
                                                await connection.rollback();
                                                console.error(err)
                                                var errMess = Utils.getErrorMessage(lang, errorCode)
                                                if(errMess == false){
                                                    var getErrMsg={};
                                                    getErrMsg.code= errorCode;
                                                    getErrMsg.message = err.message;
                                                }else{
                                                    var getErrMsg = Utils.getErrorMessage(lang, errorCode)
                                                }
                                                response = {
                                                    'success': false,
                                                    'statusCode': 200,
                                                    'data': {
                                                        'code': getErrMsg.code,
                                                        'message': getErrMsg.message,
                                                        'status_type': '',
                                                        'status_popupmessage_type': ''
                                                    },
                                                };
                                                callback(response)
                                                await connection.end()
                                            } 
                                            // callback(response)
                                            // await connection.close() 
                                            })
                                        }
                                    else {
                                        mysqlConnection.query_execute(query.updateAccount,account,connection).then(async function(updateResult, error){
                                            console.log(updateResult)
                                            try{
                                                if(error){
                                                    throw new Error("error in updating user account details")
                                                }
                                                else{
                                                    console.log("User account updated successfully")
                                                }
                                            }catch (err) {
                                                await connection.rollback();
                                                console.error(err)
                                                var errMess = Utils.getErrorMessage(lang, errorCode)
                                                if(errMess == false){
                                                    var getErrMsg={};
                                                    getErrMsg.code= errorCode;
                                                    getErrMsg.message = err.message;
                                                }else{
                                                    var getErrMsg = Utils.getErrorMessage(lang, errorCode)
                                                }
                                                response = {
                                                    'success': false,
                                                    'statusCode': 200,
                                                    'data': {
                                                        'code': getErrMsg.code,
                                                        'message': getErrMsg.message,
                                                        'status_type': '',
                                                        'status_popupmessage_type': ''
                                                    },
                                                };
                                                callback(response)
                                                await connection.end()
                                            } 
                                            // callback(response)
                                            // await connection.close()
                                        })
                                    }

                                        wallet.wallet_balance = wallet.wallet_balance - 5.00;
                                        var walletArr = [
                                            wallet.wallet_balance,
                                            user.user_id
                                        ]
                                        // ================================multichain=========================== 
                                        var key = yesBankResponse.message.account_validation_reference + "_" + users.blockchain_key + "_UserBankAccount";
                                        var value = accountObj
                                        var input = {};
                                        input.data = value;
                                        input.meta = {
                                            'submittedOn': new Date()
                                        }
                                        multichainAddData.addData(key, input).then(async function (result) {
                                        try{
                                            console.log(result)
                                            if (result.response == "record already exist!") {
                                                errorCode = 'ERROR_MULTICHAIN_01';
                                                throw new Error( "Record already exist!") 
                                                // response = {
                                                //     'success': false,
                                                //     'error': {
                                                //         'code': "401",
                                                //         'message': "record already exist!",
                                                //         'status_type': '',
                                                //         'status_popupmessage_type': ''
                                                //     },
                                                //     "statusCode": 200
                                                // };
                                                // callback(response)
                                            }
                                            else {
                                                mysqlConnection.query_execute(query.updateWalletBalance, walletArr,connection).then(async function (result, error) {
                                                    try{
                                                    console.log(result)
                                                    if (error) {
                                                        throw new Error("error in updating wallet balance in database") ; 
                                                    }
                                                    else {
                                                        // if (result.status == 200) {
                                                        // $suc = ErrorMessage::getMessage('SUCCESS_AA00', $lang);
                                                        await connection.commit()
                                                        response = {
                                                            "statusReason": "OK",
                                                            "isSuccessful": true,
                                                            "success": true,
                                                            "data": {
                                                                "code": yesBankResponse.message.code,
                                                                "message": yesBankResponse.message.message,
                                                                "status_type": "",
                                                                "status_popupmessage_type": ""

                                                            },
                                                            "statusCode": 200
                                                        }
                                                        callback(response)
                                                        await connection.end()
                                                      }
                                                    }catch (err) {
                                                        await connection.rollback()
                                                        console.error(err)
                                                        var errMess = Utils.getErrorMessage(lang, errorCode)
                                                        if(errMess == false){
                                                            var getErrMsg={};
                                                            getErrMsg.code= errorCode;
                                                            getErrMsg.message = err.message;
                                                        }else{
                                                            var getErrMsg = Utils.getErrorMessage(lang, errorCode)
                                                        }
                                                        response = {
                                                            'success': false,
                                                            'statusCode': 200,
                                                            'data': {
                                                                'code': getErrMsg.code,
                                                                'message': getErrMsg.message,
                                                                'status_type': '',
                                                                'status_popupmessage_type': ''
                                                            },
                                                        };
                                                        callback(response)
                                                        await connection.end()
                                                        }
                                                        // callback(response)

                                                        // await connection.close()

                                                })
                                            }
                                                
                                        }catch (err) {
                                            await connection.rollback();
                                            console.error(err)
                                            var errMess = Utils.getErrorMessage(lang, errorCode)
                                            if(errMess == false){
                                                var getErrMsg={};
                                                getErrMsg.code= errorCode;
                                                getErrMsg.message = err.message;
                                            }else{
                                                var getErrMsg = Utils.getErrorMessage(lang, errorCode)
                                            }
                                            response = {
                                                'success': false,
                                                'statusCode': 200,
                                                'data': {
                                                    'code': getErrMsg.code,
                                                    'message': getErrMsg.message,
                                                    'status_type': '',
                                                    'status_popupmessage_type': ''
                                                },
                                            };
                                            callback(response)
                                            await connection.end()
                                            } 
                                            // callback(response)

                                            // await connection.close()
                                        })

                                    
                                            
                                        }
                                    
                                }catch (err) {
                                    await connection.rollback();
                                    console.error(err)
                                    var errMess = Utils.getErrorMessage(lang, errorCode)
                                    if(errMess == false){
                                        var getErrMsg={};
                                        getErrMsg.code= errorCode;
                                        getErrMsg.message = err.message;
                                    }else{
                                        var getErrMsg = Utils.getErrorMessage(lang, errorCode)
                                    }
                                    response = {
                                        'success': false,
                                        'statusCode': 200,
                                        'data': {
                                            'code': getErrMsg.code,
                                            'message': getErrMsg.message,
                                            'status_type': '',
                                            'status_popupmessage_type': ''
                                        },
                                    };
                                    callback(response)
                                    await connection.end()
                                    }  
                                    // callback(response)
                                // await connection.close()
                            })
                        }
                        else if (yesBankResponse.status == 200 && yesBankResponse.message.status_code == "ERROR") {
                            errorCode = yesBankResponse.message.status_code+"_"+yesBankResponse.message.code;
                            throw new Error( yesBankResponse.message.message) 
                        }
                        else{
                            throw new Error("error on curl addOwnBankAccount")
                        }
                    }

                }catch (err) {
                    await connection.rollback();
                    console.error(err)
                    var errMess = Utils.getErrorMessage(lang, errorCode)
                    if(errMess == false){
                        var getErrMsg={};
                        getErrMsg.code= errorCode;
                        getErrMsg.message = err.message;
                    }else{
                        var getErrMsg = Utils.getErrorMessage(lang, errorCode)
                    }
                    response = {
                        'success': false,
                        'statusCode': 200,
                        'data': {
                            'code': getErrMsg.code,
                            'message': getErrMsg.message,
                            'status_type': '',
                            'status_popupmessage_type': ''
                        },
                    };
                    callback(response)
                    await connection.end()          
                      }  
                // await connection.close()
            })  
        }
    }catch (err) {
        await connection.rollback();
        console.error(err)
        var getErrMsg = Utils.getErrorMessage(lang, errorCode)
        if(getErrMsg == false){
            getErrMsg.code= errorCode;
            getErrMsg.message = err;
        }
        response = {
            'success': false,
            'statusCode': 200,
            'data': {
                'code': getErrMsg.code,
                'message': getErrMsg.message,
                'status_type': '',
                'status_popupmessage_type': ''
            },
        };
        callback(response)
        await connection.close()
    }  
}

async function verifyBankAccount(req, callback) {
    var errorCode = 'ERROR_EA02';
    var response;
    var user = req.user;
    var lang = req.lang;
    var amount = req.amount
    var connection = await DBConfig.getConnection()
    console.log(connection.threadId)
    await connection.beginTransaction()
    try{
        var users = await UserDB.getUserById(user.user_id)
        var wallet = await BeneficiaryDB.getWalletByID(user.user_id) 
        
        if (users == false) {
            errorCode = 'ERROR_1';
            throw new Error("User not found")
        }
        else if(wallet == false){
            errorCode = "ERROR_2";
            throw new Error("User wallet not found")
        }
        else{
            mysqlConnection.query_execute(query.findUserBankAccount, user.user_id,connection).then(async function (result,error) {
                try{
                    console.log(result)
                    if (error) {
                        throw new Error( "Something went wrong, try again.")  
                    }
                    else if(result.status == 200 && result.data.length !== 0) {
                        var account = result.data[0];
                        var params = {
                            "p1": wallet.wallet_mobile,
                            "p2": amount,
                            "p3": account.account_validation_id,
                        }
                        yesBankServicesFun.verifyBankAccount(params, async function (yesBankResponse, error) {
                            try{
                                console.log(yesBankResponse)
                                if (error) {
                                    throw new Error( "Something went wrong, try again.")  
                                } else {
                                    if (yesBankResponse.status == 200 && yesBankResponse.message.status_code == "SUCCESS" && yesBankResponse.message.code == "00") {

                                        account.is_verified = transcationType.ACCOUNT_VERIFIED;
                                        account.account_verified_at = dateFormat("yyyy-mm-dd HH:MM:ss");
                                        account.updated_at = dateFormat("yyyy-mm-dd HH:MM:ss");
                                        var accountUpdate = [account.is_verified, account.account_verified_at, account.updated_at, account.account_validation_id, user.user_id]
                                        mysqlConnection.query_execute(query.updateAccountVarify, accountUpdate, connection).then(async function (result,error) {
                                            try{
                                                console.log(result)
                                                if (error) {
                                                    throw new Error( "Error in updating user account into database.")  
                                                }
                                                else if (result.status == 200) {
                                                    // ================================multichain=========================== 
                                                    var accountObj = {
                                                        'user_id': user.user_id,
                                                        'account_no': account.account_no,
                                                        'ifsc_code': account.ifsc_code,
                                                        'is_verified': transcationType.ACCOUNT_VERIFIED,
                                                        'account_validation_id': account.account_validation_id,
                                                        'account_created_at': account.account_created_at,
                                                        'account_verified_at': dateFormat("yyyy-mm-dd HH:MM:ss"),
                                                        'created_at': account.created_at,
                                                        'updated_at': dateFormat("yyyy-mm-dd HH:MM:ss")
                                                    }
                                                    var key = account.account_validation_id + "_" + users.blockchain_key + "_UserBankAccount";
                                                    var value = accountObj;
                                                    var input = {};

                                                    input.data = value;
                                                    input.meta = {
                                                        'submittedOn': new Date()
                                                    }

                                                    // let multichain = await multichainAddData.addData(key,input);
                                                    // console.log("mukllll", multichain)
                                                    multichainAddData.addData(key, input).then(async function (result) {
                                                        try{
                                                            console.log(result)
                                                            if (result.response == "record already exist!") {
                                                                errorCode = 'ERROR_MULTICHAIN_01';
                                                                 throw new Error( "Record already exist!") 
                                                            } else {
                                                                await connection.commit()
                                                                // $suc = ErrorMessage::getMessage('SUCCESS_VO00', $lang);
                                                                errorCode = "SUCCESS_VO00";
                                                                var getErrMsg = Utils.getErrorMessage(lang, errorCode)

                                                                response = {
                                                                    "statusReason": "OK",
                                                                    "isSuccessful": true,
                                                                    "success": true,
                                                                    "data": {
                                                                        "code": getErrMsg.code,
                                                                        "message": getErrMsg.message,
                                                                        "status_type": "",
                                                                        "status_popupmessage_type": ""

                                                                    },
                                                                    "statusCode": 200
                                                                }
                                                                callback(response)
                                                               await connection.end()
                                                            }
                                                           }catch (err) {
                                                            await connection.rollback();
                                                            console.error(err)
                                                            var getErrMsg = Utils.getErrorMessage(lang, errorCode)
                                                            if(getErrMsg == false){
                                                                getErrMsg.code= errorCode;
                                                                getErrMsg.message = err;
                                                            }
                                                            response = {
                                                                'success': false,
                                                                'statusCode': 200,
                                                                'data': {
                                                                    'code': getErrMsg.code,
                                                                    'message': getErrMsg.message,
                                                                    'status_type': '',
                                                                    'status_popupmessage_type': ''
                                                                },
                                                            };
                                                            callback(response)
                                                            await connection.end()
                                                         } 
                                                        })

                                                    //============================end ===================================

                                                } else {
                                                    await connection.rollback();
                                                    console.error(err)
                                                    var getErrMsg = Utils.getErrorMessage(lang, errorCode)
                                                    if(getErrMsg == false){
                                                        getErrMsg.code= errorCode;
                                                        getErrMsg.message = err;
                                                    }
                                                    response = {
                                                        'success': false,
                                                        'statusCode': 200,
                                                        'data': {
                                                            'code': getErrMsg.code,
                                                            'message': getErrMsg.message,
                                                            'status_type': '',
                                                            'status_popupmessage_type': ''
                                                        },
                                                    };
                                                    callback(response)
                                                    await connection.end()
                                                }
                                            }catch (err) {
                                                await connection.rollback();
                                                console.error(err)
                                                var getErrMsg = Utils.getErrorMessage(lang, errorCode)
                                                if(getErrMsg == false){
                                                    getErrMsg.code= errorCode;
                                                    getErrMsg.message = err;
                                                }
                                                response = {
                                                    'success': false,
                                                    'statusCode': 200,
                                                    'data': {
                                                        'code': getErrMsg.code,
                                                        'message': getErrMsg.message,
                                                        'status_type': '',
                                                        'status_popupmessage_type': ''
                                                    },
                                                };
                                                callback(response)
                                                await connection.end()
                                            } 
                                        })
                                    } else if (yesBankResponse.status == 200 && yesBankResponse.message.status_code == "ERROR") {
                                        //$suc = ErrorMessage::getMessage($yresponse['status_code'].'_'.$yresponse['code'], $lang);
                                        errorCode = yesBankResponse.message.status_code+"_"+yesBankResponse.message.code;
                                        throw new Error( yesBankResponse.message.message) 
                                    }
                                    else{
                                        throw new Error("error on curl addOwnBankAccount")
                                    }
                                }
                            }catch (err) {
                                await connection.rollback();
                                console.error(err)
                                var getErrMsg = Utils.getErrorMessage(lang, errorCode)
                                if(getErrMsg == false){
                                    getErrMsg.code= errorCode;
                                    getErrMsg.message = err;
                                }
                                response = {
                                    'success': false,
                                    'statusCode': 200,
                                    'data': {
                                        'code': getErrMsg.code,
                                        'message': getErrMsg.message,
                                        'status_type': '',
                                        'status_popupmessage_type': ''
                                    },
                                };
                                callback(response)
                                await connection.end()
                            } 
                        });

                    } else {
                        throw new Error("No account found for user")
                    }
                }catch (err) {
                    await connection.rollback();
                    console.error(err)
                    var getErrMsg = Utils.getErrorMessage(lang, errorCode)
                    if(getErrMsg == false){
                        getErrMsg.code= errorCode;
                        getErrMsg.message = err;
                    }
                    response = {
                        'success': false,
                        'statusCode': 200,
                        'data': {
                            'code': getErrMsg.code,
                            'message': getErrMsg.message,
                            'status_type': '',
                            'status_popupmessage_type': ''
                        },
                    };
                    callback(response)
                    await connection.end()
                }  
            })
        }
    }catch (err) {
        await connection.rollback();
        console.error(err)
        var getErrMsg = Utils.getErrorMessage(lang, errorCode)
        if(getErrMsg == false){
            getErrMsg.code= errorCode;
            getErrMsg.message = err;
        }
        response = {
            'success': false,
            'statusCode': 200,
            'data': {
                'code': getErrMsg.code,
                'message': getErrMsg.message,
                'status_type': '',
                'status_popupmessage_type': ''
            },
        };
        callback(response)
        await connection.end()
    }  
}

async function modifyOwnBankAccount(req, callback) {
    var errorCode = 'ERROR_EA02';
    var response;
    var user = req.user;
    var lang = req.lang;
    var accountNumber = req.account_no;
    var ifscCode = req.ifsc_code;
    var connection = await DBConfig.getConnection()
    console.log(connection.threadId)
    await connection.beginTransaction()
    mysqlConnection.query_execute(query.findUsers, user.user_id,connection).then(function(result) {
        console.log(result)
        try {
            if (result.status == 200 && result.data.length !== 0) {
                var users = result.data[0];

                mysqlConnection.query_execute(query.getWalletByID, user.user_id,connection).then(function(result) {
                    console.log(result)
                    try {
                        if (result.status == 200 && result.data.length !== 0) {
                            var wallet = result.data[0];
                            mysqlConnection.query_execute(query.findUserBankAccount, user.user_id, connection).then(function(result) {
                                console.log(result)
                                try {
                                    if (result.status == 200 && result.data.length !== 0) {
                                        var account = result.data[0];
                                        var params = {
                                            "p1": wallet.wallet_mobile,
                                            "p2": accountNumber,
                                            "p3": ifscCode,
                                        }
                                        yesBankServicesFun.modifyOwnBankAccount(params, function(yesBankResponse, error) {
                                            console.log(yesBankResponse)
                                            try {
                                                if (error) {
                                                    throw new Error("Something went wrong, try again.")
                                                } else {

                                                    if (yesBankResponse.status == 200 && yesBankResponse.message.status_code == "SUCCESS" && yesBankResponse.message.code == "00") {
                                                        //var insertParams = [user.user_id, yesBankResponse.message.beneficiary_id, beneficiaryName, identifierType, accountNumber, ifscCode, mobileNumber, email]
                                                        account.account_no = accountNumber;
                                                        account.ifsc_code = ifscCode;
                                                        account.account_validation_id = yesBankResponse.message.account_validation_reference
                                                        account.account_created_at = dateFormat("yyyy-mm-dd HH:MM:ss");
                                                        account.updated_at = dateFormat("yyyy-mm-dd HH:MM:ss");


                                                        var accountUpdate = [account.account_no, account.ifsc_code, account_validation_id, account.account_created_at, account.updated_at, user.user_id]
                                                        mysqlConnection.query_execute(query.updateAccountModify, accountUpdate, connection).then(function(result) {
                                                            console.log(result)
                                                        try{
                                                            if (result.status == 200) {

                                                                // ================================multichain=========================== 
                                                                var accountObj = {
                                                                    'user_id': user.user_id,
                                                                    'account_no': accountNumber,
                                                                    'ifsc_code': ifscCode,
                                                                    'is_verified': account.is_verified,
                                                                    'account_validation_id': yesBankResponse.message.account_validation_reference,
                                                                    'account_created_at': dateFormat("yyyy-mm-dd HH:MM:ss"),
                                                                    'account_verified_at': account.account_verified_at,
                                                                    'created_at': account.created_at,
                                                                    'updated_at': dateFormat("yyyy-mm-dd HH:MM:ss")
                                                                }
                                                                var key = yesBankResponse.message.account_validation_reference + "_" + users.blockchain_key + "_UserBankAccount";
                                                                var value = accountObj;
                                                                var input = {};

                                                                input.data = value;
                                                                input.meta = {
                                                                    'submittedOn': new Date()
                                                                }

                                                                
                                                                multichainAddData.addData(key, input).then(function(result) {
                                                                        console.log(result)
                                                                    try{
                                                                        if (result.response == "record already exist!") {
                                                                            errorCode = 'ERROR_MULTICHAIN_01';
                                                                            throw new Error("Record already exist!")
                                                                        } else {
                                                                            connection.commit();
                                                                            
                                                                            errorCode = "SUCCESS_AA00";
                                                                            var getErrMsg = Utils.getErrorMessage(lang, errorCode)

                                                                            var finalObj = {
                                                                                "statusReason": "OK",
                                                                                "isSuccessful": true,
                                                                                "success": true,
                                                                                "data": {
                                                                                    "code": getErrMsg.code,
                                                                                    "message": getErrMsg.message,
                                                                                    "status_type": "",
                                                                                    "status_popupmessage_type": ""

                                                                                },
                                                                                "statusCode": 200
                                                                            }
                                                                            callback(finalObj)

                                                                        }
                                                                    } catch (err) {
                                                                        console.error(err)
                                                                        var errMess = Utils.getErrorMessage(lang, errorCode)
                                                                        if (errMess == false) {
                                                                            var getErrMsg = {};
                                                                            getErrMsg.code = errorCode;
                                                                            getErrMsg.message = err.message;
                                                                        } else {
                                                                            var getErrMsg = Utils.getErrorMessage(lang, errorCode)
                                                                        }
                                                                        response = {
                                                                            'success': false,
                                                                            'statusCode': 200,
                                                                            'data': {
                                                                                'code': getErrMsg.code,
                                                                                'message': getErrMsg.message,
                                                                                'status_type': '',
                                                                                'status_popupmessage_type': ''
                                                                            },
                                                                        };
                                                                        callback(response)
                                                                    }
                                                                    })

                                                                //============================end ===================================

                                                            } else {
                                                                connection.rollback();
                                                                throw new Error("Error in updating user account into database")
                                                            }
                                                            connection.commit()
                                                            
                                                        } catch (err) {
                                                            connection.rollback();
                                                            console.error(err)
                                                            var errMess = Utils.getErrorMessage(lang, errorCode)
                                                            if (errMess == false) {
                                                                var getErrMsg = {};
                                                                getErrMsg.code = errorCode;
                                                                getErrMsg.message = err.message;
                                                            } else {
                                                                var getErrMsg = Utils.getErrorMessage(lang, errorCode)
                                                            }
                                                            response = {
                                                                'success': false,
                                                                'statusCode': 200,
                                                                'data': {
                                                                    'code': getErrMsg.code,
                                                                    'message': getErrMsg.message,
                                                                    'status_type': '',
                                                                    'status_popupmessage_type': ''
                                                                },
                                                            };
                                                            callback(response)
                                                        }
                                                        })
                                                    } else if (yesBankResponse.status == 200 && yesBankResponse.message.status_code == "ERROR") {
                                                        errorCode = yesBankResponse.message.status_code + "_" + yesBankResponse.message.code;
                                                        throw new Error(yesBankResponse.message.message)
                                                    } else {
                                                        throw new Error("Something went wrong, try again.")
                                                    }
                                                }
                                            } catch (err) {
                                                console.error(err)
                                                var errMess = Utils.getErrorMessage(lang, errorCode)
                                                if (errMess == false) {
                                                    var getErrMsg = {};
                                                    getErrMsg.code = errorCode;
                                                    getErrMsg.message = err.message;
                                                } else {
                                                    var getErrMsg = Utils.getErrorMessage(lang, errorCode)
                                                }
                                                response = {
                                                    'success': false,
                                                    'statusCode': 200,
                                                    'data': {
                                                        'code': getErrMsg.code,
                                                        'message': getErrMsg.message,
                                                        'status_type': '',
                                                        'status_popupmessage_type': ''
                                                    },
                                                };
                                                callback(response)
                                            }
                                        });



                                    } else {
                                        errorCode = 'ERROR_R66';
                                        throw new Error('No account linked against given wallet');
                                    }
                                } catch (err) {
                                    console.error(err)
                                    var errMess = Utils.getErrorMessage(lang, errorCode)
                                    if (errMess == false) {
                                        var getErrMsg = {};
                                        getErrMsg.code = errorCode;
                                        getErrMsg.message = err.message;
                                    } else {
                                        var getErrMsg = Utils.getErrorMessage(lang, errorCode)
                                    }
                                    response = {
                                        'success': false,
                                        'statusCode': 200,
                                        'data': {
                                            'code': getErrMsg.code,
                                            'message': getErrMsg.message,
                                            'status_type': '',
                                            'status_popupmessage_type': ''
                                        },
                                    };
                                    callback(response)
                                }
                            })

                        } else {
                            throw new Error("Error in getting wallet information")
                        }
                    } catch (err) {
                        console.error(err)
                        var errMess = Utils.getErrorMessage(lang, errorCode)
                        if (errMess == false) {
                            var getErrMsg = {};
                            getErrMsg.code = errorCode;
                            getErrMsg.message = err.message;
                        } else {
                            var getErrMsg = Utils.getErrorMessage(lang, errorCode)
                        }
                        response = {
                            'success': false,
                            'statusCode': 200,
                            'data': {
                                'code': getErrMsg.code,
                                'message': getErrMsg.message,
                                'status_type': '',
                                'status_popupmessage_type': ''
                            },
                        };
                        callback(response)
                    }
                })
            } else {
                errorCode = 'ERROR_1';
                throw new Error("User not found")
            }
        } catch (err) {
            console.error(err)
            var errMess = Utils.getErrorMessage(lang, errorCode)
            if (errMess == false) {
                var getErrMsg = {};
                getErrMsg.code = errorCode;
                getErrMsg.message = err.message;
            } else {
                var getErrMsg = Utils.getErrorMessage(lang, errorCode)
            }
            response = {
                'success': false,
                'statusCode': 200,
                'data': {
                    'code': getErrMsg.code,
                    'message': getErrMsg.message,
                    'status_type': '',
                    'status_popupmessage_type': ''
                },
            };
            callback(response)
        }
    })
    connection.end(); 
}