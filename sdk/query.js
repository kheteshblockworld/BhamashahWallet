/**
 * @author: Rakesh C
 * @version: 1.0.0
 * @date: October 10, 2018
 * @Description: Functions will intract with multichian. will handle operations like read, history and audit.
 */

var config = require('config');
var dbConfig = config.get('multichainConfig');
let multichain = require("multichain-node")(dbConfig);
let Utils = require("./../util/utils")


/** @module READDATA*/
module.exports = {
    readData: readData
}

/** @function readData 
 * add patient record data into blockchain.
 */
function readData(args) {

    return new Promise((resolve, reject) => {
        var response;
        var key = args;

        multichain.listStreamKeyItems({
            stream: "DOIT",
            "key": key
        }, (err, res) => {
            console.log(res, "res")
            if (err == null) {
        if(res.length!==0){
                var data = Utils.cnvHexToStr(res[res.length - 1].data)
              
                    console.log(JSON.parse(data));

                    return resolve({
                        status: 200,
                        response: JSON.parse(data)
                    });

                } else {
                    var data = {
                        "message": "data not found!"
                    };
                    return resolve({
                        status: 200,
                        response: data
                    });
                }
            } else {
                return reject({
                    status: 400,
                    response: err
                });
            }

        })

    })
}