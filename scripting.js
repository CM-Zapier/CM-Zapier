'use strict';

// START: HEADER -- AUTOMATICALLY ADDED FOR COMPATIBILITY - v1.2.0
const _ = require('lodash');
_.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
const crypto = require('crypto');
const async = require('async');
const moment = require('moment-timezone');
const { DOMParser, XMLSerializer } = require('xmldom');
const atob = require('zapier-platform-legacy-scripting-runner/atob');
const btoa = require('zapier-platform-legacy-scripting-runner/btoa');
const z = require('zapier-platform-legacy-scripting-runner/z');
const $ = require('zapier-platform-legacy-scripting-runner/$');
const {
  ErrorException,
  HaltedException,
  StopRequestException,
  ExpiredAuthException,
  RefreshTokenException,
  InvalidSessionException,
} = require('zapier-platform-legacy-scripting-runner/exceptions');
// END: HEADER -- AUTOMATICALLY ADDED FOR COMPATIBILITY - v1.2.0


var Zap = {
    
    Messages_pre_write: function(bundle) {

        var sms_head = {
            'Content-Type': 'application/json'

        };

        var sms_data = {
            "Messages": {
                "Authentication": {
                    "ProductToken": bundle.action_fields_full.ProductToken
                },
                "Msg": [{
                    "Body": {
                        "Content": bundle.action_fields_full.Body
                    },
                    "From": bundle.action_fields_full.From,
                    "To": [{
                        "Number": bundle.action_fields_full.To
                    }],
                    
                    "Reference": bundle.action_fields_full.Reference
                }]
            }
        };

        var sms_resp = JSON.stringify(sms_data);
        return {
            headers: sms_head,
            data: sms_resp
        };
    },


    VoiceText_pre_write: function(bundle) {

        var main = bundle.action_fields_full.Language;

        console.log(main);

        var lan = main.split(";")[0];

        var gen = main.split(";")[1];

        var num = main.split(";")[2];

        var voice_data = {
            "callee": bundle.action_fields_full.Callee,
            "caller": bundle.action_fields_full.Caller,
            "anonymous": false,
            "prompt": bundle.action_fields_full.Text,
            "prompt-type": "TTS",
            "voice": {
                "language": lan,
                "gender": gen,
                "number": num
            }
        };

        var body_string = JSON.stringify(voice_data);

        // z.hmac(algorithm, key, string, encoding="hex")
        var hmac_hash = z.hmac('sha256', bundle.action_fields_full.SharedKey, body_string);

        var user = bundle.action_fields_full.Username;
        var voice_head = {
            'Content-Type': 'application/json',
            'Authorization': 'username=' + user + ';signature=' + hmac_hash
        };


        var voice_resp = JSON.stringify(voice_data);
        return {
            headers: voice_head,
            data: voice_resp
        };
    },

    Hybrid_Messages_pre_write: function(bundle) {

        var hybrid_head = {
            'Content-Type': 'application/json'

        };

        var hybrid_data = {
            "messages": {
                "authentication": {
                    "producttoken": bundle.action_fields_full.ProductToken
                },
                "msg": [{
                    "from": bundle.action_fields_full.From,
                    "to": [{
                        "number": bundle.action_fields_full.To
                    }],
                    "appKey": bundle.action_fields_full.appkey,
                    "Reference": bundle.action_fields_full.Reference,
                    "body": {
                        "content": bundle.action_fields_full.Body
                    }
                }]
            }
        };

        var hybrid_resp = JSON.stringify(hybrid_data);
        return {
            headers: hybrid_head,
            data: hybrid_resp
        };
    },

    Push_Messages_pre_write: function(bundle) {

        var push_head = {
            'Content-Type': 'application/json'
        };

        var push_data = {
            "messages": {
                "authentication": {
                    "producttoken": bundle.action_fields_full.ProductToken
                },
                "msg": [{
                    "from": bundle.action_fields_full.From,
                    "to": [{
                        "number": bundle.action_fields_full.To
                    }],
                    "body": {
                        "content": bundle.action_fields_full.Body
                    },
                    "allowedChannels": [bundle.action_fields_full.allowedChannels],
                    "appKey": bundle.action_fields_full.appkey,
                    "Reference": bundle.action_fields_full.Reference
                }]
            }
        };

        var push_resp = JSON.stringify(push_data);
        return {
            headers: push_head,
            data: push_resp
        };
    },
      ValidatePhoneNumber_pre_write: function(bundle) {
        
        var validate_head =  {
            'Content-Type': 'application/json',
            'X-CM-PRODUCTTOKEN': bundle.action_fields_full.XCMProductToken
          
        };
        
        var validate_data = {
            "phonenumber": bundle.action_fields_full.PhoneNumber
        };
        
        var validate_resp = JSON.stringify(validate_data);
     return  {
      headers: validate_head,
      data: validate_resp
    };
    },
    LookUp_pre_write: function(bundle) {
        
        var lookup_head =  {
            'Content-Type': 'application/json',
            'X-CM-PRODUCTTOKEN': bundle.action_fields_full.XCM_ProductToken
          
        };
        
        var lookup_data = {
            "phonenumber": bundle.action_fields_full.Phone_Number,
            "mnp_lookup": true
        };
        
        var lookup_resp = JSON.stringify(lookup_data);
     return  {
      headers: lookup_head,
      data: lookup_resp
    };
    },
    
    BulkMessages_pre_write: function(bundle) {
        
        var bulk_sms_head = {
            'Content-Type': 'application/json'

        };
        
        var main_num=bundle.action_fields_full.BulkTo;
        var main_numbers=main_num.split('||');
        var main_length=main_numbers.length;
        var from_num=bundle.action_fields_full.BulkFrom;
        var from_numbers=from_num.split('||');
        var from_length=from_numbers.length;
        var main_body=bundle.action_fields_full.BulkBody;
        var main_content=main_body.split('||');
        var bulk_reference=bundle.action_fields_full.BulkReference;
        var reference=bulk_reference.split('||');
        var bulk_msg='';
        for (var j=0;j<from_length;j++)
        {
         var num1= main_numbers[j];
        var numbers1=num1.split(',');
        var length1=numbers1.length;
        var bulk_to1='';
        for(var k=0;k<length1;k++)
        {
        bulk_to1=bulk_to1+',{"Number": "'+numbers1[k]+'"}';
        }
        bulk_to1=bulk_to1.substr(1);
         bulk_to1=bulk_to1.replace(/\\"/g, '"');
         
        bulk_msg=bulk_msg+','+'{"From": "'+from_numbers[j]+'", "To": \['+bulk_to1+'\]'+', "Body": {"Content": "'+main_content[j]+'", "Reference": "'+reference[j]+'"} }';
        
        }
        bulk_msg=bulk_msg.substr(1);
        
        console.log(bulk_msg);
       
       var bulk_msg_data={
            "Messages": {
                "Authentication": {
                    "ProductToken": bundle.action_fields_full.BulkProductToken
                },
                "Msg": [
                bulk_msg
                ]
            }
        };
       console.log(bulk_msg_data);
       
       
       var bulk_msg_resp = JSON.stringify(bulk_msg_data).replace(/\\\\/g,"").replace(/\["/g,"\[").replace(/"\]/g, "\]").replace(/\\/g,"");
       console.log(bulk_msg_resp);
       return {
            headers: bulk_sms_head,
            data: bulk_msg_resp
        };
       
     /*  var num= bundle.action_fields_full.BulkTo;
        var numbers=num.split(',');
        var length=numbers.length;
        var bulk_to='';
        for(var i=0;i<length;i++)
        {
        bulk_to=bulk_to+',{"Number": "'+numbers[i]+'"}';
        }
        bulk_to=bulk_to.substr(1);
         bulk_to=bulk_to.replace(/\\"/g, '"');

        var bulk_sms_data = {
            "Messages": {
                "Authentication": {
                    "ProductToken": bundle.action_fields_full.BulkProductToken
                },
                "Msg": [{
                    "Body": {
                        "Content": bundle.action_fields_full.BulkBody
                    },
                    "From": bundle.action_fields_full.BulkFrom,
                    "To": [
                        bulk_to
                    ],
                    "Reference": bundle.action_fields_full.BulkReference
                }]
            }
        };

        var bulk_sms_resp = JSON.stringify(bulk_sms_data).replace(/\\/g, "").replace(/\["/g, "\[").replace(/"\]/g, "\]");
        return {
            headers: bulk_sms_head,
            data: bulk_sms_resp
        }; */
    }

};



// START: FOOTER -- AUTOMATICALLY ADDED FOR COMPATIBILITY - v1.2.0
module.exports = Zap;
// END: FOOTER -- AUTOMATICALLY ADDED FOR COMPATIBILITY - v1.2.0
