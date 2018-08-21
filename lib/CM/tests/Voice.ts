import "should"
import Voice from "../main/model/Voice"

describe("Voice", () => {
    it("Voice should return correct object", () => {
        const testObject = {
            language: "en-GB",
            gender: "Female" as "Female",
            number: 2
        }
        new Voice(testObject.language, testObject.gender, testObject.number).should.have.properties(testObject)
    })
})