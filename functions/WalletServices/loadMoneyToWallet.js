/**
 * @author: Rakesh C
 * @version: 1.0.0
 * @date: November 12, 2018
 * @Description: Generate will intract with wallet SDK to create Wallet.
 */
const multichianWallet = require('./generateKeys');
const UserDB = require('../../functions/DBFunctions/UsersDB')
const Utils = require('../../util/utils')
const wallet = require('../../sdk/wallet');
const sdk = require('../../sdk/query');
const WalletDB = require('../DBFunctions/WalletDB')
const YesBankServices = require('../YesBankServices/yesBankServices')


module.exports = {
    loadMoney: loadMoney
}

async function loadMoney(address, amount, ) {

    var bnkAddress = await WalletDB.getAddressesByMobile(9600192672)

    var balance = await wallet.getAddressBalance(bnkAddress)

    if (balance.response < amount) {
        await wallet.issueAssets(bnkAddress, amount, "")
    }
    var keys = await sdk.readData("9600192672_a1b2c3")
    console.log(keys, "keys")
    var issueAsset = await wallet.sendAssets(bnkAddress, address, amount, keys.response.privkey)
    if (issueAsset.status == 200) {
        return {action:"SUCCESS",
        txid:issueAsset.response}
    } else {
        return false
    }
}