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

    setCompany(company){
        this.customValues = this.customValues ? this.customValues : []
        this.customValues.push({
            fieldId: 6,
            value: company
        })
    }
}

module.exports = Contact