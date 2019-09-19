'use strict';

var bcSdk = require('../../sdk/query');
const mysqlConnection = require('../../mysql_connection/query_execute');
const query = require('../../mysql_connection/quiries')
var bcSdk = require('../../sdk/query');

module.exports = {

    readProfile : readProfile,
    readData: readData
}


/**
 * A module that will add data into the blockchain!
 * @module readData
 */
/** Add Data into blockchain.*/

// exports.readData = (key) => {
//     return new Promise((resolve, reject) => {
//         bcSdk.readData(key)
//         .then(function (result) {
//             return resolve({
//                 "status": 200,
//                 "data": result.response
//             })
//         }).catch(err => {
//             reject({
//                 "status": 500,
//                 "message": 'Something went wrong please try again later!!'
//             });
//         });
//     });
// }

function readData(key){
    return new Promise((resolve, reject) => {
        bcSdk.readData(key)
        .then(function (result) {
            if(result.status == 200){
                return resolve({
                    "status": 200,
                    "data": result.response
                })
            }else{
                return resolve({
                    "status": 400,
                    "data": result.response
                })
            }
            
        }).catch(err => {
             resolve({
                "status": 500,
                "message": 'Something went wrong please try again later!!'
            });
        });
    });
}

function readProfile(params) {
    return new Promise((resolve, reject) => {
       console.log("inside addProfile")

        mysqlConnection.query_execute(query.readuser, params).then(function (get,err) {
            console.log("params", get.data.length)
            console.log("get.status",get.status)
            var read = []
            // var name = get.data[0].name
            // console.log("name",name)
            // var email = get.data[0].email
            // console.log("email",email)
            // var mobile = get.data[0].sso_mobile
            // console.log("mobile",mobile)
            if(get.data.length==0){
                return resolve({
                    "status": 401,
                    "data": "record was not found please check the id"
                })
            }
            
            
           if (get.status == 200) {
            var data = {
                "name":get.data[0].name,
                "email":get.data[0].email,
                "mobile":get.data[0].sso_mobile
            }
            read.push(data)
            console.log("data",read)
            console.log("get",get)
              return resolve({
                "status":200,
                data : data
                  })
              }
         else {
                
                return reject(err)
            }
            
        })
    })
}