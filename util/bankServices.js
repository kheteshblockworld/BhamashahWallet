'use strict';
var request = require('request');
var config = require('config');
var api_config = config.get('api_config')
var yesbank_url = config.get('yesbank_url')


module.exports = {
    bankServices: bankServices
}
function bankServices(params, callback) {
        var options = {
            url: yesbank_url,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            json: params
        };

        request(options, function (err, res, body) {
            
            console.log(body);

            if (!body) {
                var err = ({
                     "status": 401,
                     "message":"Please Provide Correct Details"
                 })
                 callback(err)
             } else {
             var jsonRes = ({
                     "status": 200,
                     "message": body
                 })

            callback(jsonRes)
             }
        })
}
