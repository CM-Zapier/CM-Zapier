String.prototype.matches = function (regex) {
    return regex.test(this)
}

String.prototype.replaceAll = function (search, replacement) {
    return this.replace(new RegExp(search, 'g'), replacement)
}

module.exports = (phoneNumber) => {
    phoneNumber = phoneNumber.replace("(", "").replace(")", "").replaceAll(" ", "").replaceAll("-", "")

    if (!phoneNumber.matches(/(|\+)[0-9]+/) || phoneNumber.matches(/[A-z]+/))
        throw new Error("The specified phone number is not a valid phone number, it contains invalid characters")

    return phoneNumber
}