/**
 * @author: Rakesh C
 * @version: 1.0.0
 * @date: October 10, 2018
 * @Description: Functions will intract with multichian. will handle operations like add,update and delete.
 */

var config = require('config');
var dbConfig = config.get('multichainConfig');
let multichain = require("multichain-node")(dbConfig);
var rpqbarraylist = require('rpqbarraylist');

let Utils = require("./../util/utils")
/** @module ADDDATA*/
module.exports = {
    addData: addData,
    updateData : updateData,
    deleteData:deleteData,
    addDataWithOutArrayList:addDataWithOutArrayList
}

/** @function addData 
 * add patient record data into blockchain.
 */
function addDataWithOutArrayList(params) {

    return new Promise((resolve,reject) => {
        var response;

        var value = Utils.cnvStrToHex(JSON.stringify(params.value));
        console.log("value",value)

        multichain.publish({stream: "DOIT", 
            key: params.key, 
            data: value }, (err, res) => {
            if (err == null) {
                return resolve({
                    status: 200,
                    response: res
                });
            } else {
                return resolve({
                    status:401,
                    response: err
                });
            }
        
        })

    })
}

/** @function addData 
 * add patient record data into blockchain.
 */
function addData(params) {

    return new Promise((resolve, reject) => {
       
        var response;
        var list = new rpqbarraylist;
        var key = params.key;


        var hexstring = '';

        multichain.listStreamKeyItems({
            stream: "DOIT",
            "key": key
        }, (err, res) => {

            if(err){
               return resolve({
                    status: 400,
                    response:"something went wrong, try again"
                })
            }else {
            var length = res.length;
            if (length == 0) {

                list.add(params.value)
                var value = Utils.cnvStrToHex(JSON.stringify(list));

                multichain.publish({ stream: "DOIT", key: key, data: value }, (err, res) => {

                    if (err == null) {
                        return resolve({
                            status: 400,
                            response: res
                        });
                    } else {

                        logger.error(err)
                    }
                })
            } else {
                var string = '';

                var data = res[length - 1].data;
                var str = Utils.cnvHexToStr(data)
                list.add(JSON.parse(str))

                if (!list.containsInnerObj(params.data)) {

                    list.add(params.value)
                    var value = Utils.cnvStrToHex(JSON.stringify(list));

                    multichain.publish({stream: "DOIT",key: key,data: value}, (err, res) => {

                        if (err == null) {
                            return resolve({
                                status: 200,
                                response: res
                            });
                        } else {
                            logger.error(err)
                        }
                    })
                } else {

                    return resolve({
                        status:401,
                        response: "record already exist!"
                    });
                }

            }
        }
        })

    })
}


/** @function updateConfidentialityStatus 
 * update ConfidentialityStatus into blockchain.
 */
function updateData(params) {

    return new Promise((resolve) => {

        var list = new rpqbarraylist;

        multichain.listStreamKeyItems({
            stream: "DOIT",
            "key": params.key
        }, (err, res) => {

            var length = res.length;
            if (err == null) {
                if (length == 0) {
                    return resolve({
                        status:401,
                        response: "record was not found please check the EHRID!"
                    });
                } else {
                    var string = '';

                    var data = res[length - 1].data;
                    var str = Utils.cnvHexToStr(data)
                    console.log(JSON.parse(str));
                    list.add(JSON.parse(str))

                    var id = params.data.id
                    var index = list.indexOfObjectsId(id);

                    if (index != -1) {
                        list.remove(index)
                        list.add(params.value)
                    }

                    var value = Utils.cnvStrToHex(JSON.stringify(list));

                    multichain.publish({stream: "DOIT",key: key,data: value}, (err, res) => {

                        if (err == null) {
                            return resolve({
                                status:200,
                                response: res
                            });
                        } else {
                            logger.error(err)
                        }
                    })

                }
            } else {
                return resolve({
                    status:500,
                    response: err
                });
            }
        })
    })
}


/** @function deleteData 
 * delete patients record.
 */
function deleteData(params) {
    return new Promise((resolve) => {
        logger.info("insidedeleteData")
        var response;
        var list = new rpqbarraylist;
       


        var hexstring = '';
        multichain.listStreamKeyItems({
            stream: "DOIT",
            "key": params.key
        }, (err, res) => {

            var length = res.length;

            if (err == null) {
                if (length == 0) {
                    return resolve({
                        response: "record was not found please check the EHRID!"
                    });
                } else {
                    var string = '';

                    var data = res[length - 1].data;
                    var str = Utils.cnvHexToStr(data)
                    list.add(JSON.parse(str))

                    var id = params.data.id
                    var index = list.indexOfObjectsId(id);
                    if (index != -1) {
                        list.remove(index)
                    }
                    var value = Utils.cnvStrToHex(JSON.stringify(list));

                    multichain.publish({stream: "DOIT",key: key,data: value}, (err, res) => {

                        if (err == null) {
                            return resolve({
                                response: res
                            });
                        } else {
                            logger.error(err)
                        }
                    })
                }

            } else {
                logger.error(err)
            }
        })
    })

}