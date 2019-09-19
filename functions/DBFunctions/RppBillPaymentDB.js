/**
 * @author: Sathiyan B
 * @version: 1.0.0
 * @date: December 22, 2018
 * @Description: Tokens genetarion and check tokens function intract with mySQL DB.
 */

const mysqlConnection = require('../../mysql_connection/query_execute');
const query = require('../../mysql_connection/quiries');


module.exports = {
    addTranscation: addTranscation,
    findTranscation: findTranscation,
    updateTranscation: updateTranscation
}


async function addTranscation(trans_status,PRN,connection = '') {
   
    var userID = await mysqlConnection.query_execute(query.updateTXStatus, [trans_status,PRN], connection);
    console.log("userID====>",userID);
    if (userID.data.affectedRows == '1' && userID.message == "Success") {
        return true
    }
        return false;

}
async function findTranscation(PRN,connection = '') {
    var transData = await mysqlConnection.query_execute(query.findTranscationid, [PRN], connection);
    var transID = transData.data[0].id;
        if (transData.data.length == 0) {
            return false
        }
        return transID
}
async function updateTranscation(updateTransTab,connection = '') {
    var  updateTranscationBillPaymentMeta = await mysqlConnection.query_execute(query.updateTranscationBillPaymentMeta, updateTransTab, connection);
    if(updateTranscationBillPaymentMeta.data.affectedRows == '1' && updateTranscationBillPaymentMeta.message == 'Success'){
             return true;
    }
    return false;
}


