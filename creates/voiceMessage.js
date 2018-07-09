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
        response: JSON.parse(response.content)
    }
}

module.exports = {
	key: 'voiceMessage',
	noun: 'Voice',
	
	display: {
		label: 'Send Voice (Text to Speech) Message',
		description: 'Send a voice message to one or multiple people. A speech engine will tell the text message you gave in the selected language, dialect and gender. The recipient will receive the message as a call.',
		hidden: false,
		important: true
	},
	
	operation: {
		inputFields: [
			{
				key: 'from',
				label: 'From',
				helpText: "The sender of the message, which must be a [phone number (with country code)](https://help.cmtelecom.com/en/supporting-apps/address-book/what-is-the-right-phone-number-format).",
				type: 'string',
				required: true
			}, {
				key: 'to',
				label: 'To',
				helpText: 'The [recipient numbers (with country code)](https://help.cmtelecom.com/en/supporting-apps/address-book/what-is-the-right-phone-number-format) to whom you want to send the message.\n\nYou can use the list functionality, or put all your numbers into the first field seperated by a comma.',
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

                return [{
                    key: "voice_options",
                    label: "Voice options",
                    children: [
                        {
                            key: 'language',
                            label: 'Language',
                            helpText: "The language of the message.\nThere are " + Object.keys(languageList).length + " languages and dialects available.",
                            type: 'string',
                            required: true,
                            default: languageList["en-GB"],
                            choices: languageList
                        }, {
                            key: 'gender',
                            label: 'Gender',
                            helpText: 'The voice of the generated message.\n\nNote: not all voices support all genders, [check this list for the supported genders](https://docs.cmtelecom.com/voice-api-apps/v2.0#/prerequisites%7Ctext-to-speech).',
                            type: 'string',
                            required: true,
                            default: 'Female',
                            choices: { 
                                Female: 'Female', 
                                Male: 'Male' 
                            }
                        }, {
                            key: 'number',
                            label: 'Number',
                            helpText: 'The number of the voice to use, [check this list for the supported numbers](https://docs.cmtelecom.com/voice-api-apps/v2.0#/prerequisites%7Ctext-to-speech).',
                            type: 'integer',
                            required: true,
                            default: '1'
                        }
                    ]
                }]
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