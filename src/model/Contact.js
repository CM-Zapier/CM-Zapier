const moment = require("moment")

class Contact {
    constructor(){
        this.createdOnUtc = moment().utc().format().replace("Z", "")
    }

    setName(firstName, insertion, lastName){
        this.firstName = firstName
        this.insertion = insertion
        this.lastName = lastName
    }

    setFullName(fullName){
        this.setName(undefined, undefined, fullName)
    }
}

module.exports = Contact