import "should"
import * as moment from "moment"
import * as signale from "signale"

signale.config({
    displayFilename: true,
    displayTimestamp: false,
    displayDate: false
})

describe("Index", () => {
    before(() => {
        signale.success("Current datetime: " + moment().format('LLLL'))
    })

    it("Tests should run", () => {
        (true).should.be.true
    })
})