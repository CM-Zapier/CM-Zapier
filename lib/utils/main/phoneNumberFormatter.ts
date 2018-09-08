declare global {
    interface String {
        matches(regex: RegExp): boolean 
        replaceAll(search: string, replacement: string): string
    }
}

String.prototype.matches = function (regex: RegExp): boolean {
    return regex.test(this.toString())
}

String.prototype.replaceAll = function (search: string, replacement: string): string {
    return this.replace(new RegExp(search, 'g'), replacement)
}

export default (phoneNumber: string): string => {
    phoneNumber = phoneNumber.replace("(", "").replace(")", "").replaceAll(" ", "").replaceAll("-", "")

    if (!phoneNumber.matches(/(0|\+)[0-9]+/) || phoneNumber.matches(/[A-z]+/))
        throw new Error("The specified phone number is not a valid phone number. Examples of valid formats: +31 (6) 00000000, +31600000000, +1 000-000-0000 or 0031600000000.")

    return phoneNumber
}