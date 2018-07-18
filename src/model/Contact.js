const moment = require("moment")
const validator = require("email-validator")
const phoneNumberFormatter = require("../phoneNumberFormatter")

class Contact {
    constructor(){
        this.createdOnUtc = moment().utc().format().replace("Z", ".0000000")
    }

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

    setCreationDate(parseableDate){
        if(!moment(parseableDate).isSameOrBefore(moment().add(1, "minute")))
            throw new Error("Contact creation date is later than allowed")

        this.createdOnUtc = moment(parseableDate).utc().format().replace("Z", ".0000000")
    }
}

module.exports = Contact