import "should"
import phoneNumberFormatter from "../main/phoneNumberFormatter"

describe("Phone number formatter", () => {
    it("Invalid phone numbers should throw errors", () => {
        phoneNumberFormatter.bind(null, "+316123abc45").should.throw(Error)
        phoneNumberFormatter.bind(null, "+31612345abc").should.throw(Error)
        phoneNumberFormatter.bind(null, "+316abc12345").should.throw(Error)
        phoneNumberFormatter.bind(null, "abcdefghijkl").should.throw(Error)
        phoneNumberFormatter.bind(null, "............").should.throw(Error)
        phoneNumberFormatter.bind(null, ".-/{}[];'\"><?:").should.throw(Error)
    })

    it("Valid phone numbers should not throw errors", () => {
        phoneNumberFormatter.bind(null, "+31612345678").should.not.throw()
        phoneNumberFormatter.bind(null, "+31 (184) 123456").should.not.throw()
        phoneNumberFormatter.bind(null, "0031612345678").should.not.throw()
    })

    it("Valid phone numbers should output themselves", () => {
        phoneNumberFormatter("+31612345678").should.equal("+31612345678")
        phoneNumberFormatter("0031612345678").should.equal("0031612345678")
    })

    it("Valid phone numbers in different formats should return valid formats", () => {
        phoneNumberFormatter("+31 (6) 1234-5678").should.equal("+31612345678")
        phoneNumberFormatter("+31 (184) 123456").should.equal("+31184123456")
    })
})