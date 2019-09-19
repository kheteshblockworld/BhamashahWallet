'use strict';

var bcSdk = require('../../sdk/invoke');
var uniqid = require('uniqid');


/**
 * A module that will add data into the blockchain!
 * @module addData
 */
/** Add Data into blockchain.*/

exports.addData = (key, value) => {
    return new Promise((resolve, reject) => {
        const addData = ({
            key: key,
            value: value
        });
        addData.value.id = uniqid();

        bcSdk.addData(addData).then(function (result) {
            if(result.status == 200){
            return resolve({
                "status": 200,
                "message": "Your Information is stored into blockchain"
            })
        }else{
            return resolve({
                "status": 400,
                "message": result.response
            })
        }
        }).catch(err => {
            reject({
                "status": 500,
                "message": 'Something went wrong please try again later!!'
            });
        });
    });
}