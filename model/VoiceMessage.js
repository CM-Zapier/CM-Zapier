String.prototype.matches = function (regex) {
    return regex.test(this)
}

function checkPhoneNumberValidity(phoneNumber){
    if (!phoneNumber.matches(/(|\+)[0-9]+/) || phoneNumber.matches(/[A-z]+/))
        throw new Error("The specified phone number is not a valid phone number, it contains invalid characters")
}

class VoiceMessage {
    constructor(from, toList, body, voice){
        // To field
        this.callees = toList.map((phoneNumber) => phoneNumber.trim())
        this.callees.forEach((phoneNumber) => checkPhoneNumberValidity(phoneNumber))

        // From field
        this.caller = from.trim()
        checkPhoneNumberValidity(this.caller)
        
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