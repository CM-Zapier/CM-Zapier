'use strict';

function createRequest(headers, data){
    return {
        headers: headers,
        data: typeof data == "string" ? data : JSON.stringify(data) // Our data needs to be a string, so when it's JSON convert it.
    };
}

function createMessagesRequestData(authentication, msg){
    return {
        Messages: {
            Authentication: authentication,
            Msg: msg
        }
    };
}

function createAuthentication(bundle){
    return {
        ProductToken: bundle.auth_fields.productKey
    };
}

var Zap = {
    /* ------------ TEXT ------------ */
    
    Messages_pre_write: function(bundle) {
        var authentication = createAuthentication(bundle);
        
        var requestHeaders = {
            'Content-Type': 'application/json'
        };
        
        var splitter = "||";
        
        // Field with numbers where to send message to
        var toNumbersText = bundle.action_fields_full.To;
        var toNumbersArray = toNumbersText.split(splitter);
        
        // Field with numbers where to send message from
        var fromNumbersText = bundle.action_fields_full.From;
        var fromNumbersArray = fromNumbersText.split(splitter);
        
        // Body field
        var smsBodyText = bundle.action_fields_full.Body;
        smsBodyText = smsBodyText.replace(/\r/g, "").replace(/\n/g, ""); // This removes all newlines/line breaks in the body
        console.log(smsBodyText);
        var smsBodyArray = smsBodyText.split(splitter);
        
        // Reference field
        var smsReferenceText = bundle.action_fields_full.Reference;
        var smsReferenceArray = smsReferenceText.split(splitter);
        
        // Create a list of messages
        var messageList = [];
        for (var j = 0; j < fromNumbersArray.length; j++) {
            // Each message can be sent to multiple numbers
            /* 
            Example: 
            Field 'To' as "number1||number2,number3||number4":
            The first message will be sent to number1,
            The second message will be sent to both number2 and number3,
            The last message will be sent to number 4.
            */
            var numberListText = toNumbersArray[j];
            var numberList = numberListText.split(',');
            
            var toNumbersList = [];
            for(var k = 0; k < numberList.length; k++) {
                toNumbersList.push({
                    Number: numberList[k]
                });
            }
            
            messageList.push({
                From: fromNumbersArray[j],
                To: toNumbersList,
                customGrouping3: "zapier",
                Body: {
                    type: "AUTO",
                    Content: smsBodyArray[j]
                },
                Reference: smsReferenceArray[j],
                minimumNumberOfMessageParts: 1,
                maximumNumberOfMessageParts: 8
            });
        }
        console.log(JSON.stringify(messageList), null, 4);
        
        var requestData = createMessagesRequestData(authentication, messageList);
        console.log(requestData);
        
        return createRequest(requestHeaders, requestData);
    },
    
    Messages_post_write: function(bundle) {
        if(!(bundle.response.status_code >= 200 && bundle.response.status_code < 300)){
            throw new ErrorException(bundle.response.content);
        }
    },
    
    Hybrid_Messages_pre_write: function(bundle) {
        var authentication = createAuthentication(bundle);
        
        var requestHeaders = {
            'Content-Type': 'application/json'
        };

        var allowedChannels = bundle.action_fields_full.allowedChannels;
    
        var allowedChannelsList = [];
    
        allowedChannels = allowedChannels.toLowerCase();
        if(allowedChannels =='sms' || allowedChannels == 'push') {
            allowedChannelsList[0] = bundle.action_fields_full.allowedChannels;
        }
    
        if(allowedChannels =='push_sms') {
            allowedChannelsList[0] = 'push';
            allowedChannelsList[1] = 'sms';
        }
        var messageList = [{
            from: bundle.action_fields_full.From,
            to: [{
                number: bundle.action_fields_full.To
            }],
            appKey: bundle.action_fields_full.appkey,
            allowedChannels: allowedChannelsList,
            Reference: bundle.action_fields_full.Reference,
            customGrouping3: "Zapier",
            minimumNumberOfMessageParts: 1,
            maximumNumberOfMessageParts: 8,
            body: {
                type: "AUTO",
                content: bundle.action_fields_full.Body
            }
        }];
        var requestData = createMessagesRequestData(authentication, messageList);
        
        return createRequest(requestHeaders, requestData);
    },
    
    
    Hybrid_Messages_post_write: function(bundle) {
        if(!(bundle.response.status_code >= 200 && bundle.response.status_code < 300)){
            throw new ErrorException(bundle.response.content);
        }
    },

    Push_Messages_pre_write: function(bundle) {
        var push_head = {
            'Content-Type': 'application/json'
        };

        var push_data = {
            "messages": { // function createMessagesRequestData
                "authentication": {
                    "producttoken": bundle.auth_fields.productKey // function createAuthentication
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

        return createRequest(push_head, push_data);
    },
    
    Push_Messages_post_write: function(bundle) {
        if(!(bundle.response.status_code >= 200 && bundle.response.status_code < 300)){
            throw new ErrorException(bundle.response.content);
        }
    },
    
    
    /* ------------ VOICE ------------ */
    
    VoiceText_pre_write: function(bundle) {
        var main = bundle.action_fields_full.Language;
        console.log(main);

        var mainSplitted = main.split(";");

        var lan = mainSplitted[0];
        var gen = mainSplitted[1];
        var num = mainSplitted[2];

        var requestData = {
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

        var body_string = JSON.stringify(requestData);

        // z.hmac(algorithm, key, string, encoding="hex")
        var hmac_hash = z.hmac('sha256', bundle.auth_fields.shrdKey, body_string);

        var user = bundle.auth_fields.userN;
        console.log(bundle.auth_fields.shrdKey +';'+ bundle.auth_fields.userN);
        var requestHeaders = {
            'Content-Type': 'application/json',
            'Authorization': 'username=' + user + ';signature=' + hmac_hash
        };

        return createRequest(requestHeaders, requestData);
    },

    VoiceText_post_write: function(bundle) {
        if(!(bundle.response.status_code >= 200 && bundle.response.status_code < 300)){
            throw new ErrorException(bundle.response.content);
        }
    },
    
    /* ------------ PAYMENTS ------------ */
    
    // TODO
    
    
    /* ------------ NUMBER VALIDATION ------------ */
    
    Num_Validation_post_read_resource: function(bundle) {
        var nparsed_response = z.JSON.parse(bundle.response.content);
        var nheads = bundle.response.headers;
        var nst_code = bundle.response.status_code;
        var nresult = {"result_code":200,"Status":"Success"};
        return [{
            response: "Success",
            "id": 1,
            status_code: nst_code,
            content: {
                "carrier": nparsed_response.carrier,
                "country_code": nparsed_response.country_code,
                "country_iso": nparsed_response.country_iso,
                "format_e164": nparsed_response.format_e164,
                "format_international": nparsed_response.format_international,
                "format_national": nparsed_response.format_national,
                "region": nparsed_response.region,
                "region_code": nparsed_response.region_code,
                "timezone": nparsed_response.timezone,
                "type": {
                    "mobile": nparsed_response.type.mobile,
                    "fixed_line": nparsed_response.type.fixed_line,
                    "fixed_line_or_mobile": nparsed_response.type.fixed_line_or_mobile,
                    "voip": nparsed_response.type.voip,
                    "toll_free": nparsed_response.type.toll_free,
                    "premium_rate": nparsed_response.type.premium_rate,
                    "standard_rate": nparsed_response.type.standard_rate,
                    "shared_cost": nparsed_response.type.shared_cost,
                    "personal": nparsed_response.type.personal,
                    "pager": nparsed_response.type.pager,
                    "voicemail": nparsed_response.type.voicemail,
                    "shortcode": nparsed_response.type.shortcode,
                    "emergency": nparsed_response.type.emergency,
                    "unknown": nparsed_response.type.unknown
                },
                "valid_number": nparsed_response.valid_number
            }/*,
            headers:{
                "Content-Encoding": nheads['Content-Encoding'], 
                "Transfer-Encoding": nheads['Transfer-Encoding'], 
                "Strict-Transport-Security": nheads['Strict-Transport-Security'], 
                "Vary": nheads['Vary'], 
                "Server": nheads['Server'], 
                "Connection": nheads['Connection'], 
                "Cache-Control": nheads['Cache-Control'], 
                "Date": nheads['Date'], 
                "Access-Control-Allow-Credentials": nheads['Access-Control-Allow-Credentials'], 
                "Content-Type": nheads['Content-Type'], 
                "Access-Control-Allow-Origin": nheads['Access-Control-Allow-Origin']
            }*/
        }];
    },

    Num_Validation_post_search: function(bundle) {
        var nparsed_response = z.JSON.parse(bundle.response.content);
        var nheads = bundle.response.headers;
        var nst_code = bundle.response.status_code;
        var nresult = {
            "result_code":200,
            "Status":"Success"
        };
        return [{
            response: "Success",
            "id": 1,
            status_code: nst_code,
            content: { 
                "carrier": nparsed_response.carrier,
                "country_code": nparsed_response.country_code,
                "country_iso": nparsed_response.country_iso,
                "format_e164": nparsed_response.format_e164,
                "format_international": nparsed_response.format_international,
                "format_national": nparsed_response.format_national,
                "region": nparsed_response.region,
                "region_code": nparsed_response.region_code,
                "timezone": nparsed_response.timezone,
                "type": {
                    "mobile": nparsed_response.type.mobile,
                    "fixed_line": nparsed_response.type.fixed_line,
                    "fixed_line_or_mobile": nparsed_response.type.fixed_line_or_mobile,
                    "voip": nparsed_response.type.voip,
                    "toll_free": nparsed_response.type.toll_free,
                    "premium_rate": nparsed_response.type.premium_rate,
                    "standard_rate": nparsed_response.type.standard_rate,
                    "shared_cost": nparsed_response.type.shared_cost,
                    "personal": nparsed_response.type.personal,
                    "pager": nparsed_response.type.pager,
                    "voicemail": nparsed_response.type.voicemail,
                    "shortcode": nparsed_response.type.shortcode,
                    "emergency": nparsed_response.type.emergency,
                    "unknown": nparsed_response.type.unknown
                },
                "valid_number": nparsed_response.valid_number
            },
            headers: {
                "Content-Encoding": nheads.Content_Encoding, 
                "Transfer-Encoding": nheads.Transfer_Encoding, 
                "Strict-Transport-Security": nheads.Strict_Transport_Security, 
                "Vary": nheads.Vary, 
                "Server": nheads.Server, 
                "Connection": nheads.Connection, 
                "Cache-Control": nheads.Cache_Control, 
                "Date": nheads.Date, 
                "Access-Control-Allow-Credentials": nheads.Access_Control_Allow_Credentials, 
                "Content-Type": nheads.Content_Type, 
                "Access-Control-Allow-Origin": nheads.Access_Control_Allow_Origin
            }
        }];
    },

    Num_Validation_pre_search: function(bundle) {
        var lookup_headnw = {
            'Content-Type': 'application/json',
            'X-CM-PRODUCTTOKEN': bundle.auth_fields.productKey
        };
        
        console.log(lookup_headnw);
       
        return {
            headers: lookup_headnw
        };
    },

    Num_LookUp_post_read_resource: function(bundle) {
        var parsed_response = z.JSON.parse(bundle.response.content);
        var heads=bundle.response.headers;
        var st_code=bundle.response.status_code;
        return [{
            response: "Success",
            "id": 1,
            status_code: st_code,
            content: {
                "active_number": parsed_response.active_number,
                "carrier": parsed_response.carrier,
                "carrier_mcc": parsed_response.carrier_mcc,
                "carrier_mnc": parsed_response.carrier_mnc,
                "country_code": parsed_response.country_code,
                "country_iso": parsed_response.country_iso,
                "format_e164": parsed_response.format_e164,
                "format_international": parsed_response.format_international,
                "format_national": parsed_response.format_national,
                "ported": parsed_response.ported,
                "region": parsed_response.region,
                "region_code": parsed_response.region_code,
                "roaming": parsed_response.roaming,
                "roaming_carrier": parsed_response.roaming_carrier,
                "roaming_country_iso": parsed_response.roaming_country_iso,
                "roaming_country_prefix": parsed_response.roaming_country_prefix,
                "roaming_mcc": parsed_response.roaming_mcc,
                "roaming_mnc": parsed_response.roaming_mnc,
                "timezone": parsed_response.timezone,
                "type": {
                    "mobile": parsed_response.type.mobile,
                    "fixed_line": parsed_response.type.fixed_line,
                    "fixed_line_or_mobile": parsed_response.type.fixed_line_or_mobile,
                    "voip": parsed_response.type.voip,
                    "toll_free": parsed_response.type.toll_free,
                    "premium_rate": parsed_response.type.premium_rate,
                    "standard_rate": parsed_response.type.standard_rate,
                    "shared_cost": parsed_response.type.shared_cost,
                    "personal": parsed_response.type.personal,
                    "pager": parsed_response.type.pager,
                    "voicemail": parsed_response.type.voicemail,
                    "shortcode": parsed_response.type.shortcode,
                    "emergency": parsed_response.type.emergency,
                    "unknown": parsed_response.type.unknown
                },
                "valid_number": parsed_response.valid_number
            }/*,
            headers: {
                "Content-Encoding": heads.Content-Encoding, 
                "Transfer-Encoding": heads.Transfer-Encoding, 
                "Strict-Transport-Security": heads.Strict-Transport-Security, 
                "Vary": heads.Vary, 
                "Server": heads.Server, 
                "Connection": heads.Connection, 
                "Cache-Control": heads.Cache-Control, 
                "Date": heads.Date, 
                "Access-Control-Allow-Credentials": heads.Access-Control-Allow-Credentials, 
                "Content-Type": heads.Content-Type, 
                "Access-Control-Allow-Origin": heads.Access-Control-Allow-Origin
            }*/
        }];
    },
    
    Num_LookUp_pre_search: function(bundle) {
        var lookup_headn = {
            'Content-Type': 'application/json',
            'X-CM-PRODUCTTOKEN': bundle.auth_fields.productKey
        };
        
        console.log(lookup_headn);
       
        return {
            headers: lookup_headn
        };
    },

    Num_LookUp_post_search: function(bundle) {
        var parsed_response = z.JSON.parse(bundle.response.content);
        var heads = bundle.response.headers;
        var st_code = bundle.response.status_code;
        var result = {
            "result_code":200,
            "Status":"Success"
        };
        return [{
            response: "Success",
            "id": 1,
            status_code: st_code,
            content: { 
                "active_number": parsed_response.active_number,
                "carrier": parsed_response.carrier,
                "carrier_mcc": parsed_response.carrier_mcc,
                "carrier_mnc": parsed_response.carrier_mnc,
                "country_code": parsed_response.country_code,
                "country_iso": parsed_response.country_iso,
                "format_e164": parsed_response.format_e164,
                "format_international": parsed_response.format_international,
                "format_national": parsed_response.format_national,
                "ported": parsed_response.ported,
                "region": parsed_response.region,
                "region_code": parsed_response.region_code,
                "roaming": parsed_response.roaming,
                "roaming_carrier": parsed_response.roaming_carrier,
                "roaming_country_iso": parsed_response.roaming_country_iso,
                "roaming_country_prefix": parsed_response.roaming_country_prefix,
                "roaming_mcc": parsed_response.roaming_mcc,
                "roaming_mnc": parsed_response.roaming_mnc,
                "timezone": parsed_response.timezone,
                "type": {
                    "mobile": parsed_response.type.mobile,
                    "fixed_line": parsed_response.type.fixed_line,
                    "fixed_line_or_mobile": parsed_response.type.fixed_line_or_mobile,
                    "voip": parsed_response.type.voip,
                    "toll_free": parsed_response.type.toll_free,
                    "premium_rate": parsed_response.type.premium_rate,
                    "standard_rate": parsed_response.type.standard_rate,
                    "shared_cost": parsed_response.type.shared_cost,
                    "personal": parsed_response.type.personal,
                    "pager": parsed_response.type.pager,
                    "voicemail": parsed_response.type.voicemail,
                    "shortcode": parsed_response.type.shortcode,
                    "emergency": parsed_response.type.emergency,
                    "unknown": parsed_response.type.unknown
                },
                "valid_number": parsed_response.valid_number
            },
            headers: {
                "Content-Encoding": heads.Content_Encoding, 
                "Transfer-Encoding": heads.Transfer_Encoding, 
                "Strict-Transport-Security": heads.Strict_Transport_Security, 
                "Vary": heads.Vary, 
                "Server": heads.Server, 
                "Connection": heads.Connection, 
                "Cache-Control": heads.Cache_Control, 
                "Date": heads.Date, 
                "Access-Control-Allow-Credentials": heads.Access_Control_Allow_Credentials, 
                "Content-Type": heads.Content_Type, 
                "Access-Control-Allow-Origin": heads.Access_Control_Allow_Origin
            }
        }];
    },
      
    ValidatePhoneNumber_pre_write: function(bundle) {
        var requestHeaders = {
            'Content-Type':'application/json',
            'X-Cm-Producttoken':bundle.auth_fields.productKey
        };

        console.log(requestHeaders);
        
        var requestData = {
            phonenumber: bundle.action_fields_full.PhoneNumber
        };

        return createRequest(requestHeaders, requestData);
    },
    
    ValidatePhoneNumber_post_write: function(bundle) {
        if(!(bundle.response.status_code >= 200 && bundle.response.status_code < 300)){
            throw new ErrorException(bundle.response.content);
        }
    },
    
    LookUp_pre_write: function(bundle) {
        var requestHeaders = {
            'Content-Type': 'application/json',
            'X-CM-PRODUCTTOKEN': bundle.auth_fields.productKey
        };
        
        console.log(requestHeaders);
        
        var requestData = {
            phonenumber: bundle.action_fields_full.Phone_Number,
            mnp_lookup: true
        };
        
        return createRequest(requestHeaders, requestData);
    }
};