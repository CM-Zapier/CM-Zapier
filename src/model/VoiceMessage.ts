declare function require(path: string): any

import Voice from "./Voice"
const phoneNumberFormatter: (phoneNumber: string) => string = require("../phoneNumberFormatter")

export default class VoiceMessage {
    public callees: string[]
    public caller: string
    public "prompt-type": string = "TTS"
    public anonymous: boolean = false
    public customGrouping3: string = "Zapier" // Allows CM.com to track where requests originate from.

    constructor(from: string, toList: string[], public prompt: string, public voice: Voice){
        this.callees = toList.map((phoneNumber) => phoneNumberFormatter(phoneNumber.trim()))
        this.caller = phoneNumberFormatter(from.trim())
    }
}