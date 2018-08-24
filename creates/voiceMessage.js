require('json5/lib/register')
const config = require('../config.json5')
const ZapierRequest = require("../model/ZapierRequest")
const VoiceMessage = require("../model/VoiceMessage")
const Voice = require("../model/Voice")
const errorHandler = require("../ErrorHandlerCM")

const makeRequest = async (z, bundle) => {
    let toNumbersList = bundle.inputData.to
    toNumbersList = toNumbersList.length == 1 && toNumbersList[0].includes(",") ? toNumbersList[0].split(",") : toNumbersList
    
    const voice = new Voice(bundle.inputData.language, bundle.inputData.gender, bundle.inputData.number)
    const voiceMessage = new VoiceMessage(bundle.inputData.from, toNumbersList, bundle.inputData.messageContent, voice)
    
    const response = await z.request(new ZapierRequest("https://api.cmtelecom.com/voiceapi/v2/Notification", "POST", voiceMessage))
    
    errorHandler(response.status, response.content)
    
    return {
        result: "success"
    }
}

module.exports = {
	key: 'voiceMessage',
	noun: 'Voice',
	
	display: {
		label: 'Send Voice (Text to Speech) Message',
		description: 'Sends a voice message to one or multiple people. The recipient will receive the message as a call.',
		hidden: false,
		important: true
	},
	
	operation: {
		inputFields: [
			{
				key: 'from',
				label: 'From',
				helpText: `The sender of the message, which must be a [phone number (with country code)](${config.links.helpDocs.phoneNumberFormat}).`,
				type: 'string',
				required: true
			}, {
				key: 'to',
				label: 'To',
				helpText: `The [recipient numbers (with country code)](${config.links.helpDocs.phoneNumberFormat}) to whom you want to send the message.\n\nYou can use the list functionality, or put all your numbers into the first field seperated by a comma.`,
				type: 'string',
				required: true,
                list: true
			}, {
				key: 'messageContent',
				label: 'Text',
				helpText: 'The content of the message. The speech engine will tell this message.\n\nNote: emoji don\'t work, you can\'t use emoji in spoken language.',
				type: 'text',
				required: true
			}, async (z, bundle) => {
                const response = await z.request(new ZapierRequest("https://api.cmtelecom.com/voicesendapi/v1.0/tts/languages"))
                const languageList = JSON.parse(response.content)

                return [
                    {
                        key: 'language',
                        label: 'Voice language',
                        helpText: `The language of the message.\nThere are ${Object.keys(languageList).length} languages and dialects available.`,
                        type: 'string',
                        required: true,
                        default: "en-GB",
                        choices: languageList
                    }
                ]
            }, {
                key: 'gender',
                label: 'Voice gender',
                helpText: `The voice of the generated message.\n\nNote: not all voices support all genders, [check this list for the supported genders](${config.links.helpDocs.voiceGenders}).`,
                type: 'string',
                required: true,
                default: 'Female',
                choices: { 
                    Female: 'Female', 
                    Male: 'Male' 
                }
            }, {
                key: 'number',
                label: 'Voice number',
                helpText: `The number of the voice to use, [check this list for the supported numbers](${config.links.helpDocs.voiceNumbers}).`,
                type: 'integer',
                required: true,
                default: '1'
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