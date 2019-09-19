var request = require('request');
var config = require('config');
var api_config = config.get('api_config')
var Utils = require('../../util/utils')
const mysqlConnection = require('../../mysql_connection/query_execute');
const query = require('../../mysql_connection/quiries')
module.exports ={
    successcount : successcount

}
async function successcount(tablename,result,process){
    switch (process) {
        case "add":
            var params = [tablename];
            if (result === 200) {
              var insertdata = await mysqlConnection.insert_query(query.insertcount, params)
            } else if (result === 400 || result === 401 || result === 404) {
                queryExcute.dbconfig(sqlQuery.addFailureCount, params).then((connection) => {

                });
            }
            break;

        case "read":
            var params = [WIDGETNAME];
            if (result === 200) {


                queryExcute.dbconfig(sqlQuery.readSuccessCount, params).then((connection) => {

                })
            } else if (result === 400 || result === 401 || result === 404) {
                queryExcute.dbconfig(sqlQuery.readFailureCount, params).then((connection) => {

                })
            }
            break;
        case "update":
            var params = [WIDGETNAME]
            if (result == 200) {
                queryExcute.dbconfig(sqlQuery.updateSuccessCount, params).then((connection) => {

                })
            } else if (result == 400 || result == 401 || result == 404) {
                queryExcute.dbconfig(sqlQuery.updateFailureCount, params).then((connection) => {

                })
            }
            break;
        case "delete":
            var params = [WIDGETNAME]
            if (result == "200") {
                queryExcute.dbconfig(sqlQuery.deleteSuccessCount, params).then((connection) => {

                })
            } else if (result == 400 || result == 401 || result == 404) {
                queryExcute.dbconfig(sqlQuery.deleteFailureCount, params).then((connection) => {

                })
            }
            break;
        case "summary":
            var params = [WIDGETNAME]
            if (result == "200") {
                queryExcute.dbconfig(sqlQuery.summarySuccessCount, params).then((connection) => {

                })
            } else if (result == 400 || result == 401 || result == 404) {
                queryExcute.dbconfig(sqlQuery.summaryFailureCount, params).then((connection) => {

                })
            }
            break;

        default:
            break;
    }


}