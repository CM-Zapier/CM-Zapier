import Voice from "./Voice"
import Message from "./Message"
import phoneNumberFormatter from "../phoneNumberFormatter"

export default class VoiceMessage implements Message {
    private callees: string[] = []
    private caller!: string
    private readonly "prompt-type" = "TTS"
    private readonly anonymous = false

    private readonly customGrouping3 = "Zapier" // Allows CM.com to track where requests originate from.

    public constructor(sender: string, receivers: string[], private prompt: string, private voice: Voice){
        this.setSender(sender)
        this.addReceivers(...receivers)
    }

    // --- Sender ---

    public getSender(): string {
        return this.caller
    }

    public setSender(sender: string){
        this.caller = phoneNumberFormatter(sender.trim())
    }

    // --- Receivers ---

    public getReceivers(): string[]{
        return this.callees
    }

    public addReceivers(...receivers: string[]){
        this.callees = receivers.map((phoneNumber) => phoneNumberFormatter(phoneNumber.trim())).concat(this.callees)
    }

    // --- Content / prompt ---

    public getMessage(): string {
        return this.prompt
    }

    public setMessage(content: string) {
        this.prompt = content
    }

    // --- Voice ---

    public getVoice(): Voice {
        return this.voice
    }

    public setVoice(voice: Voice) {
        this.voice = voice
    }
}