
'use strict';
const mysqlConnection = require('./../mysql_connection/query_execute');
const query = require('./../mysql_connection/quiries')
const mypassbook = require('./../functions/mypassbook')
const readvalidationprofile = require('../functions/readProfile');
const getnotification = require('./../functions/getnotification');
const Utils = require('../util/utils')

module.exports = {
    readDataTestValidation: readDataTestValidation,
    readprofilevalidation: readprofilevalidation,
    readpassbookvalidation:readpassbookvalidation,
    getnotificationvalidation:getnotificationvalidation
}

function readDataTestValidation(req, callback) { 
   
    const key = req.body.key;
    if (!key || !key.trim()) {
        err = {
            "status": 400,
            "message": 'fields should not be empty'
        }
        callback(err, "");
    } else {
        readData.readData(key)
        .then(function (result) {
            callback("", result);
        }).catch(function (err) {
            callback(err, "");
        })
    }
}
function readprofilevalidation(req, callback) {

    const id = req.body.id;
    
  var arr = [id]


    if (!id || !id.trim()) {
        err = {
            "status": 400,
            "message": 'fields should not be empty'
        }
        callback(err, "");
    } else {
         readvalidationprofile.readProfile(arr)
        .then(function (result) {
            console.log("result",result)
            callback("", result);
        }).catch(function (err) {
            callback(err, "");
        })
    }
}

function readpassbookvalidation (req, callback) {

    const user_language = req.headers.user_language ? req.headers.user_language : "en"
    const access_token = req.headers.access_token ?req.headers.access_token :''
    const days = req.body.days
    const page = req.body.page
    
  


    if (!user_language || !access_token ||!days ||!page||!user_language.trim()||!access_token.trim()||!days.trim()||!page.trim()) {
        err = {
            "status": 400,
            "message": 'fields should not be empty'
        }
        callback(err, "");
    } else {
        mypassbook.mypassbookdb(user_language,access_token,days,page).then(function(result){
            console.log("result",result)
            callback("",result)
        })
    }
}


function getnotificationvalidation (req, callback) {

    const user_language = req.headers.user_language ? req.headers.user_language : "en"
    const access_token = req.headers.access_token ?req.headers.access_token :''
    const page = req.body.page
    
  


    if (!user_language || !access_token  ||!page||!user_language.trim()||!access_token.trim()||!page.trim()) {
        err = {
            "status": 400,
            "message": 'fields should not be empty'
        }
        callback(err, "");
    } else {
        getnotification.getnotificationdb(user_language,access_token,page).then(function(result){
            console.log("result",result)
            callback("",result)
        })
    }
}
