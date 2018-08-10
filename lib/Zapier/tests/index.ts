import "should"
import ZapierHttpRequest from "../main/ZapierHttpRequest"

function objectEquals(object1: any, object2: any): boolean {
    if(Object.keys(object1).length != Object.keys(object2).length) return false

    return Object.keys(object1).every((item) => Object.keys(object2).indexOf(item) !== -1) && 
        Object.keys(object1).every((item) => typeof object1[item] == typeof object2[item] && (typeof object1[item] == "object" ? objectEquals(object1[item], object2[item]) : object1[item] === object2[item]))
}

describe("Models", () => {
    it("ZapierRequest with url only should return correct object", () => {
        const testObject = {
            url: "https://example.com",
            method: "GET"
        }
        objectEquals(new ZapierHttpRequest(testObject.url), testObject).should.be.true
    })
    
    it("ZapierRequest with url, POST and json body should return correct object", () => {
        const jsonBody = { a: "b" }
        const testObject = {
            url: "https://example.com",
            method: "POST" as "POST",
            body: JSON.stringify(jsonBody)
        }
        objectEquals(new ZapierHttpRequest(testObject.url, testObject.method, jsonBody), testObject).should.be.true
    })
})