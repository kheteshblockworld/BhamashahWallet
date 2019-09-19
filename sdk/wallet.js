var config = require('config');
var dbConfig = config.get('multichainConfig');
let multichain = require("multichain-node")(dbConfig);
let coin = config.get('coin');

/**
 * @author: Rakesh C
 * @version: 1.0.0
 * @date: October 12, 2018
 * @Description: Wallet related functions will intract with multichian 
 */


/** @module GEYKEYS*/
module.exports = {
    createKeys: createKeys,
    importaddres: importaddres,
    grantPermission: grantPermission,
    issueAssets: issueAssets,
    sendAssets: sendAssets,
    getAddressBalance: getAddressBalance,
    transactionHistory: transactionHistory,
    getTransactionDetails: getTransactionDetails
}

/** @function createKeys 
 * add patient record data into blockchain.
 */
function createKeys() {
    return new Promise((resolve, reject) => {
        multichain.createKeyPairs((err, key) => {
            if (err) {
                throw err;
                return reject({
                    status: 400,
                    response: err
                });
            }
            console.log(key);
            return resolve({
                status: 200,
                response: key
            });
        })
    })
}

/** @function importaddres
 * add patient record data into blockchain.
 */
function importaddres(address) {
    return new Promise((resolve, reject) => {

        multichain.importAddress({
            "address": address,
            "label": "",
            "rescan": false
        }, (err, key) => {
            console.log(err);
            if (err) {

                return reject({
                    status: 400,
                    response: err
                });
            }
            console.log(key);
            return resolve({
                status: 200,
                response: key
            });
        })
    })
}

/** @function grantPermission 
 * add patient record data into blockchain.
 */
function grantPermission(address) {
    return new Promise((resolve, reject) => {

        multichain.grant({
            addresses: address,
            permissions: "issue,receive,send"
        }, (err, key) => {
            if (err) {
                reject({
                    status: 400,
                    response: err
                });
            }
            console.log(key);
            resolve({
                status: 200,
                response: key
            });
        })
    })
}

/** @function issueAssets 
 * add patient record data into blockchain.
 */
function issueAssets(address, qty, description) {
    return new Promise((resolve, reject) => {
        console.log(address, qty)
        multichain.issueMore({
            address: address,
            asset: coin,
            qty: qty,
            units: 0.01,
            details: {
                "purpose": description
            }
        }, (err, result) => {
            if (err) {
                return reject({
                    status: 400,
                    response: err
                });
            }
            return resolve({
                status: 200,
                response: result
            });
        })
    })
}

function sendAssets(fromAddress, toAddress, qty, privateKey) {
    return new Promise((resolve) => {
        let rawTxData = {
            from: fromAddress,
            amounts: {}
        }
        rawTxData.amounts[toAddress] = {
            "BMCOIN10": qty
        }

        console.log(rawTxData, "rawdata")
        multichain.createRawSendFrom(rawTxData, (err, result) => {
            if (err) {
                return resolve({
                    status: 400,
                    response: err
                });
            }
            var signtrans = {
                hexstring: result,
                parents: [],
                privatekeys: [privateKey]

            }
            multichain.signRawTransaction(signtrans, (err, result1) => {
                if (err) {
                    return resolve({
                        status: 400,
                        response: err
                    });
                }
                multichain.sendRawTransaction({
                    hexstring: result1.hex

                }, (err, result3) => {
                    console.log(result3, "result3")
                    if (err) {
                        return resolve({
                            status: 400,
                            response: err
                        });
                    }
                    return resolve({
                        status: 200,
                        response: result3
                    });
                })

            })
        })
    })
}

function getAddressBalance(address) {
    return new Promise((resolve, reject) => {
        multichain.getAddressBalances({
            address: address
        }, (err, result) => {
            console.log(err, result);

            if (err) {
                resolve({
                    status: 400,
                    response: err
                });
            }
            if (result.length != 0) {
                for (i = 0; i < result.length; i++) {
                    if (result[i].name == coin)
                        resolve({
                            status: 200,
                            response: result[i].qty
                        });
                }
            } else {
                resolve({
                    status: 200,
                    response: 0
                });
            }
        })
    })
}

function transactionHistory(address) {
    return new Promise(function (resolve, reject) {
        multichain.listAddressTransactions({
            address: address
        }, (err, result) => {
            console.log(err, result);
            if (err) {
                reject({
                    status: 500,
                    response: err
                });
            } else {
                resolve({
                    status: 200,
                    response: result
                });
            }
        })
    })
}

function getTransactionDetails(txID) {
    return new Promise(function (resolve, reject) {
        multichain.getAssetTransaction({
            asset: "assetbhamashah",
            txid: txID
        }, (err, result) => {
            console.log(err, result);
            if (err) {
                reject({
                    status: 500,
                    response: err
                });
            } else {
                resolve({
                    status: 200,
                    response: result
                });
            }
        })
    })
}