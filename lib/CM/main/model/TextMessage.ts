import * as moment from "moment"
import Message from "./Message"
import phoneNumberFormatter from "../../../utils/main/phoneNumberFormatter"
import config from "../config"

type DateTime = moment.Moment

type MessageChannel = "push" | "sms"

export default class TextMessage implements Message {
    private to: { number: string }[] = []
    private from!: string
    private body!: { type?: "AUTO", content: string }

    private allowedChannels?: MessageChannel[]
    private appKey?: string
    private reference?: string
    private validity?: string

    public readonly minimumNumberOfMessageParts = 1
    public readonly maximumNumberOfMessageParts = 8

    public readonly customGrouping3 = "Zapier" // Allows CM.com to track where requests originate from.

    public constructor(sender: string, receivers: string[], body: string){
        this.setSender(sender)
        this.addReceivers(...receivers)
        this.setMessage(body)
    }

    // --- Sender ---

    public getSender(): string {
        return this.from
    }

    public setSender(from: string){
        from = from.trim()
        let isFromAPhoneNumber: boolean | undefined
        try {
            from = phoneNumberFormatter(from)
            isFromAPhoneNumber = true
        } catch (error) {
            isFromAPhoneNumber = false
        }

        if (isFromAPhoneNumber && from.length > config.textFromField.maxDigits) {
            throw new Error(`From length is more than maximally allowed (${config.textFromField.maxDigits} digits)`)
        } 
        if (!isFromAPhoneNumber && from.length > config.textFromField.maxChars) {
            throw new Error(`From length is more than maximally allowed (${config.textFromField.maxChars} alphanumerical characters)`)
        }
        
        this.from = from
    }

    // --- Receivers ---

    public getReceivers(): string[]{
        return this.to.map((object) => object.number)
    }

    public addReceivers(...receivers: string[]){
        this.to = receivers.map((phoneNumber) => {
            return {
                number: phoneNumberFormatter(phoneNumber.trim())
            }
        }).concat(this.to)
    }

    // --- Body ---

    public getMessage(): string {
        return this.body.content
    }

    public usesAutoEncoding(): boolean {
        return this.body.type != undefined
    }

    public setMessage(content: string, autoEncoding: boolean = true){
        this.body = {
            type: autoEncoding ? "AUTO" : undefined,
            content: content
        }
    }

    // --- Channels ---

    public getChannels(): MessageChannel[] {
        return this.allowedChannels || []
    }

    public usesSMS(): boolean {
        return this.getChannels().indexOf("sms") != -1
    }

    public usesPush(): boolean {
        return this.getChannels().indexOf("push") != -1
    }

    public isSMSOnly(): boolean {
        return this.getChannels() == ["sms"]
    }

    public isPushOnly(): boolean {
        return this.getChannels() == ["push"]
    }

    public isPushOrSMS(): boolean {
        return this.usesPush() && this.usesSMS()
    }
    
    public setUseSMS(){
        this.allowedChannels = this.allowedChannels ? this.allowedChannels : []
        this.allowedChannels.push("sms")
    }
    
    public setUsePush(appKey: string){
        this.allowedChannels = this.allowedChannels ? this.allowedChannels : []
        this.allowedChannels.push("push")
        this.appKey = appKey
    }

    // --- Reference ---

    public getReference(): string | undefined {
        return this.reference
    }

    public setReference(reference: string){
        this.reference = reference
    }

    // --- Validity time ---

    private convertMomentToCMdate(momentDate: DateTime): string {
        return momentDate.format().replace("T", " ").replace("Z", " GMT")
    }

    private convertCMdateToMoment(cmDate: string): DateTime {
        return moment(cmDate.replace(" GMT", "Z").replace(" ", "T"))
    }

    public getValidityTime(): DateTime {
        return this.validity ? this.convertCMdateToMoment(this.validity) : moment().add(config.validityTime.default, "minutes")
    }

    public setValidityTime(validityTime: DateTime){
        if(!validityTime.isSameOrBefore(moment().add(config.validityTime.maximum, "minutes"))) 
            throw new Error(`Validity time (${validityTime.calendar()}) is later than maximally allowed (${moment().add(config.validityTime.maximum, "minutes").calendar()})`)
        else if (!validityTime.isSameOrAfter(moment().add(config.validityTime.minimum, "minutes"))) 
            throw new Error(`Validity time (${validityTime.calendar()}) is earlier than minimally allowed (${moment().add(config.validityTime.minimum, "minutes").calendar()})`)
            
        this.validity = this.convertMomentToCMdate(validityTime)
    }
}