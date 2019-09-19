const mysqlConnection = require('../mysql_connection/query_execute');
const query = require('../mysql_connection/quiries');
module.exports = {
    getTransactionCountOfAPIS: getTransactionCountOfAPIS,

};
function getTransactionCountOfAPIS(callback) {
    var params = []
    queryExcute.dbconfig(sqlQuery.getTransactionCountOfAPIS, params).then((get) => {
        if (get.code == 201) {
            
            var getTransactionCountOfAPIS = {
                
            }
            callback("", {
                status: get.code,
                getTransactionCountOfAPIS: getTransactionCountOfAPIS
            });
        } else {
            callback({
                status: get.code,
                result: get
            }, "");
        }

    })
}
function successCount( result, process) {
            var params = [];
            if (result === 200) {
                mysqlConnection.query_execute(query.getAPIHitCounts , params).then((get) => {

                });
                callback("", {
                    status: get.code,
                    getTransactionCountOfAPIS: getTransactionCountOfAPIS
                });
            } else if (result === 400 || result === 401 || result === 404) {
                mysqlConnection.query_execute(query.getAPIHitCounts ,params).then((get) => {

                });
                callback({
                    status: get.code,
                    result: get
                }, "");
            }
        }