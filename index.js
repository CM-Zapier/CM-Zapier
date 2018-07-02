const createTextMessage = require('./creates/text_message');

// Include authentication in all the requests
const addAuthenticationToHeaders = (request, z, bundle) => {
    request.headers = request.headers ? request.headers : {}
    request.headers['X-CM-PRODUCTTOKEN'] = bundle.authData.productToken
    return request
}

// We can roll up all our behaviors in an App.
const App = {
    // This is just shorthand to reference the installed dependencies you have. Zapier will
    // need to know these before we can upload
    version: require('./package.json').version,
    platformVersion: require('zapier-platform-core').version,

    // Authentication
    authentication: require('./authentication'),
    
    // beforeRequest & afterResponse are optional hooks into the provided HTTP client
    beforeRequest: [addAuthenticationToHeaders],
    
    afterResponse: [],
    
    // If you want to define optional resources to simplify creation of triggers, searches, creates - do that here!
    resources: {},
    
    // If you want your trigger to show up, you better include it here!
    triggers: {},
    
    // If you want your searches to show up, you better include it here!
    searches: {},
    
    // If you want your creates to show up, you better include it here!
    creates: {
        [createTextMessage.key]: createTextMessage
    }
}

// Finally, export the app.
module.exports = App;
