const moment = require("moment")
const validator = require("email-validator");

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

    setEmail(email){
        if(!validator.validate(email)) 
            throw new Error("The email address you supplied is not valid")
            
        this.email = email
    }
}

module.exports = Contact