var mysql = require('mysql');
var config = require('config');
var dbConfig = config.get('mysqlConnection');
//var promises = require('es6-promise').Promise;

exports.getConnection = () => {
    return new Promise((resolve) => {

        var connection = mysql.createConnection(dbConfig)
        connection.connect(function (err) {
            if (err) {
                console.log(err)
                return resolve({
                    status: 501,
                    message: "connection issuse"
                });
            }
            return resolve(connection);
        })
    })
}

exports.query_execute = (query, params, connection = "") => {
    return new Promise((resolve) => {

       if (connection) {
           console.log(connection.threadId,params)
           connection.query(query, params, function (error, result, fields) {
               if (error) {
                   resolve({
                       status: 401,
                       data: error,
                       message: "Syntax error"
                   });
               }
               resolve({
                   status: 200,
                   data: result,
                   message: "Success"
               });
           })
       }else{
       connection = mysql.createConnection(dbConfig)
       connection.connect(function (err) {
           if (err) {
               console.log(err)
               return resolve({
                   status: 501,
                   data: "",
                   message: "connection issues"
               });
           }
           console.log(query, params)
           connection.query(query, params, function (error, result, fields) {
               if (error) {
                   resolve({
                       status: 401,
                       data: error,
                       message: "Syntax error"
                   });
               }
               resolve({
                   status: 200,
                   data: result,
                   message: "Success"
               });
               connection.end();
           });
       });
    }
    })

}


exports.insert_query = (query, params, connection = "") => {
    return new Promise((resolve) => {

        if (connection) {
            connection.query(query, [
                [params]
            ], function (error, result, fields) {
                if (error) {
                    resolve({
                        status: 401,
                        message: "Syntax Error",
                        data: error
                    });
                }
                resolve({
                    status: 200,
                    data: result,
                    message: "success"
                });
            })
        }else {
        connection = mysql.createConnection(dbConfig)
        connection.connect(function (err) {
            if (err) {
                console.log(err)
                return resolve({
                    status: 501,
                    data: "",
                    message: "connection issue"
                });
            }
            console.log(query, params)
            connection.query(query, [
                [params]
            ], function (error, result, fields) {
                if (error) {
                    resolve({
                        status: 401,
                        message: "Syntax Error",
                        data: error
                    });
                }
                resolve({
                    status: 200,
                    data: result,
                    message: "success"
                });
                connection.end();
            });
        });
    }
    })
}