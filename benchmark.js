var apiBenchmark = require('api-benchmark');
var fs = require('fs');

var services = {
  server1: 'http://localhost:4000/'
};

var routes = {
 /* route1: {
    method: 'post',
    route: '/authenticateSSOID',
    headers:{'content-type':'application/json'},
    data: {
      "UserName": "goverdhansingh123",
      "Password": "padawas@123",
      "Application": "Bhamashah"
      }
  }, 

  route2: {
    method: 'post',
    route: '/createMPIN',
    headers:{'content-type':'application/json'},
    data: {
      "userId": 20,
      "mpin": 1234,
      "confirmMpin": 1234,
      "deviceId": "hfefef",
      "oneSignalId": "7ywbjhwbui"
      }
  }, 

  route3: {
    method: 'post',
    route: '/MPINLogin',
    headers:{'Content-type':'application/json'},
    data: {
      "mpinCode": 1234,
  "deviceId": "hfefef",
  "oneSignalId": "7ywbjhwbui"
      }
  },
/*
  route4: {
    method: 'post',
    route: '/forgotMpin',
    headers:{'Content-type':'application/json'},
    data: {
      "mobile": "7073599988",
      "mobile_type": "bank"
      }
  },

  route5: {
    method: 'post',
    route: '/verifyMpinOTP',
    headers:{'Content-type':'application/json'},
    data: {
      "otp": 563078,
      "ref_no": "41284777"
      }
  },

  
  route6: {
    method: 'post',
    route: '/changeMpin',
    headers:{'Content-type':'application/json','access_token':'05024032403000014022051848048048020032024016:pYM1maTg0uCtAi2nWAHAVJBmNDWf_1__0Ag1NlaqGmrvWVav36qb2IuIWsMWi5mx'},
    data: {
      "old_mpin": 1234,
      "new_mpin": 5678,
      "confirm_mpin": 5678
      }
  },
  

  route7: {
    method: 'post',
    route: '/addBeneficiary',
    headers:{
             'Content-type':'application/json',
             'user_language':'en',
             'access_token':'4ca884dbb134158c:mQ8MfHMObF6CEmHjKqbn8sbtH6XDcX7Sx_rMgNOAH_E6dcUvRnSjwbrQoyelHgFN'},
    data: {
      "beneficiary_name": "Shesh",
        "identifier_type": "mobile",
        "account_number": "8952070183",
        "ifsc_code": "ABHY0065016",
        "mobile_no":"8585858585",
        "email": "sheshnath.a@gmail.com" 
      }
  },

  route8: {
    method: 'post',
    route: '/fetchBeneficiary',
    headers:{
      'Content-type':'application/json',
       'user_language':'en',
       'access_token':'4ca884dbb134158c:mQ8MfHMObF6CEmHjKqbn8sbtH6XDcX7Sx_rMgNOAH_E6dcUvRnSjwbrQoyelHgFN'},

    data: {
      "beneficiary_id": "21201"
      }
  },

  route9: {
    method: 'post',
    route: '/deleteBeneficiary',
    headers:{
      'Content-type':'application/json',
       'user_language':'en',
       'access_token':'4ca884dbb134158c:mQ8MfHMObF6CEmHjKqbn8sbtH6XDcX7Sx_rMgNOAH_E6dcUvRnSjwbrQoyelHgFN'},

    data: {
      "beneficiary_id": "21201"
      }
  },

  route10: {
    method: 'post',
    route: '/listBeneficiary',
    headers:{
      'Content-type':'application/json',
       'user_language':'en',
       'access_token':'4ca884dbb134158c:mQ8MfHMObF6CEmHjKqbn8sbtH6XDcX7Sx_rMgNOAH_E6dcUvRnSjwbrQoyelHgFN'},

    data: {
      "beneficiary_type": "mobile"
      }
  },

  route11: {
    method: 'post',
    route: '/addOwnBankAccount',
    headers:{
      'Content-type':'application/json',
       'user_language':'en',
       'access_token':'4ca884dbb134158c:mQ8MfHMObF6CEmHjKqbn8sbtH6XDcX7Sx_rMgNOAH_E6dcUvRnSjwbrQoyelHgFN'},

    data: {
      "account_no": "8437179922",
  "ifsc_code": "mobile"
      }
  },
  

  route12: {
    method: 'post',
    route: '/verifyOwnBankAccount',
    headers:{
      'Content-type':'application/json',
       'user_language':'en',
       'access_token':'4ca884dbb134158c:mQ8MfHMObF6CEmHjKqbn8sbtH6XDcX7Sx_rMgNOAH_E6dcUvRnSjwbrQoyelHgFN'},

    data: {
      "amount": "20"
      }
  },
 

  route13: {
    method: 'post',
    route: '/modifyOwnBankAccount',
    headers:{
      'Content-type':'application/json',
       'user_language':'en',
       'access_token':'4ca884dbb134158c:mQ8MfHMObF6CEmHjKqbn8sbtH6XDcX7Sx_rMgNOAH_E6dcUvRnSjwbrQoyelHgFN'},

    data: {
      "account_no": "843717992270",
  "ifsc_code": "mobile"
      }
  },
 
  route14: {
    method: 'post',
    route: '/requestMoneyCreate',
    headers:{
      'Content-type':'application/json',
       'user_language':'en',
       'access_token':'4ca884dbb134158c:mQ8MfHMObF6CEmHjKqbn8sbtH6XDcX7Sx_rMgNOAH_E6dcUvRnSjwbrQoyelHgFN'},

    data: {
      "recipient_mobile": "8952070183",
      "amount": "20",
      "remark": "testing"
      }
  },

  route15: {
    method: 'get',
    route: '/requestMoneyRecieved',
    headers:{
      'Content-type':'application/json',
       'user_language':'en',
       'access-token':'4ca884dbb134158c:mQ8MfHMObF6CEmHjKqbn8sbtH6XDcX7Sx_rMgNOAH_E6dcUvRnSjwbrQoyelHgFN'},

    },

    route16: {
      method: 'get',
      route: '/requestMoneySent',
      headers:{
        'Content-type':'application/json',
         'user_language':'en',
         'access-token':'4ca884dbb134158c:mQ8MfHMObF6CEmHjKqbn8sbtH6XDcX7Sx_rMgNOAH_E6dcUvRnSjwbrQoyelHgFN'},
  
      },

      route17: {
        method: 'post',
        route: '/requestMoneyDelete',
        headers:{
          'Content-type':'application/json',
           'user_language':'en',
           'access-token':'4ca884dbb134158c:mQ8MfHMObF6CEmHjKqbn8sbtH6XDcX7Sx_rMgNOAH_E6dcUvRnSjwbrQoyelHgFN'},
    
        data: {
          "recipient_id": "1"
          }
      }, 

     route18: {
        method: 'post',
        route: '/requestMoneyReminder',
        headers:{
          'Content-type':'application/json',
           'user_language':'en',
           'access-token':'4ca884dbb134158c:mQ8MfHMObF6CEmHjKqbn8sbtH6XDcX7Sx_rMgNOAH_E6dcUvRnSjwbrQoyelHgFN'},
    
        data: {
          "recipient_id": "8"
          }
      }, 

      route19: {
        method: 'get',
        route: '/recentBillHistory',
        headers:{
          'Content-type':'application/json',
           'user_language':'en',
           'access-token':'4ca884dbb134158c:mQ8MfHMObF6CEmHjKqbn8sbtH6XDcX7Sx_rMgNOAH_E6dcUvRnSjwbrQoyelHgFN'},
    
        },
     
      route20: {
          method: 'post',
          route: '/actionBillPaymentVerify',
          headers:{
            'Content-type':'application/json',
            'access-token':'4ca884dbb134158c:mQ8MfHMObF6CEmHjKqbn8sbtH6XDcX7Sx_rMgNOAH_E6dcUvRnSjwbrQoyelHgFN'},
      
          data: {
            "transaction_id": "180521000429"
            }
        }, 

         route24: {
          method: 'post',
          route: '/createWallet',
          headers:{
            'Content-type':'application/json',
            'user_language':'en',
            'access_token':'4ca884dbb134158c:mQ8MfHMObF6CEmHjKqbn8sbtH6XDcX7Sx_rMgNOAH_E6dcUvRnSjwbrQoyelHgFN'},
      
          data: {
            "Mobile_Number": "8769003391",
            "UserId": "24"
            }
        },    

        route21: {
          method: 'post',
          route: '/loadmoneytowallet',
          headers:{
            'Content-type':'application/json',
            'user_language':'en',
            'access_token':'4ca884dbb134158c:mQ8MfHMObF6CEmHjKqbn8sbtH6XDcX7Sx_rMgNOAH_E6dcUvRnSjwbrQoyelHgFN'},
      
          data: {
            "p1": "8952070183",
            "p2": 20,
            "p3": "load",
            "p4": "",
            "p5": "test"
            }
        }, 
        

        route22: {
          method: 'post',
          route: '/wallettowallet',
          headers:{
            'Content-type':'application/json',
            'user_language':'en',
            'access_token':'4ca884dbb134158c:mQ8MfHMObF6CEmHjKqbn8sbtH6XDcX7Sx_rMgNOAH_E6dcUvRnSjwbrQoyelHgFN'},
      
          data: {
            "amount": 20,
            "tag_name": "load",
            "beneficiary_mobile": "9768135452"
            }
        }, 

        route23: {
          method: 'post',
          route: '/wallettoBank',
          headers:{
            'Content-type':'application/json',
            'user_language':'en',
            'access_token':'4ca884dbb134158c:mQ8MfHMObF6CEmHjKqbn8sbtH6XDcX7Sx_rMgNOAH_E6dcUvRnSjwbrQoyelHgFN'},
      
          data: {
            "amount": 20,
  "remark": "load",
  "beneficiary_id": 14441
            }
        },  

       
    
        route25: {
          method: 'post',
          route: '/verifyMotp',
          headers:{
            'Content-type':'application/json',
            'user_language':'en',
            'access_token':'4ca884dbb134158c:mQ8MfHMObF6CEmHjKqbn8sbtH6XDcX7Sx_rMgNOAH_E6dcUvRnSjwbrQoyelHgFN'},
      
          data: {
            "Mobile_Number": "9640266349",
  "UserId": "10",
  "ReferNo": "26867",
  "OTP": "111111"
            }
        },    
  */  
        route26: {
          method: 'post',
          route: '/registeraadharkyc',
          headers:{
            'Content-type':'application/json',
            'user_language':'en',
            'access_token':'4ca884dbb134158c:mQ8MfHMObF6CEmHjKqbn8sbtH6XDcX7Sx_rMgNOAH_E6dcUvRnSjwbrQoyelHgFN'},
      
          data: {
            "auth_token": "x0T5sE22eBWdD-CTIZsKBG-4b6tsZoSDqV5UCyd7igxWevfB3b_AaCT76PCfBKZ",
  "aadhar_no": "600733443833"
            }
        },   
       
        
        route27: {
          method: 'post',
          route: '/verifyaadharotp',
          headers:{
            'Content-type':'application/json',
            'user_language':'en',
            'access_token':'4ca884dbb134158c:mQ8MfHMObF6CEmHjKqbn8sbtH6XDcX7Sx_rMgNOAH_E6dcUvRnSjwbrQoyelHgFN'},
      
          data: {
            "otp": "438563",
  "transaction_id": "181102017591",
  "otp_transaction_id": "414464"
            }
        },     

        route28: {
          method: 'post',
          route: '/readprofilesection',
          headers:{
            'Content-type':'application/json'
           },
      
          data: {
            "id": "10"
            }
        },  
        
        route29: {
          method: 'post',
          route: '/closewallet',
          headers:{
            'Content-type':'application/json',
            'user_language':'en',
            'access_token':'4ca884dbb134158c:mQ8MfHMObF6CEmHjKqbn8sbtH6XDcX7Sx_rMgNOAH_E6dcUvRnSjwbrQoyelHgFN'},
      
          data: {
            "auth_token": "a5f69162-5a61-429e-949d-22c408869ec7",
  "aadhar_no": "886035523300"
            }
        },        
     
        route30: {
          method: 'post',
          route: '/readpassbook',
          headers:{
            'Content-type':'application/json',
            'user_language':'en',
            'access_token':'4ca884dbb134158c:mQ8MfHMObF6CEmHjKqbn8sbtH6XDcX7Sx_rMgNOAH_E6dcUvRnSjwbrQoyelHgFN'},
      
          data: {
            "days": "0",
            "page": "1"
            }
        },      
        
        route31: {
          method: 'post',
          route: '/getbhamashahstatus',
          headers:{
            'Content-type':'application/json',
          },
          data: {
            "BHAMASHAH_ACK_ID": "1234-AB12-12345",
            "AADHAR_ID": "123456789012",
            "MOBILE_NO": ""
            }
        },    
        
        route32: {
          method: 'post',
          route: '/getenrollmentdetails',
          headers:{
            'Content-type':'application/json',
          },
          data: {
            "BHAMASHAH_ID": "",
 
            "BHAMASHAH_ACK_ID": "1234-AB12-12345",
            "AADHAR_ID": "123456789012",
            "MOBILE_NO": ""
            }
        },           

        route33: {
          method: 'post',
          route: '/getDBTDetails',
          headers:{
            'Content-type':'application/json',
          },
          data: {
            "BHAMASHAH_ID": "",
 
            "BHAMASHAH_ACK_ID": "1234-AB12-12345",
            "AADHAR_ID": "123456789012",
            "MOBILE_NO": ""
            }
        },           
};

apiBenchmark.measure(services, routes,{minSamples: 5}, function(err, results) {
 // console.log(results.response);
  apiBenchmark.getHtml(results, function(error, html) {
    console.log(html);
    fs.writeFileSync('benchmark.html',html,function (err) {
      if (err) throw err;
      console.log('Replaced!');
    });
     });
});