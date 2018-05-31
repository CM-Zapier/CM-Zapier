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

var settings = {
    useVoiceTokenAuthentication: false, // True if Voice should use token authentication, false if Voice should use username + shared key.
    debug: false // True to print all errors in json.
};

function createRequest(headers, data) {
    return {
        headers: headers,
        data: typeof data == "string" ? data : JSON.stringify(data) // Our data needs to be a string, so when it's JSON convert it.
    };
}

function createMessagesRequestData(authentication, msg) {
    return {
        Messages: {
            Authentication: authentication,
            Msg: msg
        }
    };
}

function createAuthentication(bundle) {
    return {
        ProductToken: bundle.auth_fields.productToken
    };
}

function logJSON(json) {
    console.log(JSON.stringify(json, null, 4));
}

function throwResponseError(bundle) {
    if (!(bundle.response.status_code >= 200 && bundle.response.status_code < 300)) {
        var response = JSON.parse(bundle.response.content);
        var errorMessage = "";
        try {
            if (settings.debug) { // Throw json error when debugging.
                errorMessage = JSON.stringify(response, null, 4);
            } else if (response.message !== undefined) { // Voice error handling
                errorMessage = response.message;
            } else if (response.messages !== undefined) { // Text error handling
                if(response.messages.length == 0){
                    errorMessage = response.details;
                } else {
                    for (var i = 0; i < response.messages.length; i++) {
                        errorMessage += response.messages[i].messageDetails + "\n";
                    }
                }
            }
            errorMessage += " (error code: " + response.errorCode + ")";
        } catch (error) {
            errorMessage = JSON.stringify(response, null, 4);
        }
        throw new ErrorException(errorMessage);
    }
}

var Zap = {
    /* ------------ TEXT ------------ */

    Messages_pre_write: function (bundle) {
        var authentication = createAuthentication(bundle);

        var requestHeaders = {
            'Content-Type': 'application/json'
        };

        var splitter = "||";

        // Field with numbers where to send message from
        var fromNumbersText = bundle.action_fields_full.From;
        var fromNumbersArray = fromNumbersText.split(splitter);

        // Field with numbers where to send message to
        var toNumbersText = bundle.action_fields_full.To;
        var toNumbersArray = toNumbersText.split(splitter);

        // Body field/content of the message
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
            Field 'To' as "number1 || number2, number3",
            Field 'Body' as "Hello! || Hi!":
            Number 1 receives "Hello!",
            Number 2 and 3 receive "Hi!"
            */
            var numberListText = toNumbersArray[j];
            var numberList = numberListText.split(',');

            var toNumbersList = [];
            for (var k = 0; k < numberList.length; k++) {
                toNumbersList.push({
                    Number: numberList[k].trim()
                });
            }

            messageList.push({
                from: fromNumbersArray[j].trim(),
                to: toNumbersList,
                body: {
                    type: "AUTO",
                    content: smsBodyArray[j].trim()
                },
                reference: smsReferenceArray[j] === undefined ? "None" : smsReferenceArray[j].trim(),
                minimumNumberOfMessageParts: 1,
                maximumNumberOfMessageParts: 8,
                customGrouping3: "Zapier" // Allows CM.com to track where requests originate from.
            });
        }
        logJSON(messageList);

        var requestData = createMessagesRequestData(authentication, messageList);
        logJSON(requestData);

        return createRequest(requestHeaders, requestData);
    },

    Messages_post_write: throwResponseError,


    /* ------------ VOICE ------------ */

    VoiceText_pre_write: function (bundle) {
        var main = bundle.action_fields_full.Language;
        console.log(main);

        var mainSplitted = main.split(";");

        var voiceLanguage = mainSplitted[0];
        var voiceGender = mainSplitted[1];
        var voiceNumber = mainSplitted[2];

        var requestData = {
            callee: bundle.action_fields_full.Callee,
            caller: bundle.action_fields_full.Caller,
            anonymous: false,
            prompt: bundle.action_fields_full.Text,
            'prompt-type': "TTS",
            voice: {
                language: voiceLanguage,
                gender: voiceGender,
                number: voiceNumber
            }
        };

        var requestHeaders = {
            'Content-Type': 'application/json'
        };

        if (settings.useVoiceTokenAuthentication) {
            requestHeaders["X-CM-PRODUCTTOKEN"] = bundle.auth_fields.productToken;
        } else {
            var body_string = JSON.stringify(requestData);

            // z.hmac(algorithm, key, string, encoding="hex")
            var hmac_hash = z.hmac('sha256', bundle.auth_fields.shrdKey, body_string);

            var user = bundle.auth_fields.userN;
            console.log(bundle.auth_fields.shrdKey + ';' + bundle.auth_fields.userN);

            requestHeaders.Authorization = 'username=' + user + ';signature=' + hmac_hash;
        }

        return createRequest(requestHeaders, requestData);
    },

    VoiceText_post_write: throwResponseError


    /* ------------ PAYMENTS ------------ */

    // TODO


    /* ------------ NUMBER VALIDATION ------------ */

    // Fix code in legacy.js
};

// START: FOOTER -- AUTOMATICALLY ADDED FOR COMPATIBILITY - v1.2.0
module.exports = Zap;
// END: FOOTER -- AUTOMATICALLY ADDED FOR COMPATIBILITY - v1.2.0
