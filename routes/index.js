/**
 * @author: Vikram Viswanathan
 * @version: 1.0.0
 * @date: September 28, 2018
 * @Description: This would be the routes file where all the API definitions and implementations are described.
 */

/**
 * Usage of strict mode
 * 1. It catches some common coding bloopers, throwing exceptions.
 * 2. It prevents, or throws errors, when relatively “unsafe” actions are taken (such as gaining access to the global object).
 * 3. It disables features that are confusing or poorly thought out.
 */
'use strict';

var express = require('express'),
  path = require('path'),
  request = require('request'),
  router = express.Router();

const cors = require('cors');
//var Promise = require('es6-promise').Promise;


const addFunctionsValidation = require('./../validations/addFunctionsValidation');
const addFunctionsLogout = require('./../validations/logoutValidation');
const readFunctionsValidation = require('./../validations/readFunctionsValidation');
//const manageBankAccount = require('./../util/manageBankAccount')
// const getBhamashahValidation = require('../validations/bhamashahYojanaValidation')
// const enrollmentValidation = require('../validations/bhamashahYojanaValidation')
const bhamashahYojanaValidation = require('../validations/bhamashahYojanaValidation')
const loginFunctionValidation = require('./../functions/LoginServices/authenticateSSOID');
const emitraFunctionValidation = require('./../validations/emitraFunctionsValidation');
const walletFunctionValidation = require('./../validations/walletFunctionsValidation.js');
const deleteFunctionsValidation = require('./../validations/deleteFunctionsValidation')
const transcationType = require('../message/transcationType');
const transactionCountDB = require('../functions/DBFunctions/TransactionCountDB');

const dashboardAPIs = require('../functions/Dashboard/DashboardAPIs');
const familyCount = require('../functions/Count/familycount');
const device = require('device')
const deviceCount = require("../functions/Count/deviceCount");
const getKYCCount = require("../functions/Count/getKYCCount")
//const fetchfamilymembers = require('./../functions/fetchfamilymembers');
var getcounts = require("./../functions/getCounts");
// const enrollmentdetails = require('./../functions/enrollmentdetails');

const mysqlConnection = require('./../mysql_connection/query_execute');
const query = require('./../mysql_connection/quiries')

const operationvalidation = require('./../validations/operationValidation')
const Mpinvalidation = require('./../validations/addFunctionsValidation')
const checkWalletBalance = require('./../validations/checkWalletBalance')
const submitFeedback= require('./../validations/submitFeedback')
const Mpincheck = require('./../validations/addFunctionsValidation')
const yesBankServiceValidation = require('./../validations/yesBankServiceValidation')
const yesBankServicefunc = require('./../functions/YesBankServices/yesBankServices')
const createAccessToken = require('./../functions/LoginServices/createAccessToken');
const requestMoneyFunctionValidation = require('./../validations/requestMoneyFunctionValidation');
const setresponseTime = require('./../functions/DBFunctions/TransactionDB');
const faqValidation = require('./../validations/faqFunctionValidation');
const actionVerify = require('../schedular/emitraController')
const  scheduler = require('./../schedular/transaction')

/* GET home page. */
router.get('/', function (request, response, next) {
  response.render('index', {
    title: 'Express'
  });
});
//Monthly transaction hit api
router.post("/getTransactionCount_yearlyBasis", cors(), (request, response) => {

  dashboardAPIs.getYearCountTest(function (error, result) {
    console.log(result)
    if (error) {
      response.status(error.status).json({
        status: error.status,
        message: error
      });
    } else {
      response.status(result.status).json({
        result
      });
    }
  })
})

//Monthly transaction hit api
router.post("/getTransactionCount_monthlyBasis", cors(), (request, response) => {

  dashboardAPIs.getMonthCountTest(function (error, result) {
    console.log(result)
    if (error) {
      response.status(error.status).json({
        status: error.status,
        message: error
      });
    } else {
      response.status(result.status).json({
        result
      });
    }
  })
})

//weekly transaction hit api
router.post("/getTransactionCount_weeklyBasis", cors(), (request, response) => {

  dashboardAPIs.getWeekCountTest(function (error, result) {
    console.log(result)
    if (error) {
      response.status(error.status).json({
        status: error.status,
        message: error
      });
    } else {
      response.status(result.status).json({
        result
      });
    }
  })
})

// Daily transaction hit count api
router.post("/getTransactionCount_DailyBasis", cors(), (request, response) => {

  dashboardAPIs.getDailyCountTest(function (error, result) {
    console.log("response", result)
    if (error) {
      response.status(error.status).json({
        status: error.status,
        message: error
      });
    } else {
      response.status(result.status).json({
        result
      });
    }
  })
})


router.post("/addData", cors(), (request, response) => {
  addFunctionsValidation.addDataTestValidation(request, function (error, result) {
    if (error) {
      response.status(error.status).json({
        message: error
      });
    } else {
      response.json({
        status: result.status,
        message: result.message
      });
    }
  });
});

router.post("/readData", cors(), (request, response) => {
  readFunctionsValidation.readDataTestValidation(request, function (error, result) {
    if (error) {
      response.status(error.status).json({
        message: error
      });
    } else {
      response.json({
        status: result.status,
        data: result
      });
    }
  });
});


router.post("/authenticateSSOID", cors(), (request, response) => {
  loginFunctionValidation.authenticateSSOID(request, function (error, result) {
    console.log("err", result,error)
    if (error) {
      // var time = setresponseTime.updateAPIResponseTiame('authenticateSSOID', transcationType.STATUS_FAILED, transcationType.STATUS_CREATE, (response.req._startTime), new Date());
      response.status(error.status).json({
        message: error
      });
    } else {
      // var time = setresponseTime.updateAPIResponseTime('authenticateSSOID', transcationType.STATUS_SUCCESS, transcationType.STATUS_CREATE, (response.req._startTime), new Date());
      response.status(result.status).json({
        message: result
      });
    }
  });
})

// yesBank Modules

router.post("/checkUserDirect", cors(), (request, response) => {
  yesBankServiceValidation.checkUserValidation(request, function (result, error) {
    console.log(result)
    if (error) {
      response.status(error.status).json({
        message: error.message
      });
    } else {
      response.status(200).json({
        message: result
      });
    }
  });
})
router.post("/checkWalletBalance", cors(), (request, response) => {
  yesBankServiceValidation.checkWalletBalanceValidation(request, function (error,result) {
    console.log(result)
    if (error) {
      response.status(error.status).json({
        message: error.message
      });
    } else {
      response.status(result.statusCode).json(result);
    }
  });
})

router.post("/checkKYCStatusDirect", cors(), (request, response) => {
  yesBankServiceValidation.checkKYCStatusValidation(request, function (result, error) {
    console.log(result)
    if (error) {
      response.status(error.status).json({
        message: error.message
      });
    } else {
      response.status(200).json({
        message: result
      });
    }
  });
})

router.post("/regUserDirect", cors(), (request, response) => {
  yesBankServiceValidation.regUserValidation(request, function (result, error) {
    console.log(result)
    if (error) {
      response.status(error.status).json({
        message: error.message
      });
    } else {
      response.status(200).json({
        message: result
      });
    }
  });
})
//regaadhar
router.post("/regAadhar", cors(), (request, response) => {
  yesBankServicefunc.registerAadhaar(request, function (result, error) {
    console.log(result)
    if (error) {
      response.status(error.status).json({
        message: error.message
      });
    } else {
      response.status(200).json({
        message: result
      });
    }
  });
})
//checkwalletbalance
router.post("/checkWalletBalnc", cors(), (request, response) => {
  checkWalletBalance.actionCheckWalletBalance(request, function (result, error) {
    console.log(result)
    if (error) {
      response.status(error.status).json({
        message: error.message
      });
    } else {
      response.status(200).json({
        message: result
      });
    }
  });
})
//submitFeedback
router.post("/submitFeedback", cors(), (request, response) => {
    submitFeedback.actionSubmitFeedback(request, function (error,result) {
    console.log(result)
    if (error) {
      response.status(error.status).json({
        message: error.message
      });
    } else {
      response.status(200).json( result)
    
    }
  });
})
//loadmoneytowallet
router.post("/loadmoneytowallet", cors(), (request, response) => {
  yesBankServiceValidation.loadmoneytowallet(request, function (result, error) {
    console.log(result)
    if (error) {
      var time = setresponseTime.updateAPIResponseTime('loadmoneytowallet', transcationType.STATUS_FAILED, transcationType.STATUS_CREATE, (response.req._startTime), new Date());
      response.status(error.statusCode).json(error)
    } else {
      var time = setresponseTime.updateAPIResponseTime('loadmoneytowallet', transcationType.STATUS_SUCCESS, transcationType.STATUS_CREATE, (response.req._startTime), new Date());
      response.status(result.statusCode).json(result)

    }
  });
})
//Wallettowallet
router.post("/Wallet", cors(), (request, response) => {
  yesBankServiceValidation.Wallet(request, function (result, error) {
    console.log(result)

    if (error) {
      var time = setresponseTime.updateAPIResponseTime('Wallet', transcationType.STATUS_FAILED, transcationType.STATUS_CREATE, ((response.req._startTime)), new Date());
      response.status(error.status).json({
        message: error.message
      });
    } else {

      var time = setresponseTime.updateAPIResponseTime('Wallet', transcationType.STATUS_SUCCESS, transcationType.STATUS_CREATE, ((response.req._startTime)), new Date());
      async function getDailyCountTest() {
        //Get counts for current date    
        console.log("insert query")
        const Count = 1;
        const now = new Date();
        console.log("now Date", now);
        const CurrentDate = Utils.datechange(now);
        console.log("Current Date", CurrentDate);
        const result = await mysqlConnection.query_execute('SELECT * FROM TransactionCountDayWeekMonth WHERE Date = ?', CurrentDate)
        console.log(result.data[0].Count);
        if (result.data.length != 0) {
          console.log("true");
          const transactionCountUpdate = await mysqlConnection.query_execute(query.updateCountForTx, [CurrentDate, Count])
          console.log(transactionCountUpdate.data);
        } else {
          console.log("false");
          const transactionCountInsert = await mysqlConnection.insert_query(query.addSuccessCountForTx, [CurrentDate, Count])
          console.log(transactionCountInsert);
        }
        //callback("", {status:200,TotalCount_Daily:result.data[0]});
      }

      getDailyCountTest(); // calling transaction count update and insert function

      response.status(200).json({
        message: result
      });
    }
  });
})
// walletto wallet
router.post("/wallettowallet", cors(), (request, response) => {
  walletFunctionValidation.wallettowalletValidation(request, function (error, result) {
    console.log(result, "neelima====>")
    transactionCountDB.addTransactionCount("wallettowallet");

    if (error) {
      var time = setresponseTime.updateAPIResponseTime('wallettowallet', transcationType.STATUS_FAILED, transcationType.STATUS_CREATE, (response.req._startTime), new Date());
      response.status(error.statusCode).json(error);
    }else {
      var time = setresponseTime.updateAPIResponseTime('wallettowallet', transcationType.STATUS_FAILED, transcationType.STATUS_CREATE, (response.req._startTime), new Date());
      response.status(result.statusCode).json(result);
    } 
  });
})
//WallettoBank
router.post("/wallettoBank", cors(), (request, response) => {
  walletFunctionValidation.actionImpsTransfer(request, function (error, result) {
    console.log(result, "neelima====>")
    transactionCountDB.addTransactionCount("wallettoBank", result.success);

    if (error) {
      var time = setresponseTime.updateAPIResponseTime('wallettoBank', transcationType.STATUS_FAILED, transcationType.STATUS_CREATE, ((response.req._startTime)), new Date());
      response.status(error.status).json({
        message: error.message
      });
    } else {
      var time = setresponseTime.updateAPIResponseTime('wallettoBank', transcationType.STATUS_SUCCESS, transcationType.STATUS_CREATE, ((response.req._startTime)), new Date());
      //daily transaction count
      async function getDailyCountTest() {
        //Get counts for current date    
        console.log("insert query")
        const Count = 1;
        const now = new Date();
        console.log("now Date", now);
        const CurrentDate = Utils.datechange(now);
        console.log("Current Date", CurrentDate);
        const result = await mysqlConnection.query_execute('SELECT * FROM TransactionCountDayWeekMonth WHERE Date = ?', CurrentDate)
        console.log(result.data[0].Count);
        if (result.data.length != 0) {
          console.log("true");
          const transactionCountUpdate = await mysqlConnection.query_execute(query.updateCountForTx, [CurrentDate, Count])
          console.log(transactionCountUpdate.data);
        } else {
          console.log("false");
          const transactionCountInsert = await mysqlConnection.insert_query(query.addSuccessCountForTx, [CurrentDate, Count])
          console.log(transactionCountInsert);
        }
        //callback("", {status:200,TotalCount_Daily:result.data[0]});
      }

      getDailyCountTest(); // calling transaction count update and insert function

      response.status(result.statusCode).json(result);
    } 
  });
})



router.post("/addBeneficiaryDirect", cors(), (request, response) => {
  yesBankServiceValidation.addBeneficiaryValidation(request, function (result, error) {
    console.log(result)
    if (error) {
      response.status(error.status).json({
        message: error.message
      });
    } else {
      response.status(200).json({
        message: result
      });
    }
  });
})


router.post("/verifyMobileOTPDirect", cors(), (request, response) => {
  yesBankServiceValidation.verifyMotpValidation(request, function (result, error) {
    console.log(result)
    if (error) {
      response.status(error.statusCode).json({
        message: error.message
      });
    } else {
      response.status(200).json({
        message: result
      });
    }
  });
})

//Payee management modules

router.post("/addBeneficiary", cors(), (request, response) => {
  operationvalidation.addBeneficiaryValidation(request, function (result, error) {
    transactionCountDB.addTransactionCount("addBeneficiary", result.success);
    if (result.success == true) {
      var time = setresponseTime.updateAPIResponseTime('addBeneficiary', transcationType.STATUS_SUCCESS, transcationType.STATUS_CREATE, ((response.req._startTime)), new Date());
      response.status(result.statusCode).json(result);
    } else {
      var time = setresponseTime.updateAPIResponseTime('addBeneficiary', transcationType.STATUS_FAILED, transcationType.STATUS_CREATE, ((response.req._startTime)), new Date());
      response.status(400).json(result);
    }
  });
})

router.post("/fetchBeneficiary", cors(), (request, response) => {
  operationvalidation.fetchBeneficiaryValidation(request, function (result) {
    transactionCountDB.addTransactionCount("fetchBeneficiary", result.success);
    if (result.success == true) {
      var time = setresponseTime.updateAPIResponseTime('fetchBeneficiary', transcationType.STATUS_SUCCESS, transcationType.STATUS_READ, ((response.req._startTime)), new Date());
      response.status(result.statusCode).json(result);
    } else {
      var time = setresponseTime.updateAPIResponseTime('fetchBeneficiary', transcationType.STATUS_FAILED, transcationType.STATUS_READ, ((response.req._startTime)), new Date());
      response.status(400).json(result);
    }
  });
})

router.post("/deleteBeneficiary", cors(), (request, response) => {
  operationvalidation.deleteBeneficiaryValidation(request, function (result, error) {
    transactionCountDB.addTransactionCount("deleteBeneficiary", result.success);
    if (result.success == true) {
      var time = setresponseTime.updateAPIResponseTime('deleteBeneficiary', transcationType.STATUS_SUCCESS, transcationType.STATUS_DELETE, ((response.req._startTime)), new Date());
      response.status(result.statusCode).json(result);
    } else {
      var time = setresponseTime.updateAPIResponseTime('deleteBeneficiary', transcationType.STATUS_FAILED, transcationType.STATUS_DELETE, ((response.req._startTime)), new Date());
      response.status(400).json(result);
    }
  });
})

router.post("/listBeneficiary", cors(), (request, response) => {
  operationvalidation.listBeneficiaryValidation(request, function (result, error) {
    transactionCountDB.addTransactionCount("listBeneficiary", result.success);
    if (result.success == true) {
      var time = setresponseTime.updateAPIResponseTime('listBeneficiary', transcationType.STATUS_SUCCESS, transcationType.STATUS_READ, ((response.req._startTime)), new Date());
      response.status(result.statusCode).json(result);
    } else {
      var time = setresponseTime.updateAPIResponseTime('listBeneficiary', transcationType.STATUS_FAILED, transcationType.STATUS_READ, ((response.req._startTime)), new Date());
      response.status(400).json(result);
    }
  });
})
// Banking modules
router.post("/addOwnBankAccount", cors(), (request, response) => {
  operationvalidation.addOwnBankAccountValidation(request, function (result, error) {
    transactionCountDB.addTransactionCount("addOwnBankAccount", result.success);
    if (result.success == true) {
      var time = setresponseTime.updateAPIResponseTime('addOwnBankAccount', transcationType.STATUS_SUCCESS, transcationType.STATUS_CREATE, ((response.req._startTime)), new Date());
      response.status(result.statusCode).json(result);
    } else {
      var time = setresponseTime.updateAPIResponseTime('addOwnBankAccount', transcationType.STATUS_FAILED, transcationType.STATUS_CREATE, ((response.req._startTime)), new Date());
      response.status(400).json(result);
    }
  });
})

router.post("/verifyOwnBankAccount", cors(), (request, response) => {
  operationvalidation.verifyBankAccountValidation(request, function (result, error) {
    transactionCountDB.addTransactionCount("verifyOwnBankAccount", result.success);
    if (result.success == true) {
      var time = setresponseTime.updateAPIResponseTime('verifyOwnBankAccount', transcationType.STATUS_SUCCESS, transcationType.STATUS_VERIFIED, ((response.req._startTime)), new Date());
      response.status(result.statusCode).json(result);
    } else {
      var time = setresponseTime.updateAPIResponseTime('verifyOwnBankAccount', transcationType.STATUS_FAILED, transcationType.STATUS_VERIFIED, ((response.req._startTime)), new Date());
      response.status(400).json(result);
    }
  });
})

router.post("/modifyOwnBankAccount", cors(), (request, response) => {
  operationvalidation.modifyOwnBankAccountValidation(request, function (result, error) {
    transactionCountDB.addTransactionCount("modifyOwnBankAccount", result.success);
    if (result.success == true) {
      var time = setresponseTime.updateAPIResponseTime('modifyOwnBankAccount', transcationType.STATUS_SUCCESS, transcationType.STATUS_WRITE, ((response.req._startTime)), new Date());
      response.status(result.statusCode).json(result);
    } else {
      var time = setresponseTime.updateAPIResponseTime('modifyOwnBankAccount', transcationType.STATUS_FAILED, transcationType.STATUS_WRITE, ((response.req._startTime)), new Date());
      response.status(400).json(result);
    }
  });
})

router.post("/changeBeneficiaryDirect", cors(), (request, response) => {
  yesBankServiceValidation.changeBeneficiaryValidation(request, function (result, error) {
    console.log(result)
    if (error) {
      response.status(error.status).json({
        message: error.message
      });
    } else {
      response.status(200).json({
        message: result
      });
    }
  });
})
//bank Services End
//error handler
router.use(function (err, req, res, next) {
  res.status(500).json(JSON.stringify({
    error: err
  }));
});

router.get("/checkQuery", cors(), (request, response) => {
  console.log("asfaFSF")
  console.log("mysqlConnection====>", mysqlConnection);
  var params = [10]
  mysqlConnection.query_execute(query.test, params).then(function (result) {

    return response.json({
      status: result.status,
      data: result.data
    });

  }).catch(err => res.status(err.status).json({
    message: err.data
  }));
});

// Create MPIN
router.post("/createMPIN", cors(), (request, response) => {
  addFunctionsValidation.createMpin(request, function (error, result) {
    if (error) {
      var time = setresponseTime.updateAPIResponseTime('createMPIN', transcationType.STATUS_FAILED, transcationType.STATUS_CREATE, (response.req._startTime), new Date());
      if (error.hasOwnProperty('msg')) {
        response.status(result.status).json({
          message: error.msg
        });
      } else {
        var time = setresponseTime.updateAPIResponseTime('createMPIN', transcationType.STATUS_FAILED, transcationType.STATUS_CREATE, (response.req._startTime), new Date());
        response.status(error.status).json({
          message: error.message
        });
      }
    } else {
      console.log(result)
      var time = setresponseTime.updateAPIResponseTime('createMPIN', transcationType.STATUS_SUCCESS, transcationType.STATUS_CREATE, (response.req._startTime), new Date());
      response.status(result.status).json(
        result.message
      );
    }
  });
})
//MPIN Login
router.post("/MPINLogin", cors(), (request, response) => {
  addFunctionsValidation.MpinLogin(request, function (error, result) {
    if (error) {
      var time = setresponseTime.updateAPIResponseTime('MPINLogin', transcationType.STATUS_FAILED, transcationType.STATUS_CREATE, (response.req._startTime), new Date());
      if (error.hasOwnProperty('msg')) {
        response.status(result.status).json({
          message: error.msg
        });
      } else {
        response.status(error.status).json({
          message: error.message
        });
      }
    } else {
      var mydevice = device(request.headers['user-agent']);
      deviceCount.deviceCount(mydevice.type);
      // console.log(mydevice)
      var time = setresponseTime.updateAPIResponseTime('MPINLogin', transcationType.STATUS_SUCCESS, transcationType.STATUS_CREATE, (response.req._startTime), new Date());
      response.status(result.status).json(
        result.message
      );
    }
  });
})
// Change MPIN
router.post("/changeMpin", cors(), (request, response) => {
  addFunctionsValidation.changeMpin(request, function (error, result) {
    if (error) {
      var time = setresponseTime.updateAPIResponseTime('changeMpin', transcationType.STATUS_FAILED, transcationType.STATUS_WRITE, (response.req._startTime), new Date());
      if (error.hasOwnProperty('msg')) {
        response.status(200).json({
          message: error.msg
        });
      } else {
        response.status(error.status).json({
          message: error.message
        });
      }
    } else {
      var time = setresponseTime.updateAPIResponseTime('changeMpin', transcationType.STATUS_SUCCESS, transcationType.STATUS_WRITE, (response.req._startTime), new Date());
      response.status(result.status).json(
        result.message
      );
    }
  });
})

// Forgpt MPIN
router.post("/forgotMpin", cors(), (request, response) => {
  addFunctionsValidation.forgotMpin(request, function (error, result) {
    if (error) {
      var time = setresponseTime.updateAPIResponseTime('forgotMpin', transcationType.STATUS_VERIFIED, transcationType.STATUS_WRITE, (response.req._startTime), new Date());
      if (error.hasOwnProperty('msg')) {
        response.status(200).json(error);
      } else {
        response.status(error.status).json(error);
      }
    } else {
      var time = setresponseTime.updateAPIResponseTime('forgotMpin', transcationType.STATUS_VERIFIED, transcationType.STATUS_WRITE, (response.req._startTime), new Date());
      response.status(result.status).json(
        result
      );
    }
  });
})
//MPIN OTP verification
router.post("/verifyMpinOTP", cors(), (request, response) => {
  addFunctionsValidation.verifyMpinotp(request, function (error, result) {
    if (error) {
      var time = setresponseTime.updateAPIResponseTime('verifyMpinOTP', transcationType.STATUS_FAILED, transcationType.STATUS_VERIFIED, (response.req._startTime), new Date());
      if (error.hasOwnProperty('msg')) {
        response.status(200).json({
          message: error.msg
        });
      } else {
        response.status(error.status).json({
          message: error.message
        });
      }
    } else {
      var time = setresponseTime.updateAPIResponseTime('verifyMpinOTP', transcationType.STATUS_SUCCESS, transcationType.STATUS_VERIFIED, (response.req._startTime), new Date());
      response.status(result.status).json(
        result.message
      );
    }
  });
})

/**
 * @author: Deepak H
 * @version: 1.0.0
 * @date: October 16, 2018
 * @Description: Bhamashah Yojana Services.
 */
//get Bhamashah Status
router.post("/getbhamashahstatus", cors(), (request, response) => {
  bhamashahYojanaValidation.bhamashahstatusValidation(request, function (error, result) {
    // console.log("errror======>",error);
    if (error) {
      var time = setresponseTime.updateAPIResponseTime('getbhamashahstatus', transcationType.STATUS_FAILED, transcationType.STATUS_READ, (response.req._startTime), new Date());
      response.status(error.status).json({
        status: error.status,
        statusCode: error.error.code,
        statusMessage: error.error.message
      });
      // response.json({
      //   status: error.status,
      //   statusCode: error.error.code,
      //   statusMessage: error.error.message
      // });
    } else {
      var time = setresponseTime.updateAPIResponseTime('getbhamashahstatus', transcationType.STATUS_FAILED, transcationType.STATUS_READ, (response.req._startTime), new Date());
      response.json({
        status: result.status,
        statuscode: result.error.code,
        statusmessage: result.error.message,
        data: result.error.data
      });
    }
  });
});

// router.post("/getenrollmentdetails", cors(), (req, res) => {


//   const BHAMASHAH_ID = req.body.BHAMASHAH_ID;
//   console.log("nererer", req.body.VAR1)
//   const BHAMASHAH_ACK_ID = req.body.BHAMASHAH_ACK_ID;
//   const AADHAR_ID = req.body.AADHAR_ID;
//   const MOBILE_NO = req.body.MOBILE_NO;

//   // const MOBILE_NUMBER = req.body.MOBILE_NUMBER;
//   var finalresponse = []
//   if (!BHAMASHAH_ID && !BHAMASHAH_ACK_ID) {
//     res.status(401).json({
//       message: 'Please mention either of above correctly.'
//     });
//   }
//   if (!AADHAR_ID && !MOBILE_NO) {
//     res.status(401).json({
//       message: 'Please mention either of above correctly.'
//     });
//   } else {
//     enrollmentdetails.getenrollmentdetails(BHAMASHAH_ACK_ID, AADHAR_ID, MOBILE_NO)
//       .then(function (result) {

//         return res.status(result.status).json({
//           message: result
//         });
//       })
//       .catch(err =>
//         res.status(err.status).json({
//           message: err.message
//         }));
//   }
// })



router.post("/getenrollmentdetails", cors(), (request, response) => {
  bhamashahYojanaValidation.enrollmentValidation(request, function (error, result) {
    if (error) {
      var time = setresponseTime.updateAPIResponseTime('getenrollmentdetails', transcationType.STATUS_FAILED, transcationType.STATUS_READ, (response.req._startTime), new Date());
      response.status(error.status).json({
        status: error.status,
        statusCode: error.error.code,
        statusMessage: error.error.message
      });

    } else {
      var time = setresponseTime.updateAPIResponseTime('getenrollmentdetails', transcationType.STATUS_SUCCESS, transcationType.STATUS_READ, (response.req._startTime), new Date());
      response.json({
        status: result.status,
        statuscode: result.error.code,
        statusmessage: result.error.message,
        data: result.data
      });
    }
  });
});

router.post("/getDBTDetails", cors(), (request, response) => {
  bhamashahYojanaValidation.getDBTvalidation(request, function (error, result) {
    if (error) {
      var time = setresponseTime.updateAPIResponseTime('getDBTDetails', transcationType.STATUS_FAILED, transcationType.STATUS_READ, (response.req._startTime), new Date());
      response.status(error.status).json({
        status: error.status,
        statusCode: error.error.code,
        statusMessage: error.error.message
      });
      // response.json({
      //   status: error.status,
      //   statusCode: error.error.code,
      //   statusMessage: error.error.message
      // });
    } else {
      var time = setresponseTime.updateAPIResponseTime('getDBTDetails', transcationType.STATUS, transcationType.STATUS_READ, (response.req._startTime), new Date());
      response.json({
        status: result.status,
        statuscode: result.error.code,
        statusmessage: result.error.message,
        data: result.error.data
      });
    }
  });
});
/**
 * @author: Sathiyan Baskaran
 * @version: 1.0.0
 * @date: October 16, 2018
 * @Description: Emitra sevices for bill payments.
 */
router.post("/fetchUserDetail", cors(), (request, response) => {
  emitraFunctionValidation.emitraFetchValidation(request).then((error, result) => {
    if (error) {
      var addCount = transactionCountDB.addTransactionCount("FAILED", "fetchUserDetail", transcationType.STATUS_FAILED);
      var time = setresponseTime.updateAPIResponseTime('fetchUserDetail', transcationType.STATUS_FAILED, transcationType.STATUS_READ, (response.req._startTime), new Date());
      response.status(error.status).json({
        message: error
      });
    } else {
      var addCount = transactionCountDB.addTransactionCount("SUCCESS", "fetchUserDetail", transcationType.STATUS_READ);
      var time = setresponseTime.updateAPIResponseTime('fetchUserDetail', transcationType.STATUS_SUCCESS, transcationType.STATUS_READ, (response.req._startTime), new Date());
      response.json({
        status: result.status,
        message: result.message
      });
    }
  })
})
/**
 * @author: Sathiyan Baskaran
 * @version: 1.0.0
 * @date: October 16, 2018
 * @Description: Fetching Recent Bill History.
 */
router.get("/recentBillHistory", cors(), (request, response) => {
  emitraFunctionValidation.recentBillHistory(request).then(function (result) {
      var addCount = transactionCountDB.addTransactionCount("SUCCESS", "recentBillHistory", transcationType.STATUS_READ);
      var time = setresponseTime.updateAPIResponseTime('recentBillHistory', transcationType.STATUS_SUCCESS, transcationType.STATUS_READ, (response.req._startTime), new Date());
      response.status(result.status).json({
        result
      });

    }),
    function (error) {
      var addCount = transactionCountDB.addTransactionCount("FAILED", "recentBillHistory", transcationType.STATUS_FAILED);
      var time = setresponseTime.updateAPIResponseTime('recentBillHistory', transcationType.STATUS_FAILED, transcationType.STATUS_READ, (response.req._startTime), new Date());
      response.status(error.status).json({
        error
      });
    }
})
/**
 * @author: Sathiyan Baskaran
 * @version: 1.0.0
 * @date: October 16, 2018
 * @Description: Service For paying the bills.
 */
router.post("/actionBillPayment", cors(), (request, response) => {
  emitraFunctionValidation.actionBillPayment(request).then((error, result) => {
    if (error) {
      var time = setresponseTime.updateAPIResponseTime('actionBillPayment', transcationType.STATUS_FAILED, transcationType.STATUS_ACTIVE, (response.req._startTime), new Date());
      response.status(error.status).json({
        message: error
      });
    } else {
      //Daily transaction count
      async function getDailyCountTest() {
        //Get counts for current date    
        console.log("insert query")
        const Count = 1;
        const now = new Date();
        console.log("now Date", now);
        const CurrentDate = Utils.datechange(now);
        console.log("Current Date", CurrentDate);
        const result = await mysqlConnection.query_execute('SELECT * FROM TransactionCountDayWeekMonth WHERE Date = ?', CurrentDate)
        console.log(result.data[0].Count);
        if (result.data.length != 0) {
          console.log("true");
          const transactionCountUpdate = await mysqlConnection.query_execute(query.updateCountForTx, [CurrentDate, Count])
          console.log(transactionCountUpdate.data);
        } else {
          console.log("false");
          const transactionCountInsert = await mysqlConnection.insert_query(query.addSuccessCountForTx, [CurrentDate, Count])
          console.log(transactionCountInsert);
        }
        //callback("", {status:200,TotalCount_Daily:result.data[0]});
      }


      getDailyCountTest(); // calling transaction count update and insert function

      response.json({
        status: result.status,
        message: result.message
      });
    }
  })
})
/**
 * @author: Sathiyan Baskaran
 * @version: 1.0.0
 * @date: October 16, 2018
 * @Description: Service For Rpp Bill Payment.
 */
router.post("/RppBillPayment", cors(), (request, response) => {
  emitraFunctionValidation.RppBillPaymentInit(request).then((error, result) => {
    if (error) {
      var time = setresponseTime.updateAPIResponseTime('actionBillPayment', transcationType.STATUS_FAILED, transcationType.STATUS_ACTIVE,(response.req._startTime), new Date());
      response.status(error.status).json({
        message: error
      });
    } else {
      var time = setresponseTime.updateAPIResponseTime('actionBillPayment', transcationType.STATUS_SUCCESS, transcationType.STATUS_WRITE, (response.req._startTime), new Date());
      //Daily transaction count
      async function getDailyCountTest() {
        //Get counts for current date    
        console.log("insert query")
        const Count = 1;
        const now = new Date();
        console.log("now Date", now);
        const CurrentDate = Utils.datechange(now);
        console.log("Current Date", CurrentDate);
        const result = await mysqlConnection.query_execute('SELECT * FROM TransactionCountDayWeekMonth WHERE Date = ?', CurrentDate)
        console.log(result.data[0].Count);
        if (result.data.length != 0) {
          console.log("true");
          const transactionCountUpdate = await mysqlConnection.query_execute(query.updateCountForTx, [CurrentDate, Count])
          console.log(transactionCountUpdate.data);
        } else {
          console.log("false");
          const transactionCountInsert = await mysqlConnection.insert_query(query.addSuccessCountForTx, [CurrentDate, Count])
          console.log(transactionCountInsert);
        }
        //callback("", {status:200,TotalCount_Daily:result.data[0]});
      }

      getDailyCountTest(); // calling transaction count update and insert function

      response.json({
        status: result.status,
        message: result.message
      });
    }
  })
})
/**
 * @author: Sathiyan Baskaran
 * @version: 1.0.0
 * @date: October 16, 2018
 * @Description: Service For Rpp Bill Payment Status.
 */
router.post("/RppBillPaymentStatus", cors(), (request, response) => {
  emitraFunctionValidation.RppBillPaymentStatus(request).then((error, result) => {
    if (error) {
      var time = setresponseTime.updateAPIResponseTime('actionBillPayment', transcationType.STATUS_FAILED, transcationType.STATUS_ACTIVE,(response.req._startTime), new Date());
      response.status(error.status).json({
        message: error
      });
    } else {
      var time = setresponseTime.updateAPIResponseTime('actionBillPayment', transcationType.STATUS_SUCCESS, transcationType.STATUS_WRITE, (response.req._startTime), new Date());
     //Daily transaction count
     async function getDailyCountTest(){
      //Get counts for current date    
      console.log("insert query")
      const Count=1;
      const now = new Date();
      console.log("now Date",now);
      const CurrentDate = Utils.datechange(now);
      console.log("Current Date",CurrentDate);
      const result= await mysqlConnection.query_execute('SELECT * FROM TransactionCountDayWeekMonth WHERE Date = ?', CurrentDate)
      console.log(result.data[0].Count);
      if(result.data.length != 0){
      console.log("true");
      const transactionCountUpdate = await mysqlConnection.query_execute(query.updateCountForTx, [CurrentDate,Count])
      console.log(transactionCountUpdate.data);
      }else{
      console.log("false");
      const transactionCountInsert = await mysqlConnection.insert_query(query.addSuccessCountForTx, [CurrentDate,Count])
      console.log(transactionCountInsert);
     }
     //callback("", {status:200,TotalCount_Daily:result.data[0]});
  }
     
     
     
     getDailyCountTest()
     
     
      response.json({
        status: result.status,
        message: result.message
      });
    }
  })
})
/**
 * @author: Sathiyan Baskaran
 * @version: 1.0.0
 * @date: October 16, 2018
 * @Description: Service For Verifying the bill payment.
 */
router.post("/actionBillPaymentVerify", cors(), (request, response) => {
  emitraFunctionValidation.actionBillPaymentVerify(request).then(function (result) {
      var addCount = transactionCountDB.addTransactionCount("SUCCESS", "actionBillPaymentVerify", transcationType.STATUS_COMPLETE);
      var time = setresponseTime.updateAPIResponseTime('actionBillPaymentVerify', transcationType.STATUS_SUCCESS, transcationType.STATUS_VERIFIED, (response.req._startTime), new Date());
      response.status(result.status).json({
        result
      });
    }),
    function (error) {
      var addCount = transactionCountDB.addTransactionCount("FAILED", "actionBillPaymentVerify", transcationType.STATUS_FAILED);
      var time = setresponseTime.updateAPIResponseTime('actionBillPaymentVerify', transcationType.STATUS_FAILED, transcationType.STATUS_VERIFIED, (response.req._startTime), new Date());
      response.status(error.status).json({
        message: error
      });
    }
})


// RegisteraadharKYC

router.post("/registeraadharkyc", cors(), (request, response) => {
  console.log("readprofilesection");
  addFunctionsValidation.registeraadharvalidation(request, function (error, result) {

    if (error) {
      console.log("error", error)
      var time = setresponseTime.updateAPIResponseTime('registeraadharkyc', transcationType.STATUS_FAILED, transcationType.STATUS_CREATE, (response.req._startTime), new Date());
      response.status(error.status).json(error)

    } else {
      console.log("status", result)
      var time = setresponseTime.updateAPIResponseTime('registeraadharkyc', transcationType.STATUS_SUCCESS, transcationType.STATUS_CREATE, (response.req._startTime), new Date());
      response.status(result.status).json(result)

    }
  });
});

//Verify Aadhar Otp

router.post("/verifyaadharotp", cors(), (request, response) => {
  console.log("readprofilesection");
  addFunctionsValidation.otpaadharvalidation(request, function (error, result) {

    if (error) {
      console.log("error", error)
      var time = setresponseTime.updateAPIResponseTime('verifyaadharotp', transcationType.STATUS_FAILED, transcationType.STATUS_VERIFIED, (response.req._startTime), new Date());
      response.status(error.status).json(error)

    } else {
      console.log("status", result.status)
      var time = setresponseTime.updateAPIResponseTime('verifyaadharotp', transcationType.STATUS_SUCCESS, transcationType.STATUS_VERIFIED, (response.req._startTime), new Date());
      response.status(result.status).json(result);
    }
  });
});

//CloseWallet
router.post("/closewallet", cors(), (request, response) => {
  console.log("inside close wallet");
  deleteFunctionsValidation.closewalletvalidation(request, function (error, result) {

    if (error) {
      console.log("error",error)
      var time = setresponseTime.updateAPIResponseTime('closewallet', transcationType.STATUS_FAILED, transcationType.STATUS_DELETE, (response.req._startTime), new Date());
      response.status(error.status).json(error);
    } else {
      console.log("status", result.status)
      var time = setresponseTime.updateAPIResponseTime('closewallet', transcationType.STATUS_SUCCESS, transcationType.STATUS_DELETE, (response.req._startTime), new Date());
      response.status(result.status).json(result);
    }
  });
});

router.post("/readprofilesection", cors(), (request, response) => {
  console.log("readprofilesection");
  readFunctionsValidation.readprofilevalidation(request, function (error, result) {

    if (error) {
      var time = setresponseTime.updateAPIResponseTime('readprofilesection', transcationType.STATUS_FAILED, transcationType.STATUS_READ, (response.req._startTime), new Date());
      response.status(error.status).json({
        message: error
      });
    } else {
      console.log("status", result.status)
      var time = setresponseTime.updateAPIResponseTime('readprofilesection', transcationType.STATUS_SUCCESS, transcationType.STATUS_READ, (response.req._startTime), new Date());
      response.status(result.status).json({
        status: result.status,
        message: result.data
      });
    }
  });
});
//My Passbook
router.post("/readpassbook", cors(), (request, response) => {
  console.log("readprofilesection");
  readFunctionsValidation.readpassbookvalidation(request, function (error, result) {

    if (error) {
      var time = setresponseTime.updateAPIResponseTime('readpassbook', transcationType.STATUS_FAILED, transcationType.STATUS_READ, (response.req._startTime), new Date());
      response.status(error.status).json({
        message: error
      });
    } else {
      console.log("result", result)
      var time = setresponseTime.updateAPIResponseTime('readpassbook', transcationType.STATUS_SUCCESS, transcationType.STATUS_READ, (response.req._startTime), new Date());
      response.status(result.status).json(result);
    }
  });
});



//**************Get Notification******************//
router.post("/getnotification", cors(), (request, response) => {
  console.log("getnotification");
  readFunctionsValidation.getnotificationvalidation(request, function (error, result) {

    if (error) {
      var time = setresponseTime.updateAPIResponseTime('getnotificationvalidation', transcationType.STATUS_FAILED, transcationType.STATUS_READ, (response.req._startTime), new Date());
      response.status(error.status).json({
        message: error
      });
    } else {
      console.log("result", result)
      var time = setresponseTime.updateAPIResponseTime('getnotificationvalidation', transcationType.STATUS_SUCCESS, transcationType.STATUS_READ, (response.req._startTime), new Date());
      response.status(result.status).json(result);
    }
  });
});

//*********** actionProcessingTransaction***********//

router.get("/actionProcessingTransaction", cors(), (request, response) => {
  console.log("actionProcessingTransaction");
  scheduler.actionProcessingTransaction(request, function (error, result) {

    if (error) {
      var time = setresponseTime.updateAPIResponseTime('actionProcessingTransaction', transcationType.STATUS_FAILED, transcationType.STATUS_READ, (response.req._startTime), new Date());
      response.status(error.status).json({
        message: error
      });
    } else {
      console.log("result", result)
      var time = setresponseTime.updateAPIResponseTime('actionProcessingTransaction', transcationType.STATUS_SUCCESS, transcationType.STATUS_READ, (response.req._startTime), new Date());
      response.status(result.status).json(result);
    }
  });
});
/**
 * @author: Rakesh C
 * @version: 1.0.0
 * @date: October 22 , 2018
 * @Description: Create Wallet API. To create a wallet to the users.
 */
router.post("/createWallet", cors(), (request, response) => {
  console.log("createWallet");
  addFunctionsValidation.createWalletValidation(request, function (error, result) {
    if (error) {
      var time = setresponseTime.updateAPIResponseTime('createWallet', transcationType.STATUS_FAILED, transcationType.STATUS_CREATE, (response.req._startTime), new Date());
      response.status(error.statusCode).json(error);
    } else {
      var time = setresponseTime.updateAPIResponseTime('createWallet', transcationType.STATUS_SUCCESS, transcationType.STATUS_CREATE, (response.req._startTime), new Date());
      response.status(result.statusCode).json(result);
    }
  });
});

//Request money services
router.post("/requestMoneyCreate", cors(), (request, response) => {
  requestMoneyFunctionValidation.requestCreate(request).then(function (result) {
    console.log("requestMoneyCreate", result)
    var time = setresponseTime.updateAPIResponseTime('requestMoneyCreate', transcationType.STATUS_SUCCESS, transcationType.STATUS_CREATE, (response.req._startTime), new Date());
    response.json(result);
  }).catch(err => {
    var time = setresponseTime.updateAPIResponseTime('requestMoneyCreate', transcationType.STATUS_FAILED, transcationType.STATUS_CREATE, response.req._startTime, new Date());
    response.status(err.status).json(err.error);
  });
})

router.get("/requestMoneyRecieved", cors(), (request, response) => {
  requestMoneyFunctionValidation.requestRecieved(request).then((result) => {
    console.log("requestMoneyRecieve");
    var time = setresponseTime.updateAPIResponseTime('requestMoneyRecieved', transcationType.STATUS_SUCCESS, transcationType.STATUS_READ, (response.req._startTime), new Date());
    response.json(result);
  }).catch(err => {
    var time = setresponseTime.updateAPIResponseTime('requestMoneyRecieved', transcationType.STATUS_FAILED, transcationType.STATUS_READ, (response.req._startTime), new Date());
    response.status(err.status).json(err.error);
  });
})

router.get("/requestMoneySent", cors(), (request, response) => {
  requestMoneyFunctionValidation.requestSent(request).then((result) => {
    console.log("requestMoneySent");
    var time = setresponseTime.updateAPIResponseTime('requestMoneySent', transcationType.STATUS_SUCCESS, transcationType.STATUS_READ, (response.req._startTime), new Date());
    response.json(result);
  }).catch(err => {
    var time = setresponseTime.updateAPIResponseTime('requestMoneySent', transcationType.STATUS_FAILED, transcationType.STATUS_READ, (response.req._startTime), new Date());
    response.status(err.status).json(err.error);
  });
})

router.post("/requestMoneyDelete", cors(), (request, response) => {
  requestMoneyFunctionValidation.requestDelete(request).then((result) => {
    console.log("requestMoneyDelete")
    var time = setresponseTime.updateAPIResponseTime('requestMoneyDelete', transcationType.STATUS_SUCCESS, transcationType.STATUS_DELETE, (response.req._startTime), new Date());
    response.json(result);
  }).catch(err => {
    var time = setresponseTime.updateAPIResponseTime('requestMoneyDelete', transcationType.STATUS_FAILED, transcationType.STATUS_DELETE, (response.req._startTime), new Date());
    response.status(err.status).json(err.error);
  });
})

router.post("/requestMoneyReminder", cors(), (request, response) => {
  requestMoneyFunctionValidation.requestReminder(request).then((result) => {
    console.log("requestMoneyReminder")
    var time = setresponseTime.updateAPIResponseTime('requestMoneyReminder', transcationType.STATUS_SUCCESS, transcationType.STATUS_READ, (response.req._startTime), new Date());
    response.json(result);
  }).catch(err => {
    var time = setresponseTime.updateAPIResponseTime('requestMoneyReminder', transcationType.STATUS_FAILED, transcationType.STATUS_READ, (response.req._startTime), new Date());
    response.status(err.status).json(err.error);
  });
})




/**
 * @author: Rakesh C
 * @version: 1.0.0
 * @date: October 23 , 2018
 * @Description: Create Wallet API. To create a wallet to the users.
 */
router.post("/verifyMotp", cors(), (request, response) => {
  addFunctionsValidation.verifyMotpValidation(request, function (error, result) {
    if (error) {
      var time = setresponseTime.updateAPIResponseTime('verifyMotp', transcationType.STATUS_FAILED, transcationType.STATUS_VERIFIED, (response.req._startTime), new Date());
      response.status(error.statusCode).json({
        message: error
      });
    } else {
      response.status(result.statusCode).json(result);
    }
  });
});

/**
 * @author: Rakesh C
 * @version: 1.0.0
 * @date: October 26 , 2018
 * @Description: Load Reversal API.
 */
router.post("/loadReversal", cors(), (request, response) => {
  console.log("loadReversal");

  addFunctionsValidation.loadReversalValidation(request, function (error, result) {
    if (error) {
      var time = setresponseTime.updateAPIResponseTime('loadReversal', transcationType.STATUS_FAILED, 'CREATE', (response.req._startTime), new Date());
      response.status(error.status).json({
        message: error
      });
    } else {
      console.log("status", result.statusCode)
      response.status(result.statusCode).json(result);
    }
  });
});

var Rpp = require('../functions/PaymentController/PaymentController')
router.post("/RPPTest", cors(), (request, response) => {
  console.log("RPPTest");
  var res = Rpp.actionInit(request)
  if (res) {
    response.status(200).json(res)
  } else {

  }
});

router.post("/RPPStatus", cors(), (request, response) => {
  console.log("RPPTest");
 
  var res = Rpp.actionTransaction(request)


});

// Faq API

router.post("/faqCreate", cors(), (request, response) => {
  faqValidation.faqCreate(request).then(function (result) {
    console.log("faqCreate", result)
    // var time = setresponseTime.updateAPIResponseTime('faqCreate', transcationType.STATUS_SUCCESS, transcationType.STATUS_CREATE, (response.req._startTime), new Date());
    response.json(result);
  }).catch(err => {
    console.log("faqCreate", err)
    // var time = setresponseTime.updateAPIResponseTime('faqCreate', transcationType.STATUS_FAILED, transcationType.STATUS_CREATE, response.req._startTime, new Date());
    response.status(err.status).json(err.error);
  });
})

router.post("/faqRead", cors(), (request, response) => {
  faqValidation.faqRead(request).then(function (result) {
    console.log("faqRead", result)
    // var time = setresponseTime.updateAPIResponseTime('faqCreate', transcationType.STATUS_SUCCESS, transcationType.STATUS_CREATE, (response.req._startTime), new Date());
    response.json(result);
  }).catch(err => {
    console.log("faqRead", err)
    // var time = setresponseTime.updateAPIResponseTime('faqCreate', transcationType.STATUS_FAILED, transcationType.STATUS_CREATE, response.req._startTime, new Date());
    response.status(err.status).json(err.error);
  });
})

router.post("/faqUpdate", cors(), (request, response) => {
  faqValidation.faqUpdate(request).then(function (result) {
    console.log("faqUpdate", result)
    // var time = setresponseTime.updateAPIResponseTime('faqCreate', transcationType.STATUS_SUCCESS, transcationType.STATUS_CREATE, (response.req._startTime), new Date());
    response.json(result);
  }).catch(err => {
    console.log("faqUpdate", err)
    // var time = setresponseTime.updateAPIResponseTime('faqCreate', transcationType.STATUS_FAILED, transcationType.STATUS_CREATE, response.req._startTime, new Date());
    response.status(err.status).json(err.error);
  });
})

router.post("/faqDelete", cors(), (request, response) => {
  faqValidation.faqDelete(request).then(function (result) {
    console.log("faqDelete", result)
    // var time = setresponseTime.updateAPIResponseTime('faqCreate', transcationType.STATUS_SUCCESS, transcationType.STATUS_CREATE, (response.req._startTime), new Date());
    response.json(result);
  }).catch(err => {
    console.log("faqDelete", err)
    // var time = setresponseTime.updateAPIResponseTime('faqCreate', transcationType.STATUS_FAILED, transcationType.STATUS_CREATE, response.req._startTime, new Date());
    response.status(err.status).json(err.error);
  });
})




module.exports = router;
// **************** BHAMASHAH_WALLET DASHBOARD API***************

// Total Number of Transactions(Currentdate)

router.post("/Totalnumberoftransactionscurrentdate", cors(), (request, response) => {
  console.log("res")
  dashboardAPIs.Todaytransactioncount()
    .then(res => {
      console.log("res", res)
      response.status(200).send(res)

    })
    .catch(err => {
      response.status(err.status).json(err.error);
    })
});

router.post("/getusercounttotal", cors(), (request, response) => {
  console.log("res")
  dashboardAPIs.usercounttotal()
    .then(res => {
      console.log("res", res)
      response.status(200).send(res)

    })
    .catch(err => {
      response.status(err.status).json(err.error);
    })
});

router.post("/getwalletcounttotal", cors(), (request, response) => {
  console.log("res")
  dashboardAPIs.walletcounttotal()
    .then(res => {
      console.log("res", res)
      response.status(200).send(res)

    })
    .catch(err => {
      response.status(err.status).json(err.error);
    })
});

router.post("/gethighestHitConsumedAPICount", cors(), async (request, response) => {
  var result = await dashboardAPIs.getHighestConsumedHitsAPI();
  console.log(result)
  if (result.statusCode == 400) {
    response.status(400).json(result);
  } else {
    response.status(result.statusCode).json(result);
  }

})
router.post("/TotalnoofAPIserving", cors(), async (request, response) => {
  var result = await dashboardAPIs.TotalNumberOfAPIserving();
  console.log(result)
  if (result.statusCode == 400) {
    response.status(400).json(result);

  } else {
    response.status(result.statusCode).json(result);
  }

})

//DASHBOARD APIs 
router.post("/getFamilyCount", cors(), (request, response) => {
  familyCount.familyCount(function (error, result) {
    // console.log("errror======>",error);
    if (error) {
      response.status(error.status).json({
        result
      });
    } else {
      response.json({
        result
      });
    }
  });
});


// router.post("/getFamilyCounts", cors(), (req, res, next) => {

//   return new Promise(function(resolve, reject) {

//       familyCount
//           .familyCount()
//           .then(result => {
//               res.status(200).json({
//                   A: result.value
//               })

//           })
//           .catch(err => res.status(err.status).json({
//               message: err.message
//           }));
//         });
//       });

router.post("/getDeviceCount", cors(), (request, response) => {
  deviceCount.getDeviceCount(function (error, result) {
    // console.log("errror======>",error);
    if (error) {
      response.status(error.status).json({
        error
      })
      console.log("error");
    } else {
      response.json({
        result
      });
      console.log("result")
    }
  });
});

router.post("/getDeviceCount", cors(), (request, response) => {
  deviceCount.getDeviceCount(function (error, result) {
    // console.log("errror======>",error);
    if (error) {
      response.status(error.status).json({
        error
      })
      console.log("error");
    } else {
      response.json({
        result
      });
      console.log("result")
    }
  });
});

router.post("/getKYCcount", cors(), (request, response) => {
  getKYCCount.getKYCCount(function (error, result) {
    if (error) {
      response.status(error.status).json({
        error
      })
    } else {
      response.json({
        result
      })
    };
  });
});

router.post("/getLeastHitConsumedAPICount", cors(), async (request, response) => {
  var result = await dashboardAPIs.getLeastConsumedHitsAPI();
  console.log(result)
  if (result.statusCode == 400) {
    response.status(400).json(result);

  } else {
    response.status(result.statusCode).json(result);
  }

})

router.post("/getActionBillPaymentCountByStatus", cors(), async (request, response) => {
  var result = await dashboardAPIs.getActionBillPaymentCountByStatus();
  console.log(result)
  if (result.statusCode == 400) {
    response.status(400).json(result);

  } else {
    response.status(result.statusCode).json(result);
  }

})
router.post("/getActionBillPaymentVerifyCountByStatus", cors(), async (request, response) => {
  var result = await dashboardAPIs.getActionBillPaymentVerifyCountByStatus();
  console.log(result)
  if (result.statusCode == 400) {
    response.status(400).json(result);

  } else {
    response.status(result.statusCode).json(result);
  }

})

router.post("/getRecentBillHistoryCountByStatus", cors(), async (request, response) => {
  var result = await dashboardAPIs.getRecentBillHistoryCountByStatus();
  console.log(result)
  if (result.statusCode == 400) {
    response.status(400).json(result);

  } else {
    response.status(result.statusCode).json(result);
  }

})

router.post("/getActionBillPaymentCountByTransStatus", cors(), async (request, response) => {
  var result = await dashboardAPIs.getActionBillPaymentCountByTransStatus();
  console.log(result)
  if (result.statusCode == 400) {
    response.status(400).json(result);

  } else {
    response.status(result.statusCode).json(result);
  }

})
router.post("/getActionBillPaymentVerifyCountByTransStatus", cors(), async (request, response) => {
  var result = await dashboardAPIs.getActionBillPaymentVerifyCountByTransStatus();
  console.log(result)
  if (result.statusCode == 400) {
    response.status(400).json(result);

  } else {
    response.status(result.statusCode).json(result);
  }

})

router.post("/getRecentBillHistoryCountByTransStatus", cors(), async (request, response) => {
  var result = await dashboardAPIs.getRecentBillHistoryCountByTransStatus();
  console.log(result)
  if (result.statusCode == 400) {
    response.status(400).json(result);

  } else {
    response.status(result.statusCode).json(result);
  }

})


router.post("/getTotalNodesCount", cors(), async (request, response) => {
  var result = await dashboardAPIs.getAppNodesCount();
  console.log(result)
  if (result.statusCode == 400) {
    response.status(400).json(result);

  } else {
    response.status(result.statusCode).json(result);
  }

})

router.post("/getAllAPIStatusCount", cors(), async (request, response) => {
  var result = await dashboardAPIs.getAllAPIStatusCount();
  console.log(result)
  if (result.statusCode == 400) {
    response.status(400).json(result);

  } else {
    response.status(result.statusCode).json(result);
  }

})

router.post("/getAllAPITransStatusCount", cors(), async (request, response) => {
  var result = await dashboardAPIs.getAllAPITransStatusCount();
  console.log(result)
  if (result.statusCode == 400) {
    response.status(400).json(result);

  } else {
    response.status(result.statusCode).json(result);
  }

})
router.post("/totalAmountRequested", cors(), (request, response) => {
  dashboardAPIs.getTotalRequestAmountCount(request.body, function (error, result) {
    console.log("totalAmountRequested", result)
    if (error) {
      response.status(error.status).json({
        status: error.status,
        message: error
      });
    } else {
      response.status(result.status).json({
        status: result.status,
        total_Amount: result.data ? result.data : 0
      });
    }
  });
});


router.post("/requestMoneyPendingStatus", cors(), (request, response) => {
  dashboardAPIs.getPendingStatusAmountCount(request.body, function (error, result) {
    console.log("requestMoneyPendingStatus", result)
    if (error) {
      response.status(error.status).json({
        status: error.status,
        message: error
      });
    } else {
      response.status(result.status).json({
        status: result.status,
        total_pendingAmount: result.amount ? result.amount : 0,
        total_pendingStatus_Count: result.statusCount
      });
    }
  });
});


router.post("/requestMoneyPaidStatus", cors(), (request, response) => {
  dashboardAPIs.getPaidStatusAmountCount(request.body, function (error, result) {
    console.log("requestMoneyPaidStatus", result)
    if (error) {
      response.status(error.status).json({
        status: error.status,
        message: error
      });
    } else {
      response.status(result.status).json({
        status: result.status,
        total_paidAmount: result.amount ? result.amount : 0,
        total_paidStatus_Count: result.statusCount
      });
    }
  });
});


router.post("/requestMoneyDeleted", cors(), (request, response) => {
  dashboardAPIs.getActiveRequestStatusCount(request.body, function (error, result) {
    console.log("requestMoneyDeleted", result)
    if (error) {
      response.status(error.status).json({
        status: error.status,
        message: error
      });
    } else {
      response.status(result.status).json({
        status: result.status,
        total_ActiveRequest_Amount: result.amount ? result.amount : 0,
        total_ActiveRequest_Count: result.statusCount
      });
    }
  });
});


router.post("/requestMoneyNotDeleted", cors(), (request, response) => {
  dashboardAPIs.getNonActiveRequestCount(request.body, function (error, result) {
    console.log("requestMoneyNotDeleted", result)
    if (error) {
      response.status(error.status).json({
        status: error.status,
        message: error
      });
    } else {
      response.status(result.status).json({
        status: result.status,
        total_NonActiveRequest_Amount: result.amount ? result.amount : 0,
        total_NonActiveRequest_Count: result.statusCount
      });
    }
  });
});

router.post("/apiResponseTime", cors(), (request, response) => {
  dashboardAPIs.getapiResponseTime(request.body, function (error, result) {
    console.log("apiResponseTime", result)
    if (error) {
      response.status(error.status).json({
        status: error.status,
        message: error.error
      });
    } else {
      response.status(result.status).json({
        status: result.status,
        api: result.data
      });
    }
  });
});

/**
 * @author: Sandhya Parkar
 * @version: 1.0.0
 * @date: November 20 , 2018
 * @Description: Unique users count accessing the portal.
 */
router.post("/userCount", cors(), (request, response) => {
  console.log("abc")
  dashboardAPIs.getUserCount(request, function (error, result) {
    console.log(result)
    if (error) {
      response.status(error.statusCode).json({
        status: result.statusCode,
        message: error
      });
    } else {
      response.status(result.statusCode).json({
        status: result.statusCode,
        data: result.data
      });
    }
  });
});


/**
 * @author: Sandhya Parkar
 * @version: 1.0.0
 * @date: November 20 , 2018
 * @Description: Wallet users count by status.
 */
router.post("/walletUserCount", cors(), (request, response) => {

  dashboardAPIs.getWalletUserCountByStatus(request, function (error, result) {
    console.log(result)
    if (error) {
      response.status(error.statusCode).json({
        status: result.statusCode,
        message: error
      });
    } else {
      response.status(result.statusCode).json({
        status: result.statusCode,
        data: result.data
      });
    }
  });
});


router.post("/getWalletBalance", cors(), (request, response) => {

  dashboardAPIs.getWalletBalance(function (error, result) {
    console.log(result)
    if (error) {
      response.status(error.status).json({
        status: error.status,
        message: error
      });
    } else {
      response.status(result.status).json({
        status: result.status,
        total_wallet_balance: result.data
      });
    }
  })
})
router.post("/getUtilityPayment", cors(), (request, response) => {

  dashboardAPIs.getUtilityPayment(function (error, result) {
    console.log(result)
    if (error) {
      response.status(error.status).json({
        status: error.status,
        message: error
      });
    } else {
      response.status(result.status).json({
        status: result.status,
        total_count: result.data
      });
    }
  })
})
router.post("/getUtilityTransStatus", cors(), (request, response) => {

  dashboardAPIs.getUtilityTransStatus(function (error, result) {
    console.log(result)
    if (error) {
      response.status(error.status).json({
        status: error.status,
        message: error
      });
    } else {
      response.status(result.status).json({
        status: result.status,
        total_count: result.data
      });
    }
  })
})

router.post("/getLoadTransStaus", cors(), (request, response) => {

  dashboardAPIs.getLoadTransStaus(function (error, result) {
    console.log(result)
    if (error) {
      response.status(error.status).json({
        status: error.status,
        message: error
      });
    } else {
      response.status(result.status).json({
        status: result.status,
        total_count: result.data
      });
    }
  })
})

router.post("/getwallettowalletTransStatus", cors(), (request, response) => {

  dashboardAPIs.getwallettowalletTransStatus(function (error, result) {
    console.log(result)
    if (error) {
      response.status(error.status).json({
        status: error.status,
        message: error
      });
    } else {
      response.status(result.status).json({
        status: result.status,
        total_count: result.data
      });
    }
  })
})

router.post("/getwallettoBankTransStatus", cors(), (request, response) => {

  dashboardAPIs.getwallettoBankTransStatus(function (error, result) {
    console.log(result)
    if (error) {
      response.status(error.status).json({
        status: error.status,
        message: error
      });
    } else {
      response.status(result.status).json({
        status: result.status,
        total_count: result.data
      });
    }
  })
})

router.post("/getTotalTransCount", cors(), (request, response) => {

  dashboardAPIs.getTotalTransCount(function (error, result) {
    console.log(result)
    if (error) {
      response.status(error.status).json({
        status: error.status,
        message: error
      });
    } else {
      response.status(result.status).json({
        status: result.status,
        total_count: result.data
      });
    }
  })
})
router.post("/logout", cors(), (request, response) => {
  addFunctionsLogout.logoutValidation(request, function (result, error) {
    transactionCountDB.addTransactionCount("logout", result.success);
    if (result.success == true) {
      var time = setresponseTime.updateAPIResponseTime('logout', transcationType.STATUS_SUCCESS, transcationType.STATUS_CREATE, ((response.req._startTime)), new Date());
      response.status(result.statusCode).json(result);
    } else {
      var time = setresponseTime.updateAPIResponseTime('logout', transcationType.STATUS_FAILED, transcationType.STATUS_CREATE, ((response.req._startTime)), new Date());
      response.status(400).json(result);
    }
  });
})

//schedular
router.post("/schedular",cors(),async (request,response) => {
 var result= await actionVerify.actionVerifyTransaction() 
    if (error) {
      response.status(error.status).json({
        message: error
      });
    } else {
      response.json({
        status: result.status,
        message: result.message
      });
    }

})
module.exports = router;
