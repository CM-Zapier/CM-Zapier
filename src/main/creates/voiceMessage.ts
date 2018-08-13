import { zObject, Bundle, HttpMethod } from "zapier-platform-core"
import ZapierRequest from "../../../lib/Zapier/main/ZapierRequest"
import Voice from "../../../lib/CM/main/model/Voice"
import VoiceMessage from "../../../lib/CM/main/model/VoiceMessage"
import VoiceLanguages from "../triggers/voiceLanguages"
import { ZapierField, ZapierGroup, ZapierInputField } from "../../../lib/Zapier/main/ZapierFields"
import errorHandler from "../../../lib/CM/main/errorHandler"
import config from "../../../lib/CM/main/config"

// --- Request to CM API ---

class MessageReuqest extends ZapierRequest {
    protected url: string = `https://gw.cmtelecom.com/v1.0/message`
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

    protected mapOutput(response: json): json {
        return {
            result: "success"
        }
    }
}

const makeRequest = (z: zObject, bundle: Bundle) => new MessageReuqest(z, bundle).startFlow()

// --- Inputfields ---

const from = new ZapierInputField.Builder("from", "From")
    .setDescription(`The sender of the message, which must be a [phone number (with country code)](${config.links.helpDocs.phoneNumberFormat}).`)
    .build()

const to = new ZapierInputField.Builder("to", "To")
    .setDescription(`The [recipient numbers (with country code)](${config.links.helpDocs.phoneNumberFormat}) to whom you want to send the message.\n\nYou can use the list functionality, or put all your numbers into the first field seperated by a comma.`)
    .asList()
    .build()

const messageContent = new ZapierInputField.Builder("messageContent", "Text", "text")
    .setDescription(`The content of the message. The speech engine will tell this message.\n\nNote: emoji don't work, you can't use emoji in spoken language.`)
    .build()

const voiceLanguage = new ZapierInputField.Builder("language", "Language")
    .setDescription(`The language of the message.\nThere are several languages and dialects available.`)
    .connectDropdownToTrigger(VoiceLanguages.key, "id", "name")
    .setDefault("en-GB")
    .build()

const voiceGender = new ZapierInputField.Builder("gender", "Gender")
    .setDescription(`The voice of the generated message.\n\nNote: not all voices support all genders, [check this list for the supported genders](${config.links.helpDocs.voiceGenders}).`)
    .addDropdownItem("Female", "Female", true)
    .addDropdownItem("Male", "Male")
    .build()

const voiceNumber = new ZapierInputField.Builder("number", "Number", "integer")
    .setDescription(`The number of the voice to use, [check this list for the supported numbers](${config.links.helpDocs.voiceNumbers}).`)
    .setDefault("1")
    .build()

const voiceGroup = new ZapierGroup.Builder("voice_options", "Voice Options")

// --- Export ---

export default {
	key: 'voiceMessage',
	noun: 'Voice',
	
	display: {
		label: 'Send Voice (Text to Speech) Message',
		description: 'Send a voice message to one or multiple people. A speech engine will tell the text message you gave in the selected language, dialect and gender. The recipient will receive the message as a call.',
		hidden: false,
		important: true
	},
	
	operation: {
		inputFields: [ from, to, messageContent, voiceGroup.add(voiceLanguage).add(voiceGender).add(voiceNumber).build() ] as any[],
		outputFields: [ new ZapierField("result", "Result") as any ],
		perform: makeRequest,
		sample: {
            result: "success"
        }
	}
}