var Zap = {
    Hybrid_Messages_pre_write: function (bundle) {
        var authentication = createAuthentication(bundle);

        var requestHeaders = {
            'Content-Type': 'application/json'
        };

        var allowedChannels = bundle.action_fields_full.allowedChannels;
        allowedChannels = allowedChannels.toLowerCase();

        var allowedChannelsList = [];

        if (allowedChannels == 'sms' || allowedChannels == 'push') {
            allowedChannelsList.push(allowedChannels);
        } else if (allowedChannels == 'push_sms') {
            allowedChannelsList.push('push');
            allowedChannelsList.push('sms');
        }

        var messageList = [{
            from: bundle.action_fields_full.From,
            to: [{
                number: bundle.action_fields_full.To
            }],
            body: {
                type: "AUTO",
                content: bundle.action_fields_full.Body
            },
            reference: bundle.action_fields_full.Reference,
            appKey: bundle.action_fields_full.appkey,
            allowedChannels: allowedChannelsList,
            minimumNumberOfMessageParts: 1,
            maximumNumberOfMessageParts: 8,
            customGrouping3: "Zapier" // Allows CM.com to track where requests originate from.
        }];

        var requestData = createMessagesRequestData(authentication, messageList);

        return createRequest(requestHeaders, requestData);
    },


    Hybrid_Messages_post_write: throwResponseError,

    Push_Messages_pre_write: function (bundle) {
        var authentication = createAuthentication(bundle);

        var requestHeaders = {
            'Content-Type': 'application/json'
        };

        var messageList = [{
            from: bundle.action_fields_full.From,
            to: [{
                number: bundle.action_fields_full.To
            }],
            body: {
                type: "AUTO",
                content: bundle.action_fields_full.Body
            },
            reference: bundle.action_fields_full.Reference,
            appKey: bundle.action_fields_full.appkey,
            minimumNumberOfMessageParts: 1,
            maximumNumberOfMessageParts: 8,
            customGrouping3: "Zapier" // Allows CM.com to track where requests originate from.
        }];

        var requestData = createMessagesRequestData(authentication, messageList)

        return createRequest(requestHeaders, requestData);
    },

    Push_Messages_post_write: throwResponseError,

    // Number Validation
    Num_Validation_pre_search: function (bundle) {
        var lookup_headnw = {
            'Content-Type': 'application/json',
            'X-CM-PRODUCTTOKEN': bundle.auth_fields.productToken
        };

        console.log(lookup_headnw);

        return {
            headers: lookup_headnw
        };
    },

    Num_Validation_post_search: function (bundle) {
        var nparsed_response = z.JSON.parse(bundle.response.content);
        var nheads = bundle.response.headers;
        var nst_code = bundle.response.status_code;
        var nresult = {
            "result_code": 200,
            "Status": "Success"
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

    Num_Validation_post_read_resource: function (bundle) {
        var nparsed_response = z.JSON.parse(bundle.response.content);
        var nheads = bundle.response.headers;
        var nst_code = bundle.response.status_code;
        var nresult = { "result_code": 200, "Status": "Success" };
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

    // Number Lookup
    Num_LookUp_pre_search: function (bundle) {
        var lookup_headn = {
            'Content-Type': 'application/json',
            'X-CM-PRODUCTTOKEN': bundle.auth_fields.productToken
        };

        console.log(lookup_headn);

        return {
            headers: lookup_headn
        };
    },

    Num_LookUp_post_search: function (bundle) {
        var parsed_response = z.JSON.parse(bundle.response.content);
        var heads = bundle.response.headers;
        var st_code = bundle.response.status_code;
        var result = {
            "result_code": 200,
            "Status": "Success"
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

    Num_LookUp_post_read_resource: function (bundle) {
        var parsed_response = z.JSON.parse(bundle.response.content);
        var heads = bundle.response.headers;
        var st_code = bundle.response.status_code;
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

    // Validate phone number
    ValidatePhoneNumber_pre_write: function (bundle) {
        var requestHeaders = {
            'Content-Type': 'application/json',
            'X-Cm-Producttoken': bundle.auth_fields.productToken
        };

        console.log(requestHeaders);

        var requestData = {
            phonenumber: bundle.action_fields_full.PhoneNumber
        };

        return createRequest(requestHeaders, requestData);
    },

    ValidatePhoneNumber_post_write: throwResponseError,

    // Look up
    LookUp_pre_write: function (bundle) {
        var requestHeaders = {
            'Content-Type': 'application/json',
            'X-CM-PRODUCTTOKEN': bundle.auth_fields.productToken
        };

        console.log(requestHeaders);

        var requestData = {
            phonenumber: bundle.action_fields_full.Phone_Number,
            mnp_lookup: true
        };

        return createRequest(requestHeaders, requestData);
    }
}