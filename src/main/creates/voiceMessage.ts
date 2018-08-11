import { zObject, Bundle } from "zapier-platform-core"
import ZapierHttpRequest from "../../../lib/Zapier/main/ZapierHttpRequest"
import Voice from "../../../lib/CM/main/model/Voice"
import VoiceMessage from "../../../lib/CM/main/model/VoiceMessage"
import VoiceLanguages from "../triggers/voiceLanguages"
import { ZapierField, ZapierGroup, ZapierInputField } from "../../../lib/Zapier/main/ZapierFields"
import errorHandler from "../../../lib/CM/main/errorHandler"
import config from "../../../lib/CM/main/config"

const makeRequest = async (z: zObject, bundle: Bundle): Promise<object> => {
    let toNumbersList = bundle.inputData.to
    toNumbersList = toNumbersList.length == 1 && toNumbersList[0].includes(",") ? toNumbersList[0].split(",") : toNumbersList
    
    const voice = new Voice(bundle.inputData.language, bundle.inputData.gender, bundle.inputData.number - 0)
    const voiceMessage = new VoiceMessage(bundle.inputData.from, toNumbersList, bundle.inputData.messageContent, voice)
    
    const response = await z.request(new ZapierHttpRequest("https://api.cmtelecom.com/voiceapi/v2/Notification", "POST", voiceMessage))
    
    errorHandler(response.status, response.content)
    
    return {
        result: "success"
    }
}

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
		inputFields: [ from, to, messageContent, voiceGroup.addChild(voiceLanguage).addChild(voiceGender).addChild(voiceNumber).build() ],
		outputFields: [ new ZapierField("result", "Result") ],
		perform: makeRequest,
		sample: {
            result: "success"
        }
	}
}