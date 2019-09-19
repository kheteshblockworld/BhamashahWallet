const mysqlConnection = require('../../mysql_connection/query_execute');
const query = require('../../mysql_connection/quiries')

module.exports = {
getKYCCount : getKYCCount
}

function getKYCCount (callback) {

mysqlConnection.query_execute(query.getKYCCount).then(function(get) {
    console.log(get)

    if (get.status =200)
    {
        var res = {
            status : get.status,
            data: { 
               "KYC Users Count" : get.data[0].KYCCompletedUsers},
            message: get.message
        }
        callback("", res);
    }

    else {
        var err = {
            status : get.status,
            data: get.data,
            message: get.message
        }
        callback(err, "");
    }
})
}