const validator = require("email-validator")
const phoneNumberFormatter = require("../phoneNumberFormatter")

class Contact {
    setName(firstName, insertion, lastName) {
        if (!firstName || typeof firstName != "string" || !insertion || typeof insertion != "string" || !lastName || typeof lastName != "string") return
        
        this.firstName = firstName
        this.insertion = insertion
        this.lastName = lastName
    }

    setFullName(fullName) {
        if (!fullName || typeof fullName != "string") return
        
        this.setName(undefined, undefined, fullName)
    }

    setTelephoneNumber(telephoneNumber) {
        if (!phoneNumber || typeof phoneNumber != "string") return 
        
        this.phoneNumber = phoneNumberFormatter(telephoneNumber.trim())
    }

    setEmail(email) {
        if (!email || typeof email != "string") return
        
        if (!validator.validate(email))
            throw new Error("The email address you supplied is not valid")

        this.email = email
    }

    __addCustomValue(id, value) {
        if (!id || typeof id != "number" || !value || typeof value != "string") return
        
        this.customValues = this.customValues ? this.customValues : []
        const obj = {
            fieldId: id,
            value: value
        }
        const index = this.customValues.findIndex(item => item.fieldId === id)
        if (index == -1) this.customValues.push(obj)
        else this.customValues[index] = obj
    }

    setCompany(company) {
        if (!company || typeof company != "string") return

        this.__addCustomValue(6, company)
    }

    addCustomField(number, value) {
        if (!number || typeof number != "number" || !value || typeof value != "string") return

        if (number < 1 || number > 10)
            throw new Error("Custom field numbers must be in the 1 to 10 range.")

        this.__addCustomValue(number + 6, value)
    }
}

module.exports = Contact