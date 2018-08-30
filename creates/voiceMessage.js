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

    const result = JSON.parse(response.content)
    
    return {
        type: result[0].type,
        caller: result[0].caller,
        callees: result.map(item => item.callee)
    }
}

let languageCache = null

async function getLanguageList(z){ // Check if cached version exists
    if(!languageCache){
        // Retreive data from API
        const response = await z.request(new ZapierRequest("https://api.cmtelecom.com/voicesendapi/v1.0/tts/languages"))
        // Cache the response
        languageCache = JSON.parse(response.content)
    }

    return languageCache // Return the cache
}

const languageOptionCache = {}

async function getLanguageOptions(z, languageCode){
    if(!languageOptionCache[languageCode]){ // Check if cached version exists
        // Retreive data from API
        const response = await z.request(new ZapierRequest(`https://api.cmtelecom.com/voicesendapi/v1.0/tts/languages/${languageCode}`))
        // Cache the response
        languageOptionCache[languageCode] = JSON.parse(response.content)
    }

    return languageOptionCache[languageCode] // Return the cache
}

module.exports = {
	key: 'voiceMessage',
	noun: 'Voice',
	
	display: {
		label: 'Send Voice (Text to Speech) Call',
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
				helpText: 'The content of the message, the speech engine will tell this message.\n\nNote: emoji don\'t work, you can\'t use emoji in spoken language.',
				type: 'text',
				required: true
			}, async (z, bundle) => {
                const languageList = await getLanguageList(z)

                return [
                    {
                        key: 'language',
                        label: 'Voice language',
                        helpText: `Change the language and dialect for the voice.`,
                        type: 'string',
                        required: true,
                        default: "en-GB",
                        choices: languageList,
                        altersDynamicFields: true
                    }
                ]
            }, async (z, bundle) => {
                const languageOptions = await getLanguageOptions(z, bundle.inputData.language || "en-GB")

                const genderChoices = {}
                languageOptions.map(options => options.gender).forEach(gender => {
                    genderChoices[gender] = gender
                })

                return [
                    {
                        key: 'gender',
                        label: 'Voice gender',
                        helpText: `Change the gender of the outputted voice.`,
                        type: 'string',
                        required: true,
                        default: Object.keys(genderChoices)[0],
                        choices: genderChoices,
                        altersDynamicFields: true
                    }
                ]
            }, async (z, bundle) => {
                const languageOptions = await getLanguageOptions(z, bundle.inputData.language || "en-GB")

                const voiceOptions = {}
                languageOptions.filter(item => item.gender === (bundle.inputData.gender || "Female")).forEach(item => {
                    voiceOptions[item.voiceNumber] = `${item.voiceNumber} (${item.displayName})`
                })
                
                return [
                    {
                        key: 'number',
                        label: 'Voice number',
                        helpText: `Some voice language and voice gender combinations have multiple options. Select the number of the voice you'd like to use. To test the different voice options, open [this webpage](${config.links.voiceTest}), click on the plus and select "Text To Speech message". Enter a message, select the voice you want to hear and then hit the play button.`,
                        type: 'integer',
                        required: true,
                        default: "1",
                        choices: voiceOptions
                    }
                ]
            }
		],
		outputFields: [
            {
                key: "type",
                label: "Type"
            }, {
                key: "caller",
                label: "Caller"
            }, {
                key: "callees",
                label: "Callees"
            }
        ],
		perform: makeRequest,
		sample: {
            type: "call-queued",
            caller: "+31600000000",
            callees: ["+31600000000"]
        }
	}
}