const textMessage = require('./creates/textMessage')
const voiceMessage = require('./creates/voiceMessage')

const App = {
    version: require('./package.json').version,
    platformVersion: require('zapier-platform-core').version,

    authentication: require('./auth/authentication'),

    beforeRequest: [ require("./auth/addAuthToHeaders.js") ],
    afterResponse: [],

    resources: {},
    triggers: {},
    searches: {},
    creates: {
        [textMessage.key]: textMessage,
        [voiceMessage.key]: voiceMessage
    }
}

module.exports = App