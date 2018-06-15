'use strict';

var isNodeJS = typeof module != "undefined";

if(isNodeJS){
    function ErrorException(message){
        return new Error(message);
    }
}

/**
 * Replaces all search occurences in the string (this object) with the replacement
 * @param {*} search - characters to replace
 * @param {*} replacement - replacement for the characters
 * @returns the original string, with all search occurences replaced with replacement
 */
String.prototype.replaceAll = function (search, replacement) {
    return this.replace(new RegExp(search, 'g'), replacement);
};

/**
 * Tests if the string matches the given regex.
 * @param {*} regex 
 * @returns true if the string matches the given regex, false if not.
 */
String.prototype.matches = function (regex) {
    return regex.test(this);
};

// Adds the given minutes to the date and returns the new date.
Date.prototype.addMinutes = function (minutes) {
    return new Date(this.getTime() + minutes * 60 * 1000);
};

// Adds the given hours to the date and returns the new date.
Date.prototype.addHours = function (hours) {
    return new Date(this.getTime() + hours * 60 * 60 * 1000);
};

// Settings for this Zap. 
var Settings = {
    textFromField: {
        maxDigits: 16,
        maxChars: 11
    }, // A text message may only contain up to [maxDigits] amount of digits, [maxChars] amount of characters.
    validityTime: {
        def: "48h0m", // Default
        min: 1,
        max: 48 * 60
    },
    defaultReference: "None",
    debug: false // True to print all errors in json.
};

/**
 * @param {*} headers - The HTTP request headers
 * @param {*} data - The content of the HTTP request
 * @returns the data that will be used by Zapier to send a HTTP request to CM.com.
 */
function ZapierRequest(headers, data) {
    return {
        headers: headers,
        data: typeof data == "string" ? data : JSON.stringify(data) // Our data needs to be a string, so when it's JSON convert it.
    };
}

/**
 * @param {*} bundle - The bundle object from Zapier.
 * @returns the HTTP headers with a Product Token.
 */
function RequestHeaders(bundle) {
    return {
        'Content-Type': "application/json",
        'X-CM-PRODUCTTOKEN': bundle.auth_fields.productToken
    };
}

/**
 * Class with static methods related to text messages.
 */
var Messages = {
    /**
     * @param {*} bundle - The bundle object from Zapier.
     * @returns JSON used in the request to CM.com with product token.
     */
    getAuthentication: function (bundle) {
        return {
            ProductToken: bundle.auth_fields.productToken
        };
    },

    /**
     * @param {*} authentication - The authentication object. Can be generated using Messages.getAuthentication(bundle)
     * @param {*} messageList - A list of message objects to send.
     * @returns JSON that will be sent to CM.com, with the authentication object and a list of messages.
     */
    getData: function (authentication, messageList) {
        return {
            Messages: {
                Authentication: authentication,
                Msg: messageList
            }
        };
    }
};

// Log JSON as readable string.
function logJSON(json) {
    console.log(JSON.stringify(json, null, 4));
}

/**
 * Convert the input (like 1h2m) to a date from now (current datetime + 1h2m).
 * @param {*} input 
 * @throws ErrorException
 */
function parseValidityTime(input) {
    // If the input is undefined, use default Validity time.
    var validityTime = input === undefined ? Settings.validityTime.def : input;

    if (!validityTime.matches(/[0-9]+h([0-5]|)[0-9]m/))
        throw new ErrorException("Validity time is in an incorrect format");

    // Convert the input (like 1h2m) to minutes (1 * 60 + 2)
    validityTime = validityTime.split("h"); // Result: ["1", "2m"]
    validityTime[1] = validityTime[1].replace("m", "");

    // Convert strings in the array to integers
    validityTime = validityTime.map(function (item) {
        return parseInt(item);
    });

    var hours = validityTime[0];
    var minutes = validityTime[1];
    var total = hours * 60 + minutes;

    if (total > Settings.validityTime.max)
        throw new ErrorException("Validity time is larger than allowed.");
    else if (total < Settings.validityTime.min)
        throw new ErrorException("Validity time is smaller than allowed.");

    var currentDate = new Date();
    var validityDate = currentDate.addHours(hours).addMinutes(minutes);

    return validityDate.toISOString().replace("T", " ").split(".")[0] + " GMT"; // Convert the date to a date CM.com can read.
}

/**
 * When Zapier gets a result from CM.com, check it for errors and throw it as readable message.
 * @param {*} bundle - The bundle object from Zapier.
 * @throws ErrorException
 */
function throwResponseError(bundle) {
    if (!(bundle.response.status_code >= 200 && bundle.response.status_code < 300)) {
        if (Settings.debug) {
            throw new ErrorException(bundle.response.content);
        } else {
            var response = JSON.parse(bundle.response.content);

            var errorMessages = []; // A list of error messages
            if (response.message !== undefined) { // If the error has a single message.
                errorMessages.push(response.message); // Add the message to the list
            } else if (response.messages !== undefined && response.messages.length > 0) { // If the error has multiple messages in an array.
                errorMessages = response.messages.filter(function (item) {
                    return item.messageDetails !== null; // Filter all success messages from the list
                }).map(function (item) { // Convert all error messages from json to text.
                    // Example: Message 2 (to 00447911123457 with reference your_reference_B): A body without content was found (error code 304)
                    return "Message " + (response.messages.indexOf(item) + 1) + " (to '" + item.to + "'" + (item.reference != "None" ? " with reference '" + item.reference + "'" : "") + "): " +
                        item.messageDetails + (item.errorCode !== undefined ? " (error code " + item.errorCode + ")" : "");
                });
            }

            if (errorMessages.length === 0) { // If no error messages where found, use details and errorCode.
                var msg = "";

                if (response.details !== undefined)
                    msg += response.details;
                if (response.errorCode !== undefined)
                    msg += response.details !== undefined ? " (error code: " + response.errorCode + ")" : "Error with code: " + response.errorCode;

                errorMessages.push(msg);
            }

            throw new ErrorException(errorMessages.join("\n"));
        }
    }
}

var Zap = {
    /* ------------ TEXT ------------ */
    textMessage_pre_write: function (bundle) {
        var fromNumbersArray = bundle.action_fields.from;
        var toNumbersArray = bundle.action_fields.to;
        var smsBodyArray = bundle.action_fields.messageContent;
        var smsReferenceArray = bundle.action_fields.reference;
        var validityTimeArray = bundle.action_fields.validityTime;

        // Test if amount of fields is correct.
        if (fromNumbersArray.length > toNumbersArray.length) {
            throw new ErrorException("Error: there are more fields in 'From' than in 'To'. They need to be equal.");
        } else if (toNumbersArray.length > fromNumbersArray.length) {
            throw new ErrorException("Error: there are more fields in 'To' than in 'From'. They need to be equal.");
        }

        if (fromNumbersArray.length > smsBodyArray.length) {
            throw new ErrorException("Error: there are more fields in 'From' than in 'Body'. They need to be equal.");
        } else if (smsBodyArray.length > fromNumbersArray.length) {
            throw new ErrorException("Error: there are more fields in 'Body' than in 'From'. They need to be equal.");
        }

        // Checks to which channels the message must be sent to.
        var allowedChannels = bundle.action_fields.messageType.toLowerCase();
        var allowedChannelsList = [];
        if (allowedChannels == 'sms' || allowedChannels == 'push') {
            allowedChannelsList.push(allowedChannels);
        } else if (allowedChannels == 'push_sms') {
            allowedChannelsList.push('push');
            allowedChannelsList.push('sms');
        }

        // Create a list of messages
        var messageList = [];
        for (var j = 0; j < fromNumbersArray.length; j++) { // Iterate trough all messages
            // Each message can be send to multiple numbers
            var numberListText = toNumbersArray[j];
            var numberList = numberListText.split(',');

            var toNumbersList = numberList.map(function (item) {
                return {
                    number: item.trim()
                };
            });

            var from = fromNumbersArray[j].trim();

            if (from.matches(/(|\+)[0-9]+/)) {
                if (from.length > Settings.textFromField.maxDigits) {
                    throw new ErrorException("Message " + (j + 1) + ": from length is more than maximally allowed (" + Settings.textFromField.maxDigits + " digits)");
                }
            } else if (from.length > Settings.textFromField.maxChars) {
                throw new ErrorException("Message " + (j + 1) + ": from length is more than maximally allowed (" + Settings.textFromField.maxChars + " alphanumerical characters)");
            }

            var message = smsReferenceArray[j] === undefined ? Settings.defaultReference : smsReferenceArray[j].trim();
            var maximumNumberOfMessageParts = message.length < 160 ? 1 : Math.ceil(message.length / 153);

            messageList.push({
                from: from,
                to: toNumbersList,
                body: {
                    type: "AUTO",
                    content: smsBodyArray[j].replace(/\r/g, "").replace(/\n/g, "").trim()
                },
                reference: message,
                appKey: bundle.action_fields.appKey,
                allowedChannels: allowedChannelsList,
                minimumNumberOfMessageParts: 1,
                maximumNumberOfMessageParts: maximumNumberOfMessageParts,
                validity: parseValidityTime(validityTimeArray[j]),
                customGrouping3: "Zapier" // Allows CM.com to track where requests originate from.
            });
        }

        var authentication = Messages.getAuthentication(bundle);
        var requestData = Messages.getData(authentication, messageList);
        var requestHeaders = new RequestHeaders(bundle);
        return new ZapierRequest(requestHeaders, requestData);
    },

    textMessage_post_write: throwResponseError,

    /* ------------ VOICE ------------ */
    voiceMessage_pre_write: function (bundle) {
        var requestData = {
            caller: bundle.action_fields.from,
            callees: bundle.action_fields.to,
            prompt: bundle.action_fields.messageContent,
            'prompt-type': "TTS",
            voice: {
                language: bundle.action_fields.language,
                gender: bundle.action_fields.gender,
                number: bundle.action_fields.voiceNumber
            },
            anonymous: false
        };

        var requestHeaders = new RequestHeaders(bundle);
        return new ZapierRequest(requestHeaders, requestData);
    },

    voiceMessage_post_write: throwResponseError,

    /* ------------ NUMBER VALIDATION ------------ */
    numberVerifier_pre_search: function (bundle) {
        var requestHeaders = new RequestHeaders(bundle);

        var phoneNumber = bundle.search_fields.phoneNumber;

        if (!phoneNumber.matches(/(|\+)[0-9]+/) || phoneNumber.matches(/[A-z]+/))
            throw new ErrorException("The specified phone number is not a valid phone number")

        var requestData = {
            phonenumber: phoneNumber
        };

        return {
            url: "https://api.cmtelecom.com/v1.1/number" + (bundle.search_fields.type == "numberLookUp" ? "lookup" : "validation"),
            headers: requestHeaders,
            data: JSON.stringify(requestData),
            method: "POST"
        };
    },

    numberVerifier_post_search: function (bundle) {
        throwResponseError(bundle); // Stops when an error is thrown, otherwise continue below.

        return [{ // Zapier users can select data returned here to use in a action, so don't return sensitive data here.
            response: "Success",
            id: 1,
            status_code: bundle.response.status_code,
            content: JSON.parse(bundle.response.content)
        }];
    }
}

if(isNodeJS) module.exports = Zap;