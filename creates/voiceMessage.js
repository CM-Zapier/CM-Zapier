const ZapierRequest = require("../model/ZapierRequest")
const VoiceMessage = require("../model/VoiceMessage")
const Voice = require("../model/Voice")
const errorHandler = require("../ErrorHandlerCM")

const makeRequest = (z, bundle) => {
    let toNumbersList = bundle.inputData.to
    toNumbersList = toNumbersList.length == 1 && toNumbersList[0].includes(",") ? toNumbersList[0].split(",") : toNumbersList
    
    const voice = new Voice(bundle.inputData.language, bundle.inputData.gender, bundle.inputData.voiceNumber);
    const voiceMessage = new VoiceMessage(bundle.inputData.from, toNumbersList, bundle.inputData.messageContent, voice)
    
    return z.request(new ZapierRequest("https://api.cmtelecom.com/voiceapi/v2/Notification", "POST", voiceMessage)).then(response => {
        errorHandler(response.status, response.content)
    
        return {
            response: JSON.parse(response.content)
        }
    })
}

module.exports = {
	key: 'voice_message',
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
			}, {
                key: "voice", 
                label: "Voice options",
                children: [
                    {
                        key: 'language',
                        label: 'Language',
                        helpText: "Please select the language of the voice text. There are 46 languages and dialects available. In case you can't find your prefered language in the drop-down, use Custom Value and try [any other available language](https://docs.cmtelecom.com/voice-api-apps/v2.0#/prerequisites%7Ctext-to-speech) in a similar format in your Zap.",
                        type: 'string',
                        required: true,
                        default: 'English (Great Britain)',
                        choices: {
                            'cy-GB': 'Cymraeg (Prydain Fawr) / Welsch (Great Britain)',
                            'da-DK': 'Dansk (Danmark) / Danish (Denmark)',
                            'de-DE': 'Deutsch (Deutschland) / German (Germany)',
                            'en-AU': 'English (Australia)',
                            'en-GB': 'English (Great Britain)',
                            'en-IN': 'English (India)',
                            'en-US': 'English (United States)',
                            'es-ES': 'Español (España) / Spanish (Spain)',
                            'es-US': 'Español (Estados Unidos) / Spanish (United States)',
                            'fr-CA': 'Français (Canada) / French (Canada)',
                            'fr-FR': 'Français (France) / French (France)',
                            'is-IS': 'Íslenska (Ísland) / Icelandic (Iceland)',
                            'it-IT': 'Italiano (Italia) / Italian (Italy)',
                            'ja-JP': '日本語 (日本) / Japanese (Japan)',
                            'nb-NO': 'Bokmål (Norge) / Norwegian Bokmål (Norway)',
                            'nl-NL': 'Nederlands (Nederland) / Dutch (The Netherlands)',
                            'pl-PL': 'Język polski (Polska) / Polish (Poland)',
                            'pt-BR': 'Português (Brasil) / Portugese (Brazil)',
                            'pt-PT': 'Português (Portugal) / Portugese (Portugal)',
                            'ro-RO': 'Limba română (România) / Romanian (Romania)',
                            'ru-RU': 'ру́сский язы́к (Росси́я) / Rússkiy yazýk (Rossiya) / Russian (Russia)',
                            'sv-SE': 'Svenska (Sverige) / Swedish (Sweden)',
                            'tr-TR': 'Türkçe (Türkiye) / Turkish (Turkey)'
                        }
                    }, {
                        key: 'gender',
                        label: 'Gender',
                        helpText: 'Note: not all voices support all genders, look at the list provided in the description above for all voices.',
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
                        helpText: 'The number of the voice to use.',
                        type: 'integer',
                        required: true,
                        default: '1'
                    }
                ]
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