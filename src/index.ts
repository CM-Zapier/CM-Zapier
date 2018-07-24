import * as zapier from "zapier-platform-core"
import textMessage from './creates/textMessage'
import voiceMessage from './creates/voiceMessage'
import authentication from "./auth/authentication"
import addAuthToHeaders from "./auth/addAuthToHeaders"

declare function require(path: string): any
const addContact = require('./creates/contact')
const numberVerifier = require('./searches/numberVerifier')
const voiceLanguages = require('./triggers/voiceLanguages')

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