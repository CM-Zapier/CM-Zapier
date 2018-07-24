import 'json5/lib/register'
import { zObject, Bundle } from "zapier-platform-core"
import ZapierRequest from "../model/ZapierRequest"
import TextMessage from "../model/TextMessage"
import { ZapierField, ZapierInputField } from "../model/ZapierFields"
import errorHandler from "../ErrorHandlerCM"

declare function require(path: string): any
const config = require('../config.json5')

const makeRequest = async (z: zObject, bundle: Bundle): Promise<object> => {
    let toNumbersList = bundle.inputData.to
    toNumbersList = toNumbersList.length == 1 && toNumbersList[0].includes(",") ? toNumbersList[0].split(",") : toNumbersList
    
    const messageObject = new TextMessage(bundle.inputData.from, toNumbersList, bundle.inputData.messageContent)
    
    if(bundle.inputData.messageType.includes("sms")) messageObject.setUseSMS()
    if(bundle.inputData.messageType.includes("push")) messageObject.setUsePush(bundle.inputData.appKey)
    
    if(bundle.inputData.reference) messageObject.setReference(bundle.inputData.reference.trim())

    messageObject.setValidityTime(bundle.inputData.validityTime)
    
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

const messageType = new ZapierInputField.Builder("messageType", "Message Type")
    .setDescription(`The type of message.\n\n"SMS only" will send an SMS message.\n"Push" will sent a message over the internet to an app.\n"Push or SMS" will sent a push message, or an SMS message if the recipient doesn't have the app installed.`)
    .addDropdownItem("sms", "SMS Only", true)
    .addDropdownItem("push_sms", "Push or SMS")
    .addDropdownItem("push", "Push only")
    .modifiesDynamicFields()
    .build()

const from = new ZapierInputField.Builder("from", "From")
    .setDescription(`The sender of the message, which can be a name or a [phone number (with country code)](${config.links.helpDocs.phoneNumberFormat}).\n\nNote: The maximum length is ${config.textFromField.maxChars} characters or ${config.textFromField.maxDigits} numbers.`)
    .build()

const to = new ZapierInputField.Builder("to", "To")
    .setDescription(`Please provide the [recipient numbers (with country code)](${config.links.helpDocs.phoneNumberFormat}) to whom you want to send the message.\n\nYou can use the list functionality, or put all your numbers into the first field seperated by a comma.`)
    .setPlaceholder("+1224589XXXX, +91976056XXXX")
    .asList()
    .build()

const messageContent = new ZapierInputField.Builder("messageContent", "Body")
    .setDescription(`The content of the message.\n\nNote: The maximum length is 1200 characters, or 500 characters when using special characters (like emoji and characters that are not in [this list](${config.links.helpDocs.specialCharacters})).`)
    .build()

const appKey = new ZapierInputField.Builder("appKey", "App Key")
    .setDescription(`An app key is a unique key that belongs to a certain app.\nThe app key will be generated in the [app manager](${config.links.appkey}).`)
    .setPlaceholder("XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX")
    .build()

// Show only the app key field when the user selected "push" in message type.
const shouldIncludeAppKey = (z: zObject, bundle: Bundle) => bundle.inputData.messageType && bundle.inputData.messageType.includes("push") ? [ appKey ] : []

const validityTime = new ZapierInputField.Builder("validityTime", "Validity Time", "datetime")
    .setDescription(`Cancels the message if not sent within the set validity time.\n\nNote: Must be within the next 48 hours.`)
    .setDefault(config.validityTime.def)
    .build()

const reference = new ZapierInputField.Builder("reference", "Reference", undefined, false)
    .setDescription(`Please set the reference`)
    .setPlaceholder("None")
    .build()

export default {
    key: 'textMessage',
    noun: 'Message',
    
    display: {
        label: 'Send Text (SMS/Push) Message',
        description: 'Send an SMS or Push message to one or multiple people.',
        hidden: false,
        important: true
    },
    
    operation: {
        inputFields: [messageType, from, to, messageContent, shouldIncludeAppKey, validityTime, reference],
        outputFields: [ new ZapierField("result", "Result") ],
        perform: makeRequest,
        sample: {
            result: "success"
        }
    }
}