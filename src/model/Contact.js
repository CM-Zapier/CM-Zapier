const validator = require("email-validator")
const phoneNumberFormatter = require("../phoneNumberFormatter")

class Contact {
    setName(firstName, insertion, lastName){
        this.firstName = firstName
        this.insertion = insertion
        this.lastName = lastName
    }

    setFullName(fullName){
        this.setName(undefined, undefined, fullName)
    }

    setTelephoneNumber(telephoneNumber){
        this.phoneNumber = phoneNumberFormatter(telephoneNumber.trim())
        this.phoneCountry = this.phoneNumber.startsWith("+31") || this.phoneNumber.startsWith("0031") ? "NL" : undefined
    }

    setEmail(email){
        if(!validator.validate(email)) 
            throw new Error("The email address you supplied is not valid")
            
        this.email = email
    }

    __addCustomValue(id, value){
        this.customValues = this.customValues ? this.customValues : []
        const obj = {
            fieldId: id,
            value: value
        }
        const index = this.customValues.findIndex(item => item.fieldId === id)
        if(index == -1) this.customValues.push(obj)
        else this.customValues[index] = obj
    }

    setCompany(company){
        this.__addCustomValue(6, company)
    }

    addCustomField(number, value){
        if(number < 1 || number > 10)
            throw new Error("Custom field numbers must be in the 1 to 10 range.")

        this.__addCustomValue(number + 6, value)
    }
}

module.exports = Contact