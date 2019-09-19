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
    WalletToBank: WalletToBank
}

async function WalletToBank(userId, amount) {

    var bnkAddress = await WalletDB.getAddressesByMobile(1234567890)
    var bckey = await UserDB.getBckeyForUser(userId) 
    var keys = await sdk.readData(bckey)
    console.log(keys, "keys")
    var issueAsset = await wallet.sendAssets(keys.response.address,bnkAddress,amount,keys.response.privkey)
    if (issueAsset.status == 200) {
        return {action:"SUCCESS",
        txid:issueAsset.response}
    } else {
        return false
    }

}