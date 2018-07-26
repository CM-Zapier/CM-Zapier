import * as zapier from "zapier-platform-core"
import textMessage from "./creates/textMessage"
import voiceMessage from "./creates/voiceMessage"
import numberVerifier from "./searches/numberVerifier"
import voiceLanguages from "./triggers/voiceLanguages"
import authentication from "./auth/authentication"
import addAuthToHeaders from "./auth/addAuthToHeaders"
import addContact from "./creates/contact"

export default {
    version: require('../package.json').version,
    platformVersion: zapier.version,

    authentication: authentication,

    beforeRequest: [ addAuthToHeaders ],
    afterResponse: [],

    resources: {},
    triggers: {
        [voiceLanguages.key]: voiceLanguages
    },
    searches: {
        [numberVerifier.key]: numberVerifier
    },
    creates: {
        [textMessage.key]: textMessage,
        [voiceMessage.key]: voiceMessage,
        [addContact.key]: addContact
    }
}