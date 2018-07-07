class VoiceMessage {
    constructor(from, toList, body, voice){
        // To field
        this.callees = toList.map((phoneNumber) => phoneNumber.trim())

        // From field
        this.caller = from.trim()
        
        // Message body
        this.prompt = body

        // Voice
        this.voice = voice

        // Other
        this['prompt-type'] = "TTS"
        this.anonymous = false
        this.customGrouping3 = "Zapier" // Allows CM.com to track where requests originate from.
    }
}

module.exports = VoiceMessage