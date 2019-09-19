'use strict';
var request = require('request');
var sha512 = require('js-sha512');


module.exports = {
    generateChecksum: generateChecksum
}
function generateChecksum(action, PSK_secrect_key, wlap_code, wlap_secret_key, p1 = '', p2 = '', p3 = '', p4 = '', p5 = '', p6 = '', p7 = '', p8 = '', p9 = '', p10 = '', p11 = '', p12 = '', p13 = '', p14 = ''){
        var string = action+'|'+
                PSK_secrect_key+'|'+
                wlap_code+'|'+
                wlap_secret_key+'|'+
                p1+'|'+
                p2+'|'+
                p3+'|'+
                p4+'|'+
                p5+'|'+
                p6+'|'+
                p7+'|'+
                p8+'|'+
                p9+'|'+
                p10+'|'+
                p11+'|'+
                p12+'|'+
                p13+'|'+
                p14;
        
        return sha512(string);
        
    }
    
  

