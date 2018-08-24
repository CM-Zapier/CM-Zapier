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
        result: "success"
    }
}

module.exports = {
    key: 'textMessage',
    noun: 'Message',
    
    display: {
        label: 'Send Text (SMS/Push) Message',
        description: 'Sends an SMS or Push message to one or multiple people.',
        hidden: false,
        important: true
    },
    
    operation: {
        inputFields: [
            {
                key: 'messageType',
                label: 'Message type',
                helpText: '"SMS only" will send an SMS message.\n"Push" will sent a message over the internet to an app.\n"Push or SMS" will sent a push message, or an SMS message if the recipient doesn\'t have the app installed.',
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
                helpText: `The sender of the message, which can be a name or a [phone number (with country code)](${config.links.helpDocs.phoneNumberFormat}).\n\nNote: The maximum length is ${config.textFromField.maxChars} characters or ${config.textFromField.maxDigits} numbers.`,
                type: 'string',
                required: true
            }, {
                key: 'to',
                label: 'To',
                helpText: `The [recipient numbers (with country code)](${config.links.helpDocs.phoneNumberFormat}) to whom you want to send the message.\n\nYou can use the list functionality, or put all your numbers into the first field seperated by a comma.`,
                type: 'string',
                required: true,
                placeholder: '+31 (6) 00000000, +91976056XXXX',
                list: true
            }, {
                key: 'messageContent',
                label: 'Body',
                helpText: `Note: The maximum length is 1200 characters, or 500 characters when using special characters (like emoji and characters that are not in [this list](${config.links.helpDocs.specialCharacters})).`,
                type: 'text',
                required: true
            }, (z, bundle) => { // Show only the app key field when the user selected "push" in message type.
                return bundle.inputData.messageType != undefined && bundle.inputData.messageType.includes("push") ? [{
                    key: 'appKey',
                    label: 'App Key',
                    helpText: `An app key is a unique key that belongs to a certain app.\nThe app key will be generated in the [app manager](${config.links.appkey}).`,
                    type: 'string',
                    required: true,
                    placeholder: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX'
                }] : []
            }, {
                key: 'validityTime',
                label: 'Valid until',
                helpText: 'Cancels the message if not sent within the set time.\n\nNote: Must be within the next 48 hours.',
                type: 'datetime',
                required: true,
                default: config.validityTime.def
            }, {
                key: 'reference',
                label: 'Reference',
                type: 'string',
                required: false
            }
        ],
        outputFields: [
            {
                key: "result",
                label: "Result"
            }
        ],
        perform: makeRequest,
        sample: {
            result: "success"
        }
    }
}