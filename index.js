const textMessage = require('./creates/textMessage-inputFields')
const voiceMessage = require('./creates/voiceMessage-inputFields')

const App = {
    version: require('./package.json').version,
    platformVersion: require('zapier-platform-core').version,

    authentication: require('./auth/authentication-inputFields'),

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