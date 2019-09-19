var request = require('request');

module.exports = {
    networkRequest: networkRequest,
    unEncryptedNetworkReq: unEncryptedNetworkReq,
    RppnetworkRequest: RppnetworkRequest,
    RppnetworkRequestDecrypt: RppnetworkRequestDecrypt
}
// var Networkconfig= dbConfig
/**
 * @author: Sathiyan Baskaran
 * @version: 1.0.0
 * @date: October 17, 2018
 * @Description: Common network Function for encrypted network request.
 */
function networkRequest(data, url, subUrl) {
    return new Promise(async(resolve, reject) => {
        var resUrl = url + '/' + subUrl;
        console.log("resUrl==========>", resUrl);
        // Set the headers
        var headers = {
            'cache-control': 'no-cache',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        // Configure the request
        var options = {
            url: resUrl,
            method: 'POST',
            headers: headers,
            form: {
                'encData': data
            }
        }
        // Start the request
        request(options, function (error, response, body) {
            // Print out the response body
            console.log(body)
            resolve(body);
        })
    })
}
/**
 * @author: Sathiyan Baskaran
 * @version: 1.0.0
 * @date: October 17, 2018
 * @Description: Common network Function for encrypted network request for RPP Payment Gateway.
 */
function RppnetworkRequest(data, url, subUrl) {
    return new Promise((resolve, reject) => {
        var resUrl = url + '/' + subUrl;
        console.log("resUrl==========>", resUrl);
        // Set the headers
        var headers = {
            'cache-control': 'no-cache',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        // Configure the request
        var options = {
            url: resUrl,
            method: 'POST',
            headers: headers,
            form: {
                'toBeEncrypt': data
            }
        }
        // Start the request
        request(options, function (error, response, body) {
            // Print out the response body
            console.log(body)
            resolve(body);
        })
    })
}
/**
 * @author: Sathiyan Baskaran
 * @version: 1.0.0
 * @date: October 17, 2018
 * @Description: Common network Function for decrypt network request for RPP Payment Gateway.
 */
function RppnetworkRequestDecrypt(data, url, subUrl) {
    return new Promise((resolve, reject) => {
        var resUrl = url + '/' + subUrl;
        console.log("resUrl==========>", resUrl);
        // Set the headers
        var headers = {
            'cache-control': 'no-cache',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        // Configure the request
        var options = {
            url: resUrl,
            method: 'POST',
            headers: headers,
            form: {
                'toBeDecrypt': data
            }
        }
        // Start the request
        request(options, function (error, response, body) {
            // Print out the response body
            console.log(body)
            resolve(body);
        })
    })
}
/**
 * @author: Sathiyan Baskaran
 * @version: 1.0.0
 * @date: October 17, 2018
 * @Description: Common Function for non encrypted network request.
 */
function unEncryptedNetworkReq(data, url, subUrl) {
    return new Promise((resolve, reject) => {
        var resUrl = url + '/' + subUrl;
        console.log("resUrl==========>", resUrl);
        // Set the headers
        var headers = {
            'cache-control': 'no-cache',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        // Configure the request
        var options = {
            url: resUrl,
            method: 'POST',
            headers: headers,
            form: {
                'MERCHANTCODE': data.MERCHANTCODE,
                'SERVICEID': data.SERVICEID,
                'PRN': data.PRN
            }
        }
        // Start the request
        request(options, function (error, response, body) {
            // Print out the response body
            console.log(body)
            resolve(body);

        })
    })
}