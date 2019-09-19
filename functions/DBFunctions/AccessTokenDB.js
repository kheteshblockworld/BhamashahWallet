/**
 * @author: Rakesh C
 * @version: 1.0.0
 * @date: October 22, 2018
 * @Description: Tokens genetarion and check tokens function intract with mySQL DB.
 */

const mysqlConnection = require('../../mysql_connection/query_execute');
const query = require('../../mysql_connection/quiries')

module.exports = {
    checkAccessToken: checkAccessToken,
    checkAccessTokenGetID: checkAccessTokenGetID,
    checkTranscationId: checkTranscationId
}


async function checkAccessTokenGetID(accessToken) {
   
    var userID = await mysqlConnection.query_execute(query.find_Access_Token_By_ID, [accessToken])
    if (userID.data.length === 0) {
        return false
    }
    return userID.data[0].user_id

}

async function checkAccessToken(accessToken) {
    var userId = await mysqlConnection.query_execute(query.find_Access_Token_By_ID, [accessToken])

        if (userId.data.length == 0) {
            return false
        }
        console.log(userId,"userId")
        return userId
}

async function checkTranscationId(transaction_id,user_id) {
    console.log(transaction_id,user_id);
    var res = await mysqlConnection.query_execute(query.findTranscationUserid, [transaction_id,user_id])
        if (res.data.length === 0) {
            return false
        }
        return res.data[0]
}
