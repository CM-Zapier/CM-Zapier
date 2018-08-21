import "should"
import ZapierHttpRequest from "../main/ZapierHttpRequest"

describe("Models", () => {
    it("ZapierRequest with url only should return correct object", () => {
        const testObject = {
            url: "https://example.com",
            method: "GET"
        }
        new ZapierHttpRequest(testObject.url).should.have.properties(testObject)
    })
    
    it("ZapierRequest with url, POST and json body should return correct object", () => {
        const jsonBody = { a: "b" }
        const testObject = {
            url: "https://example.com",
            method: "POST" as "POST",
            body: JSON.stringify(jsonBody)
        }
        new ZapierHttpRequest(testObject.url, testObject.method, jsonBody).should.have.properties(testObject)
    })
})