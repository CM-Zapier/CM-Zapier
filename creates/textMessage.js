require('json5/lib/register')
const config = require('../config.json5')
const moment = require("moment")

const ZapierRequest = require("../model/ZapierRequest")
const TextMessage = require("../model/TextMessage")
const errorHandler = require("../ErrorHandlerCM")

const makeRequest = async (z, bundle) => {
    let toNumbersList = bundle.inputData.to
    toNumbersList = toNumbersList.length == 1 && toNumbersList[0].includes(",") ? toNumbersList[0].split(",") : toNumbersList
    
    const messageObject = new TextMessage(bundle.inputData.from, toNumbersList, bundle.inputData.messageContent)
    
    if(bundle.inputData.messageType.includes("sms")) messageObject.setUseSMS()
    if(bundle.inputData.messageType.includes("push")) messageObject.setUsePush(bundle.inputData.appKey)
    
    if(bundle.inputData.reference) messageObject.setReference(bundle.inputData.reference.trim())

    const validityTime = moment(bundle.inputData.validityTime)
    if(!validityTime.isSameOrBefore(moment().add(config.validityTime.max, "minutes"))) 
        throw new Error(`Validity time (${validityTime.calendar()}) is later than maximally allowed (${moment().add(config.validityTime.max, "minutes").calendar()})`)
    else if (!validityTime.isSameOrAfter(moment().add(config.validityTime.min, "minutes"))) 
        throw new Error(`Validity time (${validityTime.calendar()}) is earlier than minimally allowed (${moment().add(config.validityTime.min, "minutes").calendar()})`)
    else 
        messageObject.setValidity(validityTime.format().replace("T", " ").replace("Z", " GMT")) 
    
    const requestData = {
        Messages: {
            Authentication: {
                ProductToken: bundle.authData.productToken
            },
            Msg: [messageObject]
        }
    }
    
    const response = await z.request(new ZapierRequest("https://gw.cmtelecom.com/v1.0/message", "POST", requestData))
    
    errorHandler(response.status, response.content)
    
    return {
        response: JSON.parse(response.content)
    }
}

module.exports = {
    key: 'textMessage',
    noun: 'Message',
    
    display: {
        label: 'Send Text (SMS/Push) Message',
        description: 'Send an SMS or Push message to one or multiple people.',
        hidden: false,
        important: true
    },
    
    operation: {
        inputFields: [
            {
                key: 'messageType',
                label: 'Message Type',
                helpText: 'The type of message.\n\n"SMS only" will send an SMS message.\n"Push" will sent a message over the internet to an app.\n"Push or SMS" will sent a push message, or an SMS message if the recipient doesn\'t have the app installed.',
                type: 'string',
                required: true,
                default: 'SMS only',
                choices: { 
                    sms: 'SMS only', 
                    push_sms: 'Push or SMS', 
                    push: 'Push only' 
                },
                altersDynamicFields: true
            }, {
                key: 'from',
                label: 'From',
                helpText: `The sender of the message, which can be a name or a [phone number (with country code)](https://help.cmtelecom.com/en/supporting-apps/address-book/what-is-the-right-phone-number-format).\n\nNote: The maximum length is ${config.textFromField.maxChars} characters or ${config.textFromField.maxDigits} numbers.`,
                type: 'string',
                required: true
            }, {
                key: 'to',
                label: 'To',
                helpText: 'Please provide the [recipient numbers (with country code)](https://help.cmtelecom.com/en/supporting-apps/address-book/what-is-the-right-phone-number-format) to whom you want to send the message.\n\nYou can use the list functionality, or put all your numbers into the first field seperated by a comma.',
                type: 'string',
                required: true,
                placeholder: '+1224589XXXX, +91976056XXXX',
                list: true
            }, {
                key: 'messageContent',
                label: 'Body',
                helpText: 'The content of the message.\n\nNote: The maximum length is 1200 characters, or 500 characters when using special characters (like emoji and characters that are not in [this list](https://en.wikipedia.org/wiki/GSM_03.38#GSM_7-bit_default_alphabet_and_extension_table_of_3GPP_TS_23.038_/_GSM_03.38)).',
                type: 'text',
                required: true
            }, (z, bundle) => { // Show only the app key field when the user selected "push" in message type.
                return bundle.inputData.messageType != undefined && bundle.inputData.messageType.includes("push") ? [{
                    key: 'appKey',
                    label: 'App Key',
                    helpText: 'An app key is a unique key that belongs to a certain app.\nThe app key will be generated in the [app manager](https://appmanager.cmtelecom.com/).',
                    type: 'string',
                    required: true,
                    placeholder: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX'
                }] : []
            }, {
                key: 'validityTime',
                label: 'Validity Time',
                helpText: 'Cancels the message if not sent within the set validity time.\n\nNote: Must be within the next 48 hours.',
                type: 'datetime',
                required: true,
                default: config.validityTime.def
            }, {
                key: 'reference',
                label: 'Reference',
                helpText: 'Please set the reference.',
                type: 'string',
                required: false,
                placeholder: 'None'
            }
        ],
        outputFields: [
            {
                key: 'Status',
                type: 'string'
            }
        ],
        perform: makeRequest,
        sample: { 
            Status: 'Success' 
        }
    }
}