export default interface Message {
    getSender(): string
    setSender(sender: string): void

    getReceivers(): string[]
    addReceivers(...receivers: string[]): void

    getMessage(): string
    setMessage(content: string): void
}