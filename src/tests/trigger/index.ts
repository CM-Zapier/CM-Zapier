import "should"
import { createAppTester } from "zapier-platform-core"
import App from "../../main/index"

const appTester = createAppTester(App)

import VoiceLanguages from "../../main/triggers/voiceLanguages"

describe("Triggers", () => {
    it("Voice Languages should return a list of languages", async () => {        
        const response = await appTester(App.triggers[VoiceLanguages.key].operation.perform, {})

        response.forEach((item: json) => {
            item.should.have.property("id")
            item.should.have.property("name")
        })
    })
})