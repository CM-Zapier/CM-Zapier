import * as validator from "email-validator"
import phoneNumberFormatter from "../phoneNumberFormatter"

export default class Contact {
    private firstName?: string
    private insertion?: string
    private lastName?: string
    private phoneNumber?: string
    private email?: string
    private customValues?: { fieldId: number, value: string }[]

    // --- Name ---

    public getName(): { firstName?: string, insertion?: string, lastName?: string } {
        return {
            firstName: this.firstName,
            insertion: this.insertion,
            lastName: this.lastName
        }
    }

    public setName(firstName?: string, insertion?: string, lastName?: string) {        
        this.firstName = firstName
        this.insertion = insertion
        this.lastName = lastName
    }
 
    public setFullName(fullName: string) {
        this.setName(undefined, undefined, fullName)
    }

    // --- Telephone number ---

    public getTelephoneNumber(): string | undefined {
        return this.phoneNumber
    }

    public setTelephoneNumber(telephoneNumber: string) {        
        this.phoneNumber = phoneNumberFormatter(telephoneNumber.trim())
    }

    // --- Email address ---

    public getEmailAddress(): string | undefined {
        return this.email
    }

    public setEmailAddress(email: string) {
        if (!validator.validate(email))
            throw new Error("The email address you supplied is not valid")

        this.email = email
    }

    // --- Custom values ---

    private addCustomValue(id: number, value: string) {
        this.customValues = this.customValues ? this.customValues : []
        const obj = {
            fieldId: id,
            value: value
        }
        const index = this.customValues.findIndex(item => item.fieldId === id)
        if (index == -1) this.customValues.push(obj)
        else this.customValues[index] = obj
    }

    public getCompany(): string | undefined {
        return this.getCustomField(0)
    }

    public setCompany(company: string) {
        this.addCustomValue(6, company)
    }

    public getCustomField(index: number): string | undefined {
        const i = (this.customValues || []).findIndex(item => item.fieldId === index + 6)
        return i == -1 ? undefined : (this.customValues || [])[i].value
    }

    public addCustomField(number: number, value: string) {
        if (number < 1 || number > 10)
            throw new Error("Custom field numbers must be in the 1 to 10 range.")

        this.addCustomValue(number + 6, value)
    }
}