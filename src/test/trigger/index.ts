import "should"
import { createAppTester } from "zapier-platform-core"
import App from "../../index"

const appTester = createAppTester(App)

import VoiceLanguages from "../../triggers/voiceLanguages"

describe("Triggers",  () => {
    it("Voice Languages should return a list of languages", async () => {
        const bundle = {
            authData: {
                productToken: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
            }
        }
        
        const response = await appTester(App.triggers[VoiceLanguages.key].operation.perform, bundle)

        response.forEach((item) => {
            item.should.have.property("id")
            item.should.have.property("name")
        })
    })
})