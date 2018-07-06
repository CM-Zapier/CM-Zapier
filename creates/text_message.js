const ZapierRequest = require("../model/ZapierRequest")
const TextMessage = require("../model/TextMessage")
const errorHandler = require("../ErrorHandlerCM")

const makeRequest = (z, bundle) => {
    let toNumbersList = bundle.inputData.to
    toNumbersList = toNumbersList.length == 1 && toNumbersList[0].includes(",") ? toNumbersList[0].split(",") : toNumbersList
    
    const messageObject = new TextMessage(bundle.inputData.from, toNumbersList, bundle.inputData.messageContent)
    
    if(bundle.inputData.messageType.includes("sms")) messageObject.setUseSMS()
    if(bundle.inputData.messageType.includes("push")) messageObject.setUsePush(bundle.inputData.appKey)
    
    if(bundle.inputData.reference) messageObject.reference = bundle.inputData.reference.trim()
    
    const requestData = {
        Messages: {
            Authentication: {
                ProductToken: bundle.authData.productToken
            },
            Msg: [messageObject]
        }
    }
    
    return z.request(new ZapierRequest("https://gw.cmtelecom.com/v1.0/message", "POST", requestData)).then(response => {
        errorHandler(response.status, response.content)
    
        return {
            response: JSON.parse(response.content)
        };
    });
};

module.exports = {
    key: 'text_message',
    noun: 'Message',
    
    display: {
        label: 'Send Text (SMS/Push) Message',
        description: 'Send a SMS or Push message to one or multiple people.',
        hidden: false,
        important: true
    },
    
    operation: {
        inputFields: [
            {
                key: 'messageType',
                label: 'Message Type',
                helpText: 'Please select the appropriate channel by which you want to send the message.',
                type: 'string',
                required: true,
                default: 'SMS only',
                choices: { 
                    sms: 'SMS only', 
                    push_sms: 'Push or SMS', 
                    push: 'Push only' 
                }
            }, {
                key: 'from',
                label: 'From',
                helpText: "Please provide sender's name. The max. length is 11 characters or 16 numbers.",
                type: 'string',
                required: true
            }, {
                key: 'to',
                label: 'To',
                helpText: 'Please provide the [recipient numbers (with country code)](https://help.cmtelecom.com/en/supporting-apps/address-book/what-is-the-right-phone-number-format) to whom you want to send the message. You can use the list functionality, or put all your numbers into the first field seperated by a comma.',
                type: 'string',
                required: true,
                placeholder: '+1224589XXXX, +91976056XXXX',
                list: true
            }, {
                key: 'messageContent',
                label: 'Body',
                helpText: 'Please provide the content of the message. The max. length is 1200 characters, or 500 characters when using special characters (like emoji and characters that are not in [this list](https://en.wikipedia.org/wiki/GSM_03.38#GSM_7-bit_default_alphabet_and_extension_table_of_3GPP_TS_23.038_/_GSM_03.38)).',
                type: 'string',
                required: true
            }, {
                key: 'validityTime',
                label: 'Validity Time',
                helpText: 'Set the validity time for your message. Must be between 1 minute and 48 hours. Format: 0h0m.',
                type: 'string',
                required: true,
                default: '48h0m'
            }, {
                key: 'reference',
                label: 'Reference',
                helpText: 'Please set the reference.',
                type: 'string',
                required: false,
                default: 'None'
            }, {
                key: 'appKey',
                label: 'Push: App Key',
                helpText: '**This field is required for push messages.**\n\nThe app key will be generated in the [app manager](https://appmanager.cmtelecom.com/).',
                type: 'string',
                required: false,
                placeholder: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX'
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
};
