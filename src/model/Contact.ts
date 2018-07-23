declare function require(path: string): any

import * as validator from "email-validator"
const phoneNumberFormatter = require("../phoneNumberFormatter")

export default class Contact {
    public firstName: string | undefined
    public insertion: string | undefined
    public lastName: string | undefined
    public phoneNumber: string | undefined
    public email: string | undefined
    public customValues: {fieldId: number, value: string}[] | undefined

    public setName(firstName: string | undefined, insertion: string | undefined, lastName: string | undefined) {        
        this.firstName = firstName
        this.insertion = insertion
        this.lastName = lastName
    }

    public setFullName(fullName: string) {
        this.setName(undefined, undefined, fullName)
    }

    public setTelephoneNumber(telephoneNumber: string) {        
        this.phoneNumber = phoneNumberFormatter(telephoneNumber.trim())
    }

    public setEmail(email: string) {
        if (!validator.validate(email))
            throw new Error("The email address you supplied is not valid")

        this.email = email
    }

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

    public setCompany(company: string) {
        this.addCustomValue(6, company)
    }

    public addCustomField(number: number, value: string) {
        if (number < 1 || number > 10)
            throw new Error("Custom field numbers must be in the 1 to 10 range.")

        this.addCustomValue(number + 6, value)
    }
}