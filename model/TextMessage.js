require('json5/lib/register')
const config = require('../config.json5')

String.prototype.matches = function (regex) {
    return regex.test(this)
}

class TextMessage {
    constructor(from, toList, body){
        // To field
        this.to = toList.map((phoneNumber) => {
            return {
                number: phoneNumber.trim()
            }
        })

        // From field
        var from = from.trim()
        if (from.matches(/(|\+)[0-9]+/)) {
            if (from.length > config.textFromField.maxDigits) {
                throw new Error("From length is more than maximally allowed (" + config.textFromField.maxDigits + " digits)")
            }
        } else if (from.length > config.textFromField.maxChars) {
            throw new Error("From length is more than maximally allowed (" + config.textFromField.maxChars + " alphanumerical characters)")
        }
        this.from = from
        
        // Message body
        this.body = {
            type: "AUTO",
            content: body/* .replace(/\r/g, "").replace(/\n/g, "") */.trim()
        }

        // Other
        this.minimumNumberOfMessageParts = 1
        this.maximumNumberOfMessageParts = 8

        this.customGrouping3 = "Zapier" // Allows CM.com to track where requests originate from.
    }
    
    setUseSMS(){
        this.allowedChannels = this.allowedChannels ? this.allowedChannels : []
        this.allowedChannels.push("sms")
    }
    
    setUsePush(appKey){
        this.allowedChannels = this.allowedChannels ? this.allowedChannels : []
        this.allowedChannels.push("push")
        this.appKey = appKey
    }
    
    setReference(reference){
        this.reference = reference
    }
    
    setValidity(validity){
        this.validity = validity
    }
}

module.exports = TextMessage