import "should"
import * as moment from "moment"

describe("Index", () => {
    it("Tests should run", () => {
        console.log("Current datetime: " + moment().format('LLLL'));
        (true).should.be.true
    })
})