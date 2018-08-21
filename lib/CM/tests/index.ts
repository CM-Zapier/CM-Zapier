import "should"
import Voice from "../main/model/Voice"

describe("Voice", () => {
    it("Voice should return correct object", () => {
        const testObject = {
            language: "en-GB",
            gender: "Female" as "Female",
            number: 2
        }
        new Voice(testObject.language, testObject.gender, testObject.number).should.have.properties(testObject)
    })
})

import VoiceMessage from "../main/model/VoiceMessage"

describe("VoiceMessage", () => {
    it("VoiceMessage should return correct object", () => {
        const testObject = {
            callees: ["+31601234567"],
            caller: "+31612345678",
            prompt: "Hello world!",
            "prompt-type": "TTS",
            anonymous: false,
            customGrouping3: "Zapier",
            voice: {
                language: "nl-NL",
                gender: "Male" as "Male",
                number: 1
            }
        }
        new VoiceMessage(testObject.caller, testObject.callees, testObject.prompt, new Voice(testObject.voice.language, testObject.voice.gender, testObject.voice.number)).should.have.properties(testObject)
    })
    
    it("VoiceMessage should handle multiple phone numbers correctly", () => {
        const testObject = {
            callees: ["+31601234567", "+31623456789"],
            caller: "+31612345678",
            prompt: "Hello world!",
            "prompt-type": "TTS",
            anonymous: false,
            customGrouping3: "Zapier",
            voice: {
                language: "nl-NL",
                gender: "Male" as "Male",
                number: 1
            }
        }
        new VoiceMessage(testObject.caller, testObject.callees, testObject.prompt, new Voice(testObject.voice.language, testObject.voice.gender, testObject.voice.number)).should.have.properties(testObject)
    })
    
    it("VoiceMessage should throw an error for incorrect phone numbers in callees", () => {
        const testObject = {
            callees: ["+31601234567", "abcdef"],
            caller: "+31612345678",
            prompt: "Hello world!",
            "prompt-type": "TTS",
            anonymous: false,
            customGrouping3: "Zapier",
            voice: {
                language: "nl-NL",
                gender: "Male" as "Male",
                number: 1
            }
        }
        new VoiceMessage(testObject.caller, testObject.callees, testObject.prompt, new Voice(testObject.voice.language, testObject.voice.gender, testObject.voice.number)).should.throw(Error)
    })
    
    it("VoiceMessage should throw an appropiate error for an incorrect phone number in caller", () => {
        const testObject = {
            callees: ["+31601234567", "+31612345678"],
            caller: "abcdef",
            prompt: "Hello world!",
            "prompt-type": "TTS",
            anonymous: false,
            customGrouping3: "Zapier",
            voice: {
                language: "nl-NL",
                gender: "Male" as "Male",
                number: 1
            }
        }
        new VoiceMessage(testObject.caller, testObject.callees, testObject.prompt, new Voice(testObject.voice.language, testObject.voice.gender, testObject.voice.number)).should.throw(Error)
    })
})