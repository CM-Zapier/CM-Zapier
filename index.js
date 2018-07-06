const ZapierApp = require('./model/ZapierApp')

const App = new ZapierApp()

App.addAuthentication(require('./authentication'), (request, z, bundle) => {
    request.headers = request.headers ? request.headers : {}
    request.headers['X-CM-PRODUCTTOKEN'] = bundle.authData.productToken
    return request
})

App.addAction(require('./creates/text_message'))

module.exports = App;
