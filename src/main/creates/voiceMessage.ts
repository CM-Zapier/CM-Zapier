// Zapier
import { zObject, Bundle, HttpMethod } from "zapier-platform-core"

// Zapier lib
import Link from "../../../lib/Zapier/main/Link"
import ResultGenerator from "../../../lib/Zapier/main/ResultGenerator"
import ZapierHttpRequest from "../../../lib/Zapier/main/ZapierHttpRequest"
import { ZapierInputField } from "../../../lib/Zapier/main/ZapierFields"
import ZapierRequest from "../../../lib/Zapier/main/ZapierRequest"

// CM lib
import config from "../../../lib/CM/main/config"
import errorHandler from "../../../lib/CM/main/errorHandler"
import Voice from "../../../lib/CM/main/model/Voice"
import VoiceMessage from "../../../lib/CM/main/model/VoiceMessage"

// Other
import VoiceLanguages from "../triggers/voiceLanguages"

// --- Requests to CM API ---

class MessageRequest extends ZapierRequest {
    protected url: string = `https://api.cmtelecom.com/voiceapi/v2/Notification`
    protected method: HttpMethod = "POST"

    constructor(z: zObject, bundle: Bundle){
        super(z, bundle, errorHandler)
    }

    protected createInput(): VoiceMessage {
        let toNumbersList = this.bundle.inputData.to
        toNumbersList = toNumbersList.length == 1 && toNumbersList[0].includes(",") ? toNumbersList[0].split(",") : toNumbersList
    
        const voice = new Voice(this.bundle.inputData.language, this.bundle.inputData.gender, this.bundle.inputData.number - 0)
        return new VoiceMessage(this.bundle.inputData.from, toNumbersList, this.bundle.inputData.messageContent, voice)
    }

    protected mapOutput(response: any[]): json {
        return {
            type: response[0].type,
            caller: response[0].caller,
            callees: response.map(item => item.callee)
        }
    }
}

const languageOptionCache: {[languageCode: string]: {id: number, language: string, gender: string, voiceNumber: number, displayName: string}[]} = {}

async function getLanguageOptions(z: zObject, languageCode: string){
    if(!languageOptionCache[languageCode]){ // Check if cached version exists
        // Retreive data from API
        const response = await z.request(new ZapierHttpRequest(`https://api.cmtelecom.com/voicesendapi/v1.0/tts/languages/${languageCode}`))
        // Cache the response
        languageOptionCache[languageCode] = JSON.parse(response.content)
    }

    return languageOptionCache[languageCode] // Return the cache
}

// --- Inputfields ---

const from = new ZapierInputField("from", "From")
    .setDescription(`The sender of the message, which must be a ${new Link("phone number (with country code)", config.links.helpDocs.phoneNumberFormat)}.`)

const to = new ZapierInputField("to", "To")
    .setDescription(`The ${new Link("recipient numbers (with country code)", config.links.helpDocs.phoneNumberFormat)} to whom you want to send the message.\n\nYou can use the list functionality, or put all your numbers into the first field seperated by a comma.`)
    .asList()

const messageContent = new ZapierInputField("messageContent", "Text", "text")
    .setDescription(`The content of the message, the speech engine will tell this message.\n\nNote: emoji don't work, you can't use emoji in spoken language.`)

const voiceLanguage = new ZapierInputField("language", "Voice language")
    .setDescription(`Change the language and dialect for the voice.`)
    .connectDropdownToTrigger(VoiceLanguages.key, "id", "name")
    .setDefault("en-GB")
    .modifiesDynamicFields()

const voiceGender = async (z: zObject, bundle: Bundle) => {
    const languageOptions = await getLanguageOptions(z, bundle.inputData.language || "en-GB")

    const voiceGenderField = new ZapierInputField("gender", "Voice gender")
        .setDescription(`Change the gender of the outputted voice.`)
        .modifiesDynamicFields()

    languageOptions.map(options => options.gender).forEach((gender, i) => {
        voiceGenderField.addDropdownItem(gender, gender, i == 0)
    })
    
    return [ voiceGenderField ]
}

const voiceNumber = async (z: zObject, bundle: Bundle) => {
    const languageOptions = await getLanguageOptions(z, bundle.inputData.language || "en-GB")

    const voiceNumberField = new ZapierInputField("number", "Voice number", "integer")
        .setDescription(`Some voice language and voice gender combinations have multiple options. Select the number of the voice you'd like to use. To test the different voice options, open ${new Link("this webpage", config.links.voiceTest)}, click on the plus and select "Text To Speech message". Enter a message, select the voice you want to hear and then hit the play button.`)

    languageOptions.forEach(item => {
        voiceNumberField.addDropdownItem(item.voiceNumber.toString(), `${item.voiceNumber} (${item.displayName})`, item.voiceNumber == 0)
    })
    
    return [ voiceNumberField ]
}

// --- OutputFields & Sample ---

const result = new ResultGenerator()
    .add("type", "Type", "call-queued")
    .add("caller", "Caller", "+31600000000")
    .add("callees", "Callees", ["+31600000000"])

// --- Export ---

export default {
	key: 'voiceMessage',
	noun: 'Voice',
	
	display: {
		label: 'Send Voice (Text to Speech) Call',
		description: 'Sends a voice message to one or multiple people. The recipient will receive the message as a call.',
		hidden: false,
		important: true
	},
	
	operation: {
		inputFields: [ from, to, messageContent, voiceLanguage, voiceGender, voiceNumber ] as any[],
		outputFields: result.getOutputFields(),
		sample: result.getSample(),
		perform: (z: zObject, bundle: Bundle) => new MessageRequest(z, bundle).startFlow()
	}
}