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
    }

    setEmail(email){
        if(!validator.validate(email)) 
            throw new Error("The email address you supplied is not valid")
            
        this.email = email
    }

    addCustomValue(id, value){
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
        this.addCustomValue(6, company)
    }
}

module.exports = Contact