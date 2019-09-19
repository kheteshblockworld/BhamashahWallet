'use strict';

const mysqlConnection = require('./../mysql_connection/query_execute');
const query = require('./../mysql_connection/quiries')
var bcSdk = require('../sdk/invoke');

/**
 * A module that will add data into the blockchain!
 * @module addData
 */
/** Add Data into blockchain.*/


module.exports = {

    readProfile : readProfile
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
                console.log("hari")
                return reject(err)
            }
            
        })
    })
}