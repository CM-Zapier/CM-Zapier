require('json5/lib/register')
const config = require('./config.json5')

String.prototype.matches = function (regex) {
    return regex.test(this)
}

String.prototype.replaceAll = function (search, replacement) {
    return this.replace(new RegExp(search, 'g'), replacement)
}

module.exports = (phoneNumber) => {
    phoneNumber = phoneNumber.replace("(", "").replace(")", "").replaceAll(" ", "").replaceAll("-", "")

    if (!phoneNumber.matches(/(0|\+)[0-9]+/) || phoneNumber.matches(/[A-z]+/))
        throw new Error(`The specified phone number is not [a valid phone number](${config.links.helpDocs.phoneNumberFormat}). Examples of valid formats: +31 (6) 00000000, +31600000000, +1 000-000-0000 or 0031600000000.`)

    return phoneNumber
}