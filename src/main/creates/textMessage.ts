// Zapier
import { zObject, Bundle, HttpMethod } from "zapier-platform-core"

// Zapier lib
import Link from "../../../lib/Zapier/main/Link"
import ResultGenerator from "../../../lib/Zapier/main/ResultGenerator"
import { ZapierField, ZapierInputField } from "../../../lib/Zapier/main/ZapierFields"
import ZapierRequest from "../../../lib/Zapier/main/ZapierRequest"

// CM lib
import config from "../../../lib/CM/main/config"
import errorHandler from "../../../lib/CM/main/errorHandler"
import TextMessage from "../../../lib/CM/main/model/TextMessage"

// Other
import * as moment from "moment"

// --- Request to CM API ---

class MessageRequest extends ZapierRequest {
    protected url: string = `https://gw.cmtelecom.com/v1.0/message`
    protected method: HttpMethod = "POST"
    private messageObjectCache?: TextMessage // Cache the TextMessage object, so we can use that for our outputfields

    constructor(z: zObject, bundle: Bundle){
        super(z, bundle, errorHandler)
        this.messageObjectCache = undefined 
    }

    protected createInput(): json {
        let toNumbersList = this.bundle.inputData.to
        toNumbersList = toNumbersList.length == 1 && toNumbersList[0].includes(",") ? toNumbersList[0].split(",") : toNumbersList
    
        const messageObject = new TextMessage(this.bundle.inputData.from, toNumbersList, this.bundle.inputData.messageContent)
    
        if(this.bundle.inputData.messageType.includes("sms")) messageObject.setUseSMS()
        if(this.bundle.inputData.messageType.includes("push")) messageObject.setUsePush(this.bundle.inputData.appKey)
    
        if(this.bundle.inputData.reference) messageObject.setReference(this.bundle.inputData.reference.trim())

        if(this.bundle.inputData.validityTime) messageObject.setValidityTime(moment().add(parseInt(this.bundle.inputData.validityTime), "hours"))
    
        this.messageObjectCache = messageObject

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
            to: response.messages.map((item: any) => item.to),
            createdMessages: response.details.match(/\d+/)[0],
            reference: response.messages[0].reference || "None",
            messageParts: response.messages[0].parts,
            body: this.messageObjectCache ? this.messageObjectCache.getMessage() : ""
        }
    }
}

// --- Inputfields ---

const messageType = new ZapierInputField("messageType", "Message Type")
    .setDescription(`"SMS only" will send an SMS message.\n"Push" will sent a message over the internet to an app.\n"Push or SMS" will sent a push message, or an SMS message if the recipient doesn't have the app installed.`)
    .addDropdownItem("sms", "SMS Only", true)
    .addDropdownItem("push_sms", "Push or SMS")
    .addDropdownItem("push", "Push only")
    .modifiesDynamicFields()

const from = new ZapierInputField("from", "From")
    .setDescription(`The sender of the message, which can be a name or a ${new Link("phone number (with country code)", config.links.helpDocs.phoneNumberFormat)}.\n\nNote: The maximum length is ${config.textFromField.maxChars} characters or ${config.textFromField.maxDigits} numbers. Sender restrictions may apply depending on the recipient country, see ${new Link("this help document", config.links.helpDocs.smsSenderRestrictions)} or ${new Link("this one", config.links.helpDocs.countryRestrictions)} for more information`)

const to = new ZapierInputField("to", "To")
    .setDescription(`The ${new Link("recipient numbers (with country code)", config.links.helpDocs.phoneNumberFormat)} to whom you want to send the message.\n\nYou can use the list functionality, or put all your numbers into the first field seperated by a comma.`)
    .asList()

const messageContent = new ZapierInputField("messageContent", "Body", "text")
    .setDescription(`Note: The maximum length is 1200 characters, or 500 characters when using special characters (like emoji and characters that are not in ${new Link("this list", config.links.helpDocs.specialCharacters)}).`)

const appKey = new ZapierInputField("appKey", "App Key")
    .setDescription(`An app key is a unique key that belongs to a certain app.\nThe app key will be generated in the ${new Link("app manager", config.links.appkey)}.`)

// Show only the app key field when the user selected "push" in message type.
const shouldIncludeAppKey = (z: zObject, bundle: Bundle) => bundle.inputData.messageType && bundle.inputData.messageType.includes("push") ? [ appKey ] : []

const validityTime = new ZapierInputField("validityTime", "Valid until", "integer", false)
    .setDescription(`Cancels the message if not sent within the set time. Value is in hours from the time the Zap runs.\n\nNote: Must be within the next 48 hours.`)

const reference = new ZapierInputField("reference", "Reference", undefined, false)
    .setDescription(`Setting a reference allows you to link ${new Link("status reports", config.links.helpDocs.statusReports)}.`)

// --- OutputFields & Sample ---

const result = new ResultGenerator()
    .add("to", "To", ["0031600000000"])
    .add("createdMessages", "Messages created", 1)
    .add("reference", "Reference", "None")
    .add("messageParts", "Message parts", 1)
    .add("body", "Body", "This is a test message.")

// --- Export ---

export default {
    key: 'textMessage',
    noun: 'Message',
    
    display: {
        label: 'Send Text (SMS/Push) Message',
        description: 'Sends an SMS or Push message to one or multiple people.',
        hidden: false,
        important: true
    },
    
    operation: {
        inputFields: [ messageType, from, to, messageContent, shouldIncludeAppKey, validityTime, reference ] as any[],
        outputFields: result.getOutputFields(),
		sample: result.getSample(),
        perform: (z: zObject, bundle: Bundle) => new MessageRequest(z, bundle).startFlow()
    }
}