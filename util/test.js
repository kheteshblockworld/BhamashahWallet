var execPhp = require('exec-php');

var data = {
    "MERCHANTCODE": "",
    "REQTIMESTAMP": Date.now(),
    "PRN": "mz0jq4w7399",
    "AMOUNT": "1",
    "RPPTXNID": "1234567",
    "RPPTIMESTAMP": "",
    "PAYMENTAMOUNT": "1",
    "STATUS": "FAILURE",
    "PAYMENTMODE": "",
    "PAYMENTMODEBID": "",
    "PAYMENTMODETIMESTAMP": "",
    "RESPONSECODE": "",
    "RESPONSEMESSAGE": "",
    "UDF1": "<UDF1>",
    "UDF2": "<UDF2>",
    "UDF3": "<UDF3>",
    "CHECKSUM": "123456789qwertyuiosdfghjklxcvbndfghjrtyu"
}
generateHash(JSON.stringify(data))


function generateHash(req) {
    var data = req;
    execPhp('encryption.php', function (error, php, outprint) {
        php.encryption(data, function (err, result, output, printed) {
            console.log("result======>", result);
            decryptHash(result);
        });
    });
}

function decryptHash(data) {
    execPhp('encryption.php', function (error, php, outprint) {
        php.decryption(data, function (err, result, output, printed) {
            console.log(result)
        });
    });
}