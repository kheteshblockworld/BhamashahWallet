'use strict';

const mysqlConnection = require('./../mysql_connection/query_execute');
const query = require('./../mysql_connection/quiries')


/**
 * A module that will add data into the blockchain!
 * @module updateProfile
 */
/** Add Data into blockchain.*/


module.exports = {

    updateProfile: updateProfile
}

function updateProfile(params) {
    return new Promise((resolve, reject) => {
       console.log("inside addProfile")
       console.log("params", params)
        mysqlConnection.query_execute(query.updateuser, params).then(function (get) {

            if (get.data.affectedRows == 0) {
                return resolve({
                    "status" :401,
                    "message":"record was not found please check the id"
                })
           
            }   
            if (get.code == 201) {
                
                return resolve({
                    "status" :200,
                    "message":"record deleted successfully"
                })
            } else {
               
                return reject(get)
            }
            
        })
    })
}