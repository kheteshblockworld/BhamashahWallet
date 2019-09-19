var request = require('request');
var config = require('config');
var api_config = config.get('api_config')
var Utils = require('../../util/utils')
const mysqlConnection = require('../../mysql_connection/query_execute');
const query = require('../../mysql_connection/quiries')

module.exports = {
    deviceCount :  deviceCount,
    getDeviceCount : getDeviceCount
}

function deviceCount(process) {
        switch (process) {
            case "mobile":
                var params = ['MOBILE'];
                mysqlConnection.query_execute(query.MobiledeviceCount, params).then((connection) => {
    
                    return connection;
                })
    
                break;
    
            case "desktop":
                var params = ['DESKTOP'];
                mysqlConnection.query_execute(query.DesktopdeviceCount, params).then((connection) => {
    
                    return connection;
                })
                break;
    
            default:
                break;
        }
    }

    function getDeviceCount(callback){
    
     mysqlConnection.query_execute(query.getDeviceCount).then(function(get) {
        console.log(get)
            if (get.code =200) {
                var res = {
                            status : get.status,
                            data :  [{"device":"Mobile",
                            "count" : get.data[0].mobile_count},
                            {"device":"Desktop",
                            "count" : get.data[0].desktop_count}],
                            message : get.message
                       };
               callback("", res); } 
            else {
                var err = {
                status: get.status,
                error : get.data,
                message: get.message
            };
         callback(err, "") }
        })
    }
    