import "should"
import Voice from "../main/model/Voice"
import VoiceMessage from "../main/model/VoiceMessage"

function objectEquals(object1: any, object2: any): boolean {
    if(Object.keys(object1).length != Object.keys(object2).length) return false

    return Object.keys(object1).every((item) => Object.keys(object2).indexOf(item) !== -1) && 
        Object.keys(object1).every((item) => typeof object1[item] == typeof object2[item] && (typeof object1[item] == "object" ? objectEquals(object1[item], object2[item]) : object1[item] === object2[item]))
}

describe("Models", () => {    
    it("Voice should return correct object", () => {
        const testObject = {
            language: "en-GB",
            gender: "Female" as "Female",
            number: 2
        }
        objectEquals(new Voice(testObject.language, testObject.gender, testObject.number), testObject).should.be.true
    })
    
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
        objectEquals(new VoiceMessage(testObject.caller, testObject.callees, testObject.prompt, new Voice(testObject.voice.language, testObject.voice.gender, testObject.voice.number)), testObject).should.be.true
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
        objectEquals(new VoiceMessage(testObject.caller, testObject.callees, testObject.prompt, new Voice(testObject.voice.language, testObject.voice.gender, testObject.voice.number)), testObject).should.be.true
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
        try{
            new VoiceMessage(testObject.caller, testObject.callees, testObject.prompt, new Voice(testObject.voice.language, testObject.voice.gender, testObject.voice.number))
        } catch (error) {
            error.message.should.containEql("The specified phone number is not a valid phone number, it contains invalid characters")
        }
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
        try {
            new VoiceMessage(testObject.caller, testObject.callees, testObject.prompt, new Voice(testObject.voice.language, testObject.voice.gender, testObject.voice.number))
        } catch (error) {
            error.message.should.containEql("The specified phone number is not a valid phone number, it contains invalid characters")
        }
    })
})