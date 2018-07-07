const ZapierRequest = require("../model/ZapierRequest")
const VoiceMessage = require("../model/VoiceMessage")
const Voice = require("../model/Voice")
const errorHandler = require("../ErrorHandlerCM")

const makeRequest = async (z, bundle) => {
    let toNumbersList = bundle.inputData.to
    toNumbersList = toNumbersList.length == 1 && toNumbersList[0].includes(",") ? toNumbersList[0].split(",") : toNumbersList
    
    const voice = new Voice(bundle.inputData.language, bundle.inputData.gender, bundle.inputData.voiceNumber)
    const voiceMessage = new VoiceMessage(bundle.inputData.from, toNumbersList, bundle.inputData.messageContent, voice)

    throw new Error(JSON.stringify(voiceMessage, null, 4))
    
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
		description: 'Your zap will call one or more phone numbers, a speech engine will tell the message based on your text input. Text to speech is available in many different languages, several dialects and genders.',
		hidden: false,
		important: true
	},
	
	operation: {
		inputFields: [
			{
				key: 'from',
				label: 'From',
				helpText: "Please specify the sender's number (caller).",
				type: 'string',
				required: true
			}, {
				key: 'to',
				label: 'To',
				helpText: 'Please provide the recipient numbers (with country code) to whom you want to send the voice text. You can use the list functionality, or put all your numbers into the first field seperated by a comma.',
				type: 'string',
				required: true,
                list: true
			}, {
				key: 'messageContent',
				label: 'Text',
				helpText: 'Please type the text that you want to convert into the appropriate speech.',
				type: 'string',
				required: true
			}, async (z, bundle) => {
                const response = await z.request(new ZapierRequest("https://api.cmtelecom.com/voicesendapi/v1.0/tts/languages"))
                const languageList = JSON.parse(response.content)

                return [{
                    key: "voice",
                    label: "Voice options",
                    children: [
                        {
                            key: 'language',
                            label: 'Language',
                            helpText: "Please select the language of the voice text. There are " + Object.keys(languageList).length + " languages and dialects available.",
                            type: 'string',
                            required: true,
                            default: languageList["en-GB"],
                            choices: languageList
                        }, {
                            key: 'gender',
                            label: 'Gender',
                            helpText: 'Note: not all voices support all genders, [check this list for the supported genders](https://docs.cmtelecom.com/voice-api-apps/v2.0#/prerequisites%7Ctext-to-speech).',
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