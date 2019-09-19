
/**
 * @author: Rakesh C
 * @version: 1.0.0
 * @date: October 11, 2018
 * @Description: Generate will intract with wallet, invoke and query function to create keys and addresses.
 */

'use strict';

var wallet = require('../../sdk/wallet');
var bcSdk = require('../../sdk/invoke');
const Utils = require('../../util/utils')


/**
 * A module that will add data into the blockchain!
 * @module getKeys
 */
/** Add Data into blockchain.*/

exports.getPubAndPriKeys = (userId,blockchainID) => {
    return new Promise(async (resolve, reject) => {

        var cryptoId = await wallet.createKeys()
        var importaddres = await wallet.importaddres(cryptoId.response[0].address)
        var grantPermission = await wallet.grantPermission(cryptoId.response[0].address)

        console.log("blockchainID",blockchainID)
        var params = {
            "key": blockchainID,
            "value": cryptoId.response[0],
        }

        if (cryptoId.status == 200) {
            bcSdk.addData(params).then(function (result) {
                console.log(result)
                if(result.status == 200){
                    var params = [cryptoId.response[0].address]
                    return resolve({
                        status: 200,
                        addresses: cryptoId.response[0].address
                    });
                }
            }).catch(function (err) {
                console.error(err)
                return reject(err);
            })
        }
        
    });
}