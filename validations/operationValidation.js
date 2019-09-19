'use strict';
var validator = require('validator');
var Utils = require('../util/utils');
const mysqlConnection = require('../mysql_connection/query_execute');
const query = require('../mysql_connection/quiries')
const operationServices = require('../functions/Operation/OperationServices');
module.exports = {
    addBeneficiaryValidation: addBeneficiaryValidation,
    fetchBeneficiaryValidation: fetchBeneficiaryValidation,
    deleteBeneficiaryValidation: deleteBeneficiaryValidation,
    listBeneficiaryValidation: listBeneficiaryValidation,
    addOwnBankAccountValidation: addOwnBankAccountValidation,
    verifyBankAccountValidation: verifyBankAccountValidation,
    modifyOwnBankAccountValidation: modifyOwnBankAccountValidation
}


function addBeneficiaryValidation(req, callback) {
// return new Promise( function(resolve, reject) {
    const accessToken = req.headers.access_token;
    console.log("accessToken", accessToken);
    const h_lang = req.headers.user_language;
    if(h_lang=="en" || h_lang=="hi"){
     var lang = h_lang;
    }else{
        var lang = ""; 
    }
    
    if (!accessToken || !accessToken.trim()
      || !req.body.beneficiary_name || !req.body.identifier_type || !req.body.account_number
      || !req.body.ifsc_code || !req.body.mobile_no || !req.body.email
      || !req.body.beneficiary_name.trim() || !req.body.identifier_type.trim() || !req.body.account_number.trim()
      || !req.body.ifsc_code.trim() || !req.body.mobile_no.trim() || !req.body.email.trim()) {
        var getErrMsg = Utils.getErrorMessage(lang, "ERROR_EA01")
                var response = {
                    'success': false,
                    "status": 400,
                    'error': {
                        'code': getErrMsg.code,
                        'message': getErrMsg.message,
                        'status_type': '',
                        'status_popupmessage_type': ''
                    },
                };
            callback(response)
    } else {
        // 

        mysqlConnection.query_execute(query.findaccesstoken_access_token, accessToken).then(function(result) {
            console.log(result.data, "result")
            if (result.data.length === 0) {

                
                var getErrMsg = Utils.getErrorMessage(lang, "ERROR_EA00")
                var response = {
                    'success': false,
                    "status": 400,
                    'error': {
                        'code': getErrMsg.code,
                        'message': getErrMsg.message,
                        'status_type': '',
                        'status_popupmessage_type': ''
                    },
                };
            callback(response)

            } else {
                    var params = req.body;
                    params.user = result.data[0];
                    params.lang = lang;
                    operationServices.addBeneficiary(params).then(function(result)  {                  
               console.log(result,"result")
               if (result.statusCode == 200) {
               callback(result)
              }
            },function(error){
                callback(error)

            });
        
               }
    
    
            })
            }

//})

}

function fetchBeneficiaryValidation(req, callback) {
    return new Promise( function(resolve, reject) {
    const accessToken = req.headers.access_token;
    console.log("accessToken", accessToken);
    const h_lang = req.headers.user_language;
    if(h_lang=="en" || h_lang=="hi"){
     var lang = h_lang;
    }else{
        var lang = ""; 
    }
    
    if (!accessToken || !accessToken.trim() || !req.body.beneficiary_id || !req.body.beneficiary_id.trim()) {
        var getErrMsg = Utils.getErrorMessage(lang, "ERROR_EA01")
                var response = {
                    'success': false,
                    "status": 400,
                    'error': {
                        'code': getErrMsg.code,
                        'message': getErrMsg.message,
                        'status_type': '',
                        'status_popupmessage_type': ''
                    },
                };
            callback(response)
    } else {
        // 

        mysqlConnection.query_execute(query.findaccesstoken_access_token, accessToken).then(function(result) {
            console.log(result.data, "result")
            if (result.data.length === 0) {

                var getErrMsg = Utils.getErrorMessage(lang, "ERROR_EA00")
                var response = {
                    'success': false,
                    "status": 400,
                    'error': {
                        'code': getErrMsg.code,
                        'message': getErrMsg.message,
                        'status_type': '',
                        'status_popupmessage_type': ''
                    },
                };
            callback(response)

            } else {
                    var params = req.body;
                    params.lang = lang;
                    params.user = result.data[0];
                    operationServices.fetchBeneficiary(params, function (result, error) {                  
               console.log(result,"result")
               if (error) {
                callback(error)
              } else {
               callback(result)
              }
            });
        
               }
    
    
            })
            }

})

}

function deleteBeneficiaryValidation(req, callback) {
    return new Promise( function(resolve, reject) {
    const accessToken = req.headers.access_token;
    console.log("accessToken", accessToken);
    const h_lang = req.headers.user_language;
    if(h_lang=="en" || h_lang=="hi"){
     var lang = h_lang;
    }else{
        var lang = ""; 
    }
    
    if (!accessToken || !accessToken.trim() || !req.body.beneficiary_id || !req.body.beneficiary_id.trim()) {
        var getErrMsg = Utils.getErrorMessage(lang, "ERROR_EA01")
                var response = {
                    'success': false,
                    "status": 400,
                    'error': {
                        'code': getErrMsg.code,
                        'message': getErrMsg.message,
                        'status_type': '',
                        'status_popupmessage_type': ''
                    },
                };
            callback(response)
    } else {
        // 

        mysqlConnection.query_execute(query.findaccesstoken_access_token, accessToken).then(function(result) {
            console.log(result.data, "result")
            if (result.data.length === 0) {

                var getErrMsg = Utils.getErrorMessage(lang, "ERROR_EA00")
                var response = {
                    'success': false,
                    "status": 400,
                    'error': {
                        'code': getErrMsg.code,
                        'message': getErrMsg.message,
                        'status_type': '',
                        'status_popupmessage_type': ''
                    },
                };
            callback(response)
            } else {
                    var params = req.body;
                    params.lang = lang;
                    params.user = result.data[0];
                    operationServices.deleteBeneficiary(params, function (result, error) {                  
               console.log(result,"result")
               if (error) {
                callback(error)
              } else {
               callback(result)
              }
            });
        
               }
    
    
            })
            }

})

}

function listBeneficiaryValidation(req, callback) {
    return new Promise( function(resolve, reject) {
    const accessToken = req.headers.access_token;
    console.log("accessToken", accessToken);
    const h_lang = req.headers.user_language;
    if(h_lang=="en" || h_lang=="hi"){
     var lang = h_lang;
    }else{
        var lang = ""; 
    }
    
    if (!accessToken || !accessToken.trim() || !req.body.beneficiary_type || !req.body.beneficiary_type.trim()) {
        var getErrMsg = Utils.getErrorMessage(lang, "ERROR_EA01")
                var response = {
                    'success': false,
                    "status": 400,
                    'error': {
                        'code': getErrMsg.code,
                        'message': getErrMsg.message,
                        'status_type': '',
                        'status_popupmessage_type': ''
                    },
                };
            callback(response)
    } else {
        // 

        mysqlConnection.query_execute(query.findaccesstoken_access_token, accessToken).then(function(result) {
            console.log(result.data, "result")
            if (result.data.length === 0) {

                var getErrMsg = Utils.getErrorMessage(lang, "ERROR_EA00")
                var response = {
                    'success': false,
                    "status": 400,
                    'error': {
                        'code': getErrMsg.code,
                        'message': getErrMsg.message,
                        'status_type': '',
                        'status_popupmessage_type': ''
                    },
                };
            callback(response)

            } else {
                    var params = req.body;
                    params.lang = lang;
                    params.user = result.data[0];
                    operationServices.listBeneficiary(params, function (result, error) {                  
               console.log(result,"result")
               if (error) {
                callback(error)
              } else {
               callback(result)
              }
            });
        
               }
    
    
            })
            }

})

}

function addOwnBankAccountValidation(req, callback) {
    return new Promise( function(resolve, reject) {
    const accessToken = req.headers.access_token;
    console.log("accessToken", accessToken);
    const h_lang = req.headers.user_language;
    if(h_lang=="en" || h_lang=="hi"){
     var lang = h_lang;
    }else{
        var lang = ""; 
    }   
    
    if (!accessToken || !accessToken.trim() || !req.body.account_no || !req.body.account_no.trim() || !req.body.ifsc_code || !req.body.ifsc_code.trim()) {
        var getErrMsg = Utils.getErrorMessage(lang, "ERROR_EA01")
        var response = {
            'success': false,
            "status": 400,
            'error': {
                'code': getErrMsg.code,
                'message': getErrMsg.message,
                'status_type': '',
                'status_popupmessage_type': ''
            },
        };
    callback(response)
    } else {
        // 

        mysqlConnection.query_execute(query.findaccesstoken_access_token, accessToken).then(function(result) {
            console.log(result.data, "result")
            if (result.data.length === 0) {

                var getErrMsg = Utils.getErrorMessage(lang, "ERROR_EA00")
                var response = {
                    'success': false,
                    "status": 400,
                    'error': {
                        'code': getErrMsg.code,
                        'message': getErrMsg.message,
                        'status_type': '',
                        'status_popupmessage_type': ''
                    },
                };
            callback(response)

            } else {
                    var params = req.body;
                    params.lang = lang;
                    params.user = result.data[0];
                    operationServices.addOwnBankAccount(params, function (result, error) {                  
               console.log(result,"result")
               if (error) {
                callback(error)
              } else {
               callback(result)
              }
            });
        
               }
    
    
            })
            }

})

}

function verifyBankAccountValidation(req, callback) {
    return new Promise( function(resolve, reject) {
    const accessToken = req.headers.access_token;
    console.log("accessToken", accessToken);
    const h_lang = req.headers.user_language;
    if(h_lang=="en" || h_lang=="hi"){
     var lang = h_lang;
    }else{
        var lang = ""; 
    }   
    
    if (!accessToken || !accessToken.trim() || !req.body.amount) {
        var getErrMsg = Utils.getErrorMessage(lang, "ERROR_EA01")
        var response = {
            'success': false,
            "status": 400,
            'error': {
                'code': getErrMsg.code,
                'message': getErrMsg.message,
                'status_type': '',
                'status_popupmessage_type': ''
            },
        };
    callback(response)
    } else {
        // 

        mysqlConnection.query_execute(query.findaccesstoken_access_token, accessToken).then(function(result) {
            console.log(result.data, "result")
            if (result.data.length === 0) {

                var getErrMsg = Utils.getErrorMessage(lang, "ERROR_EA00")
                var response = {
                    'success': false,
                    "status": 400,
                    'error': {
                        'code': getErrMsg.code,
                        'message': getErrMsg.message,
                        'status_type': '',
                        'status_popupmessage_type': ''
                    },
                };
            callback(response)

            } else {
                    var params = req.body;
                    params.lang = lang;
                    params.user = result.data[0];
                    operationServices.verifyBankAccount(params, function (result, error) {                  
               console.log(result,"result")
               if (error) {
                callback(error)
              } else {
               callback(result)
              }
            });
        
               }
    
    
            })
            }

})

}

function modifyOwnBankAccountValidation(req, callback) {
    return new Promise( function(resolve, reject) {
    const accessToken = req.headers.access_token;
    console.log("accessToken", accessToken);
    const h_lang = req.headers.user_language;
    if(h_lang=="en" || h_lang=="hi"){
     var lang = h_lang;
    }else{
        var lang = ""; 
    }   
    
    if (!accessToken || !accessToken.trim() || !req.body.account_no || !req.body.ifsc_code
    || !req.body.account_no.trim() || !req.body.ifsc_code.trim()) {
        var getErrMsg = Utils.getErrorMessage(lang, "ERROR_EA01")
                var response = {
                    'success': false,
                    "status": 400,
                    'error': {
                        'code': getErrMsg.code,
                        'message': getErrMsg.message,
                        'status_type': '',
                        'status_popupmessage_type': ''
                    },
                };
            callback(response)
    } else {
        // 

        mysqlConnection.query_execute(query.findaccesstoken_access_token, accessToken).then(function(result) {
            console.log(result.data, "result")
            if (result.data.length === 0) {

                var getErrMsg = Utils.getErrorMessage(lang, "ERROR_EA00")
                var response = {
                    'success': false,
                    "status": 400,
                    'error': {
                        'code': getErrMsg.code,
                        'message': getErrMsg.message,
                        'status_type': '',
                        'status_popupmessage_type': ''
                    },
                };
            callback(response)

            } else {
                    var params = req.body;
                    params.lang = lang;
                    params.user = result.data[0];
                    operationServices.modifyOwnBankAccount(params, function (result, error) {                  
               console.log(result,"result")
               if (error) {
                callback(error)
              } else {
               callback(result)
              }
            });
        
               }
    
    
            })
            }

})

}