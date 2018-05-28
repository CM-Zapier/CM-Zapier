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
    Num_Validation_post_read_resource: function(bundle) {
      var nparsed_response = z.JSON.parse(bundle.response.content);
    var nheads = bundle.response.headers;
    var nst_code=bundle.response.status_code;
    var nresult = {"result_code":200,"Status":"Success"};
        return [{
        response: "Success",
        "id":1,
        status_code: nst_code,
        content:{ "carrier":nparsed_response.carrier,
            "country_code":nparsed_response.country_code,
            "country_iso":nparsed_response.country_iso,
            "format_e164":nparsed_response.format_e164,
            "format_international":nparsed_response.format_international,
            "format_national":nparsed_response.format_national,
            "region":nparsed_response.region,
            "region_code":nparsed_response.region_code,
            "timezone":nparsed_response.timezone,
            "type":{"mobile":nparsed_response.type.mobile,
            "fixed_line":nparsed_response.type.fixed_line,
            "fixed_line_or_mobile":nparsed_response.type.fixed_line_or_mobile,
            "voip":nparsed_response.type.voip,
            "toll_free":nparsed_response.type.toll_free,
            "premium_rate":nparsed_response.type.premium_rate,
            "standard_rate":nparsed_response.type.standard_rate,
            "shared_cost":nparsed_response.type.shared_cost,
            "personal":nparsed_response.type.personal,
            "pager":nparsed_response.type.pager,
            "voicemail":nparsed_response.type.voicemail,
            "shortcode":nparsed_response.type.shortcode,
            "emergency":nparsed_response.type.emergency,
            "unknown":nparsed_response.type.unknown},
            "valid_number":nparsed_response.valid_number}/*,
        headers:{"Content-Encoding": nheads['Content-Encoding'], 
            "Transfer-Encoding": nheads['Transfer-Encoding'], 
            "Strict-Transport-Security": nheads['Strict-Transport-Security'], 
            "Vary": nheads['Vary'], 
            "Server": nheads['Server'], 
            "Connection": nheads['Connection'], 
            "Cache-Control": nheads['Cache-Control'], 
            "Date": nheads['Date'], 
            "Access-Control-Allow-Credentials": nheads['Access-Control-Allow-Credentials'], 
            "Content-Type": nheads['Content-Type'], 
            "Access-Control-Allow-Origin": nheads['Access-Control-Allow-Origin']}*/
        }];  
    },

    Num_Validation_post_search: function(bundle) {
        var nparsed_response = z.JSON.parse(bundle.response.content);
    var nheads = bundle.response.headers;
    var nst_code=bundle.response.status_code;
    var nresult = {"result_code":200,"Status":"Success"};
        return [{
        response: "Success",
        "id":1,
        status_code: nst_code,
        content:{ "carrier":nparsed_response.carrier,
            "country_code":nparsed_response.country_code,
            "country_iso":nparsed_response.country_iso,
            "format_e164":nparsed_response.format_e164,
            "format_international":nparsed_response.format_international,
            "format_national":nparsed_response.format_national,
            "region":nparsed_response.region,
            "region_code":nparsed_response.region_code,
            "timezone":nparsed_response.timezone,
            "type":{"mobile":nparsed_response.type.mobile,
            "fixed_line":nparsed_response.type.fixed_line,
            "fixed_line_or_mobile":nparsed_response.type.fixed_line_or_mobile,
            "voip":nparsed_response.type.voip,
            "toll_free":nparsed_response.type.toll_free,
            "premium_rate":nparsed_response.type.premium_rate,
            "standard_rate":nparsed_response.type.standard_rate,
            "shared_cost":nparsed_response.type.shared_cost,
            "personal":nparsed_response.type.personal,
            "pager":nparsed_response.type.pager,
            "voicemail":nparsed_response.type.voicemail,
            "shortcode":nparsed_response.type.shortcode,
            "emergency":nparsed_response.type.emergency,
            "unknown":nparsed_response.type.unknown},
            "valid_number":nparsed_response.valid_number},
      headers:{"Content-Encoding": nheads.Content_Encoding, 
            "Transfer-Encoding": nheads.Transfer_Encoding, 
            "Strict-Transport-Security": nheads.Strict_Transport_Security, 
            "Vary": nheads.Vary, 
            "Server": nheads.Server, 
            "Connection": nheads.Connection, 
            "Cache-Control": nheads.Cache_Control, 
            "Date": nheads.Date, 
            "Access-Control-Allow-Credentials": nheads.Access_Control_Allow_Credentials, 
            "Content-Type": nheads.Content_Type, 
            "Access-Control-Allow-Origin": nheads.Access_Control_Allow_Origin}
        }];
    },

    Num_Validation_pre_search: function(bundle) {
         var lookup_headnw ={
                'Content-Type': 'application/json',
                'X-CM-PRODUCTTOKEN': bundle.auth_fields.productKey
                };
        
                    console.log(lookup_headnw);
       
                return  {
                          headers: lookup_headnw
                        };
    },

Num_LookUp_post_read_resource: function(bundle) {
var parsed_response = z.JSON.parse(bundle.response.content);
        var heads=bundle.response.headers;
        var st_code=bundle.response.status_code;
        return [{
        response: "Success",
        "id":1,
        status_code: st_code,
         content:{ "active_number":parsed_response.active_number,
             "carrier":parsed_response.carrier,
             "carrier_mcc":parsed_response.carrier_mcc,
             "carrier_mnc":parsed_response.carrier_mnc,
             "country_code":parsed_response.country_code,
             "country_iso":parsed_response.country_iso,
             "format_e164":parsed_response.format_e164,
             "format_international":parsed_response.format_international,
             "format_national":parsed_response.format_national,
             "ported":parsed_response.ported,
             "region":parsed_response.region,
             "region_code":parsed_response.region_code,
             "roaming":parsed_response.roaming,
             "roaming_carrier":parsed_response.roaming_carrier,
             "roaming_country_iso":parsed_response.roaming_country_iso,
             "roaming_country_prefix":parsed_response.roaming_country_prefix,
             "roaming_mcc":parsed_response.roaming_mcc,
             "roaming_mnc":parsed_response.roaming_mnc,
             "timezone":parsed_response.timezone,
             "type":{"mobile":parsed_response.type.mobile,
             "fixed_line":parsed_response.type.fixed_line,
             "fixed_line_or_mobile":parsed_response.type.fixed_line_or_mobile,
             "voip":parsed_response.type.voip,
             "toll_free":parsed_response.type.toll_free,
             "premium_rate":parsed_response.type.premium_rate,
             "standard_rate":parsed_response.type.standard_rate,
             "shared_cost":parsed_response.type.shared_cost,
             "personal":parsed_response.type.personal,
             "pager":parsed_response.type.pager,
             "voicemail":parsed_response.type.voicemail,
             "shortcode":parsed_response.type.shortcode,
             "emergency":parsed_response.type.emergency,
             "unknown":parsed_response.type.unknown},
             "valid_number":parsed_response.valid_number}/*,
      headers:{"Content-Encoding": heads.Content-Encoding, 
             "Transfer-Encoding": heads.Transfer-Encoding, 
             "Strict-Transport-Security": heads.Strict-Transport-Security, 
             "Vary": heads.Vary, 
             "Server": heads.Server, 
             "Connection": heads.Connection, 
             "Cache-Control": heads.Cache-Control, 
             "Date": heads.Date, 
             "Access-Control-Allow-Credentials": heads.Access-Control-Allow-Credentials, 
             "Content-Type": heads.Content-Type, 
             "Access-Control-Allow-Origin": heads.Access-Control-Allow-Origin}*/
        }];
    },

Num_LookUp_post_search: function(bundle) {
    var parsed_response = z.JSON.parse(bundle.response.content);
    var heads = bundle.response.headers;
    var st_code=bundle.response.status_code;
       var result = {"result_code":200,"Status":"Success"};
        return [{
        response: "Success",
        "id":1,
        status_code: st_code,
         content:{ "active_number":parsed_response.active_number,
             "carrier":parsed_response.carrier,
             "carrier_mcc":parsed_response.carrier_mcc,
             "carrier_mnc":parsed_response.carrier_mnc,
             "country_code":parsed_response.country_code,
             "country_iso":parsed_response.country_iso,
             "format_e164":parsed_response.format_e164,
             "format_international":parsed_response.format_international,
             "format_national":parsed_response.format_national,
             "ported":parsed_response.ported,
             "region":parsed_response.region,
             "region_code":parsed_response.region_code,
             "roaming":parsed_response.roaming,
             "roaming_carrier":parsed_response.roaming_carrier,
             "roaming_country_iso":parsed_response.roaming_country_iso,
             "roaming_country_prefix":parsed_response.roaming_country_prefix,
             "roaming_mcc":parsed_response.roaming_mcc,
             "roaming_mnc":parsed_response.roaming_mnc,
             "timezone":parsed_response.timezone,
             "type":{"mobile":parsed_response.type.mobile,
             "fixed_line":parsed_response.type.fixed_line,
             "fixed_line_or_mobile":parsed_response.type.fixed_line_or_mobile,
             "voip":parsed_response.type.voip,
             "toll_free":parsed_response.type.toll_free,
             "premium_rate":parsed_response.type.premium_rate,
             "standard_rate":parsed_response.type.standard_rate,
             "shared_cost":parsed_response.type.shared_cost,
             "personal":parsed_response.type.personal,
             "pager":parsed_response.type.pager,
             "voicemail":parsed_response.type.voicemail,
             "shortcode":parsed_response.type.shortcode,
             "emergency":parsed_response.type.emergency,
             "unknown":parsed_response.type.unknown},
             "valid_number":parsed_response.valid_number},
      headers:{"Content-Encoding": heads.Content_Encoding, 
             "Transfer-Encoding": heads.Transfer_Encoding, 
             "Strict-Transport-Security": heads.Strict_Transport_Security, 
             "Vary": heads.Vary, 
             "Server": heads.Server, 
             "Connection": heads.Connection, 
             "Cache-Control": heads.Cache_Control, 
             "Date": heads.Date, 
             "Access-Control-Allow-Credentials": heads.Access_Control_Allow_Credentials, 
             "Content-Type": heads.Content_Type, 
             "Access-Control-Allow-Origin": heads.Access_Control_Allow_Origin}

        }];
    },
    
    Hybrid_Messages_post_write: function(bundle) {
    if(!(bundle.response.status_code >= 200 && bundle.response.status_code < 300)){
            throw new ErrorException(bundle.response.content);
        }
    },

    VoiceText_post_write: function(bundle) {
    if(!(bundle.response.status_code >= 200 && bundle.response.status_code < 300)){
            throw new ErrorException(bundle.response.content);
        }
    },
    
    Messages_post_write: function(bundle) {
    if(!(bundle.response.status_code >= 200 && bundle.response.status_code < 300)){
            throw new ErrorException(bundle.response.content);
        }
    },
    
    Push_Messages_post_write: function(bundle) {
    if(!(bundle.response.status_code >= 200 && bundle.response.status_code < 300)){
            throw new ErrorException(bundle.response.content);
        }
    },
    
    ValidatePhoneNumber_post_write: function(bundle) {
    if(!(bundle.response.status_code >= 200 && bundle.response.status_code < 300)){
            throw new ErrorException(bundle.response.content);
        }
    },
    
    BulkMessages_post_write: function(bundle) {
    if(!(bundle.response.status_code >= 200 && bundle.response.status_code < 300)){
            throw new ErrorException(bundle.response.content);
        }
    },
    
    Num_LookUp_pre_search: function(bundle) {
           var lookup_headn ={
                'Content-Type': 'application/json',
                'X-CM-PRODUCTTOKEN': bundle.auth_fields.productKey
                };
        
                    console.log(lookup_headn);
       
                return  {
                          headers: lookup_headn
                        };
            },
            
    Messages_pre_write: function(bundle) {

        var sms_head = {
            'Content-Type': 'application/json'

        };

        var sms_data = {
            "Messages": {
                "Authentication": {
                    "ProductToken": bundle.auth_fields.productKey
                },
                "Msg": [{
                    "Body": {
						"type": "AUTO",
						"Content": bundle.action_fields_full.Body
                    },
                    "From": bundle.action_fields_full.From,
                    "To": [{
                        "Number": bundle.action_fields_full.To
                    }],
                    "customGrouping3": "Zapier",
                    "Reference": bundle.action_fields_full.Reference,
					"minimumNumberOfMessageParts": 1,
					"maximumNumberOfMessageParts": 8
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
        var hmac_hash = z.hmac('sha256', bundle.auth_fields.shrdKey, body_string);

        var user = bundle.auth_fields.userN;
        console.log(bundle.auth_fields.shrdKey +';'+ bundle.auth_fields.userN);
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
    var allc = bundle.action_fields_full.allowedChannels;
    
    var alch = [];
    
    allc = allc.toLowerCase();
    if(allc =='sms' || allc == 'push')
    {
        alch[0] = bundle.action_fields_full.allowedChannels;
    }
    
    if(allc =='push_sms')
    {
        alch[0] = 'push';
        alch[1] = 'sms';
    }
      var hybrid_data = {
            "messages": {
                "authentication": {
                    "producttoken": bundle.auth_fields.productKey
                },
                "msg": [{
                    "from": bundle.action_fields_full.From,
                    "to": [{
                        "number": bundle.action_fields_full.To
                    }],
                    "appKey": bundle.action_fields_full.appkey,
                    "allowedChannels": alch,
                    "Reference": bundle.action_fields_full.Reference,
                    "customGrouping3": "Zapier",
					"minimumNumberOfMessageParts": 1,
					"maximumNumberOfMessageParts": 8,
                    "body": {
						"type": "AUTO",
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
                    "producttoken": bundle.auth_fields.productKey
                },
                "msg": [{
                    "from": bundle.action_fields_full.From,
                    "to": [{
                        "number": bundle.action_fields_full.To
                    }],
                    "body": {
						"type": "AUTO",
                        "content": bundle.action_fields_full.Body
                    },
                    "appKey": bundle.action_fields_full.appkey,
                    "customGrouping3": "Zapier",
                    "Reference": bundle.action_fields_full.Reference,
					"minimumNumberOfMessageParts": 1,
					"maximumNumberOfMessageParts": 8
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
            'Content-Type':'application/json',
            'X-Cm-Producttoken':bundle.auth_fields.productKey
          };
          console.log(validate_head);
        
        var validate_data = {
            "phonenumber":bundle.action_fields_full.PhoneNumber
        };
        
        var validate_resp = JSON.stringify(validate_data);
        console.log(validate_resp);
     return  {
      headers: validate_head,
      data: validate_resp
    };
    },
    LookUp_pre_write: function(bundle) {
    
     var lookup_head ={
            'Content-Type': 'application/json',
            'X-CM-PRODUCTTOKEN': bundle.auth_fields.productKey
        };
        
        console.log(lookup_head);
        
        var lookup_data = {
            "phonenumber": bundle.action_fields_full.Phone_Number,
            "mnp_lookup": true
        };
        
        var lookup_resp = JSON.stringify(lookup_data);
        
        console.log(lookup_resp);
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
        main_body=main_body.replace(/\r/g, "").replace(/\n/g, "");
        console.log(main_body);
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
         
        //bulk_msg=bulk_msg+','+'{"From": "'+from_numbers[j]+'", "To": "['+bulk_to1+']", "customGrouping3": "zapier", "Body": {"Content": "'+main_content[j]+'"}, "Reference": "'+reference[j]+'" }';
        bulk_msg=bulk_msg+','+'{"From": "'+from_numbers[j]+'", "To": \['+bulk_to1+'\]'+',"customGrouping3": "zapier", "Body": {"type":"AUTO", "Content": "'+main_content[j]+'"}, "Reference": "'+reference[j]+'","minimumNumberOfMessageParts": 1, "maximumNumberOfMessageParts": 8 }';        
        }
        bulk_msg=bulk_msg.substr(1);
        console.log(bulk_msg);
       
       var bulk_msg_data={
            "Messages": {
                "Authentication": {
                    "ProductToken": bundle.auth_fields.productKey
                },
                "Msg": [
                     bulk_msg
                ]
            }
        };
       console.log(bulk_msg_data);
       
       
       //var bulk_msg_resp = JSON.stringify(bulk_msg_data).replace(/\\\\/g,"").replace(/\["/g,"[").replace(/"\]/g, "]").replace(/\\/g,"");
       var bulk_msg_resp = JSON.stringify(bulk_msg_data).replace(/\\\\/g,"").replace(/\["/g,"\[").replace(/"\]/g, "\]").replace(/\\/g,"");
       console.log(bulk_msg_resp);
       return {
            headers: bulk_sms_head,
            data: bulk_msg_resp
        };

    }

};



// START: FOOTER -- AUTOMATICALLY ADDED FOR COMPATIBILITY - v1.2.0
module.exports = Zap;
// END: FOOTER -- AUTOMATICALLY ADDED FOR COMPATIBILITY - v1.2.0
