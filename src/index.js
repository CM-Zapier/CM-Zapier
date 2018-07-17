const textMessage = require('./creates/textMessage')
const voiceMessage = require('./creates/voiceMessage')
const numberVerifier = require('./searches/numberVerifier')
const voiceLanguages = require('./triggers/voiceLanguages')

const App = {
    version: require('../package.json').version,
    platformVersion: require('zapier-platform-core').version,

    authentication: require('./auth/authentication'),

    beforeRequest: [ require("./auth/addAuthToHeaders.js") ],
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
        [voiceMessage.key]: voiceMessage
    }
}

module.exports = App