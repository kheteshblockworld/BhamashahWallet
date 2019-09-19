var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'Bhamashah_Wallet'
});
// var connection2 = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'root',
//     database: 'Bhamashah_Wallet'
// });
// connection.connect(function (err) {
//     if (err) {
//         console.error('error connecting: ' + err.stack);
//         return;
//     }
//     console.log('connected as id ' + connection.threadId);
// });

connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
});
/* Begin transaction */
connection.beginTransaction()

try{
   connection.query('INSERT INTO test1 (id,data) VALUES ?' ,[[[1,"test1"]]], function (err, result) {
        if (err) {
            throw new Error("qwerty1");
        }
        console.log('Transaction Complete.insert 1');
      
    })
    // /update test set data = ? where id = ? ' ,[[["qwerty",1]]]
    connection.query('INSERT INTO test (id,data) VALUES ?',[[[2,"test2"]]], function (err, result) {
        if (err) {
            throw new Error("qwerty2");
        }
        console.log('Transaction Complete.insert 2');
        
    })
        connection.query('INSERT INTO test1 (id,data) VALUES ?',[[3,"test3"]], function (err, result) {
           
            try{
            if (err) {
                    throw new Error("qwerty3");
            }
            console.log('Transaction Complete. insert 3');

            connection.commit(function (err) {
                if (err) {
                    connection.rollback(function () {
                        throw err;
                    });
                }
                console.log('Transaction Complete.');
                connection.end();
            });
        }catch(err){
            console.log(err)
            connection.rollback(function (err,res) {
                console.log("success",err,res)
            })
        }
    });
} catch(err){
    console.log(err)
    connection.rollback(function (err,res) {
        console.log("success",err,res)
    })
}