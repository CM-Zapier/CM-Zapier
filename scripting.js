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

String.prototype.replaceAll = function (search, replacement) {
    return this.replace(new RegExp(search, 'g'), replacement)
}

String.prototype.matches = function (regex) {
    return regex.test(this)
}

Date.prototype.addMinutes = function (minutes) {
    return new Date(this.getTime() + minutes * 60 * 1000)
}

Date.prototype.addHours = function (hours) {
    return new Date(this.getTime() + hours * 60 * 60 * 1000)
}

var Settings = {
    useVoiceTokenAuthentication: false, // True if Voice should use token authentication, false if Voice should use username + shared key.
    textFromField: {
        maxDigits: 16,
        maxChars: 11
    },
    validityTime: {
        def: "48h0m", // Default
        min: 1,
        max: 48 * 60
    },
    defaultReference: "None",
    debug: false // True to print all errors in json.
}

function ZapierRequest(headers, data) {
    return {
        headers: headers,
        data: typeof data == "string" ? data : JSON.stringify(data) // Our data needs to be a string, so when it's JSON convert it.
    }
}

function RequestHeaders(bundle) {
    return {
        'Content-Type': "application/json",
        'X-CM-PRODUCTTOKEN': bundle.auth_fields.productToken
    }
}

var Messages = {
    getAuthentication: function (bundle) {
        return {
            ProductToken: bundle.auth_fields.productToken
        }
    },

    getData: function (authentication, messageList) {
        return {
            Messages: {
                Authentication: authentication,
                Msg: messageList
            }
        }
    }
}

// Log JSON as readable string.
function logJSON(json) {
    console.log(JSON.stringify(json, null, 4))
}

// Convert the input (like 1h2m) to a date from now (current datetime + 1h2m)
function parseValidityTime(input) {
    // If the input is undefined, use default Validity time.
    var validityTime = input === undefined ? Settings.validityTime.def : input

    if (!validityTime.matches(/[0-9]*h([0-5]|)[0-9]m/)) {
        throw new ErrorException("Validity time is in an incorrect format")
    }

    // Convert the input (like 1h2m) to minutes (1 * 60 + 2)
    validityTime = validityTime.split("h") // Result: ["1", "2m"]
    validityTime[1] = validityTime[1].replace("m", "")

    // Convert strings in the array to integers
    validityTime = validityTime.map(function (item) {
        return parseInt(item)
    })

    var hours = validityTime[0]
    var minutes = validityTime[1]
    var total = hours * 60 + minutes

    if (total > Settings.validityTime.max) {
        throw new ErrorException("Validity time is larger than allowed.")
    } else if (total < Settings.validityTime.min) {
        throw new ErrorException("Validity time is smaller than allowed.")
    }

    var currentDate = new Date()
    var validityDate = currentDate.addHours(hours).addMinutes(minutes)

    return validityDate.toISOString().replace("T", " ").split(".")[0] + " GMT" // Convert the date to a date CM.com can read.
}

// When Zapier gets a result from CM.com, check it for errors and throw it as readable message.
function throwResponseError(bundle) {
    if (!(bundle.response.status_code >= 200 && bundle.response.status_code < 300)) {
        var response = JSON.parse(bundle.response.content)
        var errorMessage
        if (Settings.debug) { // Throw json error when debugging.
            errorMessage = JSON.stringify(response, null, 4)
        } else {
            var errorMessages = [] // A list of error messages
            if (response.message !== undefined) { // If the error has a single message.
                errorMessages.push(response.message) // Add the message to the list
            } else if (response.messages !== undefined && response.messages.length > 0) { // If the error has multiple messages in an array.
                errorMessages = response.messages.filter(function (item) {
                    return item.messageDetails !== null // Filter all success messages from the list
                }).map(function (item) { // Convert all error messages from json to text.
                    // Example: Message 2 (to 00447911123457 with reference your_reference_B): A body without content was found (error code 304)
                    return "Message " + (response.messages.indexOf(item) + 1) + " (to " + item.to + (item.reference != "None" ? " with reference " + item.reference : "") + ") " +
                        item.messageDetails + " (error code " + item.errorCode + ")"
                })
            }

            if (errorMessages.length === 0) { // If no error messages where found, use details and errorCode.
                var msg = ""

                if (response.details !== undefined) {
                    msg += response.details
                }
                if (response.errorCode !== undefined) {
                    msg += response.details !== undefined ? " (error code: " + response.errorCode + ")" : "Error with code: " + response.errorCode
                }

                errorMessages.push(msg)
            }

            errorMessage = errorMessages.join("\n")
        }
        throw new ErrorException(errorMessage)
    }
}

var Zap = {
    /* ------------ TEXT ------------ */
    Messages_pre_write: function (bundle) {
        var fromNumbersArray = bundle.action_fields_full.From
        var toNumbersArray = bundle.action_fields_full.To
        var smsBodyArray = bundle.action_fields_full.Body
        var smsReferenceArray = bundle.action_fields_full.Reference
        var validityTimeArray = bundle.action_fields_full.ValidityTime

        // Test if amount of fields is correct.
        if (fromNumbersArray.length > toNumbersArray.length) {
            throw new ErrorException("Error: there are more fields in 'From' than in 'To'. They need to be equal.")
        } else if (toNumbersArray.length > fromNumbersArray.length) {
            throw new ErrorException("Error: there are more fields in 'To' than in 'From'. They need to be equal.")
        }

        if (fromNumbersArray.length > smsBodyArray.length) {
            throw new ErrorException("Error: there are more fields in 'From' than in 'Body'. They need to be equal.")
        } else if (smsBodyArray.length > fromNumbersArray.length) {
            throw new ErrorException("Error: there are more fields in 'Body' than in 'From'. They need to be equal.")
        }

        // Create a list of messages
        var messageList = []
        for (var j = 0; j < fromNumbersArray.length; j++) { // Iterate trough all messages
            // Each message can be send to multiple numbers
            var numberListText = toNumbersArray[j]
            var numberList = numberListText.split(',')

            var toNumbersList = numberList.map(function (item) {
                return {
                    number: item.trim()
                }
            })

            var from = fromNumbersArray[j].trim();

            if(from.matches(/[0-9+]*/)){
                if(from.length > Settings.textFromField.maxDigits){ 
                    throw new ErrorException("Message " + (j + 1) + ": from length is more than maximally allowed (" + Settings.textFromField.maxDigits + " digits)")
                }
            } else if(from.length > Settings.textFromField.maxChars){ 
                throw new ErrorException("Message " + (j + 1) + ": from length is more than maximally allowed (" + Settings.textFromField.maxChars + " alphanumerical characters)")
            }

            messageList.push({
                from: from,
                to: toNumbersList,
                body: {
                    type: "AUTO",
                    content: smsBodyArray[j].replace(/\r/g, "").replace(/\n/g, "").trim()
                },
                reference: smsReferenceArray[j] === undefined ? Settings.defaultReference : smsReferenceArray[j].trim(),
                minimumNumberOfMessageParts: 1,
                maximumNumberOfMessageParts: 8,
                validity: parseValidityTime(validityTimeArray[j]),
                customGrouping3: "Zapier" // Allows CM.com to track where requests originate from.
            })
        }

        var authentication = Messages.getAuthentication(bundle)
        var requestData = Messages.getData(authentication, messageList)
        var requestHeaders = new RequestHeaders(bundle)
        return new ZapierRequest(requestHeaders, requestData)
    },

    Messages_post_write: throwResponseError,

    /* ------------ VOICE ------------ */
    VoiceText_pre_write: function (bundle) {
        var main = bundle.action_fields_full.Language
        console.log(main)

        var mainSplitted = main.split(";")

        var voiceLanguage = mainSplitted[0]
        var voiceGender = mainSplitted[1]
        var voiceNumber = mainSplitted[2]

        var requestData = {
            caller: bundle.action_fields_full.From,
            callees: bundle.action_fields_full.To,
            prompt: bundle.action_fields_full.Text,
            'prompt-type': "TTS",
            voice: {
                language: voiceLanguage,
                gender: voiceGender,
                number: voiceNumber
            },
            anonymous: false,
            validity: parseValidityTime(bundle.action_fields_full.ValidityTime)
        }

        var requestHeaders = Settings.useVoiceTokenAuthentication ? new RequestHeaders(bundle) : {
            'Content-Type': 'application/json',
            'Authorization': "username=" + bundle.auth_fields.userN + ";signature=" + z.hmac('sha256', bundle.auth_fields.shrdKey, JSON.stringify(requestData))
        }

        return new ZapierRequest(requestHeaders, requestData)
    },

    VoiceText_post_write: throwResponseError,

    /* ------------ NUMBER VALIDATION ------------ */

    Num_Validation_pre_search: function (bundle) {
        var requestHeaders = new RequestHeaders(bundle)

        var requestData = {
            phonenumber: bundle.search_fields.PhoneNumber
        }

        return {
            url: "https://api.cmtelecom.com/v1.1/numbervalidation",
            headers: requestHeaders,
            data: JSON.stringify(requestData),
            method: "POST"
        }
    },

    Num_Validation_post_search: function (bundle) {
        throwResponseError(bundle) // Stops when an error is thrown, otherwise continue below.

        return [{
            response: "Success",
            id: 1,
            status_code: bundle.response.status_code,
            content: JSON.parse(bundle.response.content),
            headers: bundle.response.headers
        }]
    },

    Num_Validation_post_read_resource: function (bundle) {
        throwResponseError(bundle) // Stops when an error is thrown, otherwise continue below.

        return [{
            response: "Success",
            id: 1,
            status_code: bundle.response.status_code,
            content: JSON.parse(bundle.response.content),
            headers: bundle.response.headers
        }]
    }
}

// START: FOOTER -- AUTOMATICALLY ADDED FOR COMPATIBILITY - v1.2.0
module.exports = Zap;
// END: FOOTER -- AUTOMATICALLY ADDED FOR COMPATIBILITY - v1.2.0

