const ZapierApp = require('./model/ZapierApp')

/* const App = new ZapierApp()

const addAuthToHeaders = require("./auth/addAuthToHeaders.js")
App.addAuthentication(require('./auth/authentication-inputFields'), addAuthToHeaders)

App.addAction(require('./creates/textMessage-inputFields'))

App.addAction(require('./creates/voiceMessage-inputFields')) */

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
        [require('./creates/textMessage-inputFields').key]: require('./creates/textMessage-inputFields'),
        [require('./creates/voiceMessage-inputFields').key]: require('./creates/voiceMessage-inputFields')
    }
}

module.exports = App