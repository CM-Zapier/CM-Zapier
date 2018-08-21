import "should"
import Voice from "../main/model/Voice"
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
            voice: new Voice("nl-NL", "Male", 1)
        }
        new VoiceMessage(testObject.caller, testObject.callees, testObject.prompt, testObject.voice).should.have.properties(testObject)
    })
    
    it("VoiceMessage should handle multiple phone numbers correctly", () => {
        const testObject = {
            callees: ["+31601234567", "+31623456789"],
            caller: "+31612345678",
            prompt: "Hello world!",
            "prompt-type": "TTS",
            anonymous: false,
            customGrouping3: "Zapier",
            voice: new Voice("nl-NL", "Male", 1)
        }
        new VoiceMessage(testObject.caller, testObject.callees, testObject.prompt, testObject.voice).should.have.properties(testObject)
    })
    
    it("VoiceMessage should throw an error for incorrect phone numbers in callees", () => {
        const testObject = {
            callees: ["+31601234567", "abcdef"],
            caller: "+31612345678",
            prompt: "Hello world!",
            "prompt-type": "TTS",
            anonymous: false,
            customGrouping3: "Zapier",
            voice: new Voice("nl-NL", "Male", 1)
        }
        VoiceMessage.constructor.bind(testObject.caller, testObject.callees, testObject.prompt, testObject.voice).should.throw(Error)
    })
    
    it("VoiceMessage should throw an appropiate error for an incorrect phone number in caller", () => {
        const testObject = {
            callees: ["+31601234567", "+31612345678"],
            caller: "abcdef",
            prompt: "Hello world!",
            "prompt-type": "TTS",
            anonymous: false,
            customGrouping3: "Zapier",
            voice: new Voice("nl-NL", "Male", 1)
        }
        VoiceMessage.constructor.bind(testObject.caller, testObject.callees, testObject.prompt, testObject.voice).should.throw(Error)
    })
})