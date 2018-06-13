// Created by 'zapier convert'. This is just a stub - you will need to edit!

const authentication = require('./authentication');
const NewaccountTrigger = require('./triggers/new_account');
const NumberverifierSearch = require('./searches/number_verifier');
const TextmessageCreate = require('./creates/text_message');
const VoicemessageCreate = require('./creates/voice_message');

const maybeIncludeAuth = (request, z, bundle) => {
  request.headers['Shared Key'] = `${bundle.authData['sharedKey']}`;

  request.headers['Username'] = `${bundle.authData['userName']}`;

  request.headers['x-cm-producttoken'] = `${bundle.authData['productToken']}`;

  return request;
};

const App = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  authentication,

  beforeRequest: [maybeIncludeAuth],

  afterResponse: [],

  resources: {},

  triggers: {
    [NewaccountTrigger.key]: NewaccountTrigger
  },

  searches: {
    [NumberverifierSearch.key]: NumberverifierSearch
  },

  creates: {
    [TextmessageCreate.key]: TextmessageCreate,
    [VoicemessageCreate.key]: VoicemessageCreate
  }
};

module.exports = App;
