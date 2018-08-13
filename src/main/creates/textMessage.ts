import * as moment from "moment"
import "../../../lib/utils/main/index"
import { zObject, Bundle, HttpMethod } from "zapier-platform-core"
import ZapierRequest from "../../../lib/Zapier/main/ZapierRequest"
import Link from "../../../lib/Zapier/main/Link"
import TextMessage from "../../../lib/CM/main/model/TextMessage"
import { ZapierField, ZapierInputField } from "../../../lib/Zapier/main/ZapierFields"
import errorHandler from "../../../lib/CM/main/errorHandler"
import config from "../../../lib/CM/main/config"

// --- Request to CM API ---

class MessageReuqest extends ZapierRequest {
    protected url: string = `https://gw.cmtelecom.com/v1.0/message`
    protected method: HttpMethod = "POST"

    constructor(z: zObject, bundle: Bundle){
        super(z, bundle, errorHandler)
    }

    protected createInput(): json {
        let toNumbersList = this.bundle.inputData.to
        toNumbersList = toNumbersList.length == 1 && toNumbersList[0].includes(",") ? toNumbersList[0].split(",") : toNumbersList
    
        const messageObject = new TextMessage(this.bundle.inputData.from, toNumbersList, this.bundle.inputData.messageContent)
    
        if(this.bundle.inputData.messageType.includes("sms")) messageObject.setUseSMS()
        if(this.bundle.inputData.messageType.includes("push")) messageObject.setUsePush(this.bundle.inputData.appKey)
    
        if(this.bundle.inputData.reference) messageObject.setReference(this.bundle.inputData.reference.trim())

        messageObject.setValidityTime(moment(this.bundle.inputData.validityTime))
    
        return {
            Messages: {
                Authentication: {
                    ProductToken: this.bundle.authData.productToken
                },
                Msg: [messageObject]
            }
        }
    }

    protected mapOutput(response: json): json {
        return {
            result: "success"
        }
    }
}

const makeRequest = (z: zObject, bundle: Bundle) => new MessageReuqest(z, bundle).startFlow()

// --- Inputfields ---

const messageType = new ZapierInputField.Builder("messageType", "Message Type")
    .setDescription(`The type of message.\n\n"SMS only" will send an SMS message.\n"Push" will sent a message over the internet to an app.\n"Push or SMS" will sent a push message, or an SMS message if the recipient doesn't have the app installed.`)
    .addDropdownItem("sms", "SMS Only", true)
    .addDropdownItem("push_sms", "Push or SMS")
    .addDropdownItem("push", "Push only")
    .modifiesDynamicFields()
    .build()

const from = new ZapierInputField.Builder("from", "From")
    .setDescription(`The sender of the message, which can be a name or a ${new Link("phone number (with country code)", config.links.helpDocs.phoneNumberFormat)}.\n\nNote: The maximum length is ${config.textFromField.maxChars} characters or ${config.textFromField.maxDigits} numbers.`)
    .build()

const to = new ZapierInputField.Builder("to", "To")
    .setDescription(`Please provide the ${new Link("recipient numbers (with country code)", config.links.helpDocs.phoneNumberFormat)} to whom you want to send the message.\n\nYou can use the list functionality, or put all your numbers into the first field seperated by a comma.`)
    .setPlaceholder("+1224589XXXX, +91976056XXXX")
    .asList()
    .build()

const messageContent = new ZapierInputField.Builder("messageContent", "Body", "text")
    .setDescription(`The content of the message.\n\nNote: The maximum length is 1200 characters, or 500 characters when using special characters (like emoji and characters that are not in ${new Link("this list", config.links.helpDocs.specialCharacters)}).`)
    .build()

const appKey = new ZapierInputField.Builder("appKey", "App Key")
    .setDescription(`An app key is a unique key that belongs to a certain app.\nThe app key will be generated in the ${new Link("app manager", config.links.appkey)}.`)
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

// --- Export ---

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
        inputFields: [ messageType, from, to, messageContent, shouldIncludeAppKey, validityTime, reference ] as any[],
        outputFields: [ (new ZapierField("result", "Result") as any) ],
        perform: makeRequest,
        sample: {
            result: "success"
        }
    }
}