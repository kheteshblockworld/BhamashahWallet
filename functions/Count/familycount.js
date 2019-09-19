var request = require('request');
var config = require('config');
var api_config = config.get('api_config')
var Utils = require('../../util/utils')
const mysqlConnection = require('../../mysql_connection/query_execute');
const query = require('../../mysql_connection/quiries')

module.exports = {
    familyCount: familyCount
    
}

function familyCount(callback){
        //    return new Promise((resolve, reject) => {
        //    console.log("inside addProfile")
    //  var response;
    
     mysqlConnection.query_execute(query.FamilyCount).then(function(get) {
        // console.log(result)
        console.log(get)
            if (get.code =200) {
                var res = {
                        // 'success': false,
                        status: get.status,
                        result: get.data[0],
                        message: get.message
                       };
               callback("", res); } 
            else {
        //   var getErrMsg = Utils.getErrorMessage(lang, "SUCCESS_SA00")
                var err = {
            //  'success': true,
                status: get.status,
                error : get.data,
                message : get.message

            //  'error': {
            //     //  'code': getErrMsg.code,
            //      'message': result.data,
            //      'status_type': '',
            //      'status_popupmessage_type': ''
            //  },
            };
         callback(err, "") }
        })
    }
    

//                 else {
//                    var value = get.rows;
//                    console.log(value)
//                 }}
//                       })
//                   }// console.log("params", get.data.length)
//                 console.log("get.status",get.status)
//                 var read = []
//                 var name = get.data[0].name
//                 console.log("name",name)
//                 var email = get.data[0].email
//                 console.log("email",email)
//                 var mobile = get.data[0].sso_mobile
//                 console.log("mobile",mobile)
//                 if(get.data.length==0){
//                     return resolve({
//                         "status": 401,
//                         "data": "record was not found please check the id"
//                     })
//                 }
                
                
//                {
//                 var data = {
//                     "familyCounts": get.data,
                 
//                 }
//                 read.push(data)
            
//                 console.log("data",read)
//                 console.log("get",get)
//                   return resolve({
//                     "status":200,
//                     data : data
//                       })
//                   }
//              else {
//                     console.log("err")
//                     return reject(err)
//                 }
                
//             })
//         })
//     }
// if (err) throw err;
// else {
//     return resolve({
//                         "status":200,
//                         data : result
//                           })
//             )})}
