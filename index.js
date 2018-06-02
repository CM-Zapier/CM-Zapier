// Created by 'zapier convert'. This is just a stub - you will need to edit!

const authentication = require('./authentication');
const NewaccountTrigger = require('./triggers/new_account');
const NumlookupSearch = require('./searches/num_look_up');
const NumvalidationSearch = require('./searches/num_validation');
const HybridmessagesCreate = require('./creates/hybrid_messages');
const MessagesCreate = require('./creates/messages');
const PushmessagesCreate = require('./creates/push_messages');
const VoicetextCreate = require('./creates/voice_text');

const maybeIncludeAuth = (request, z, bundle) => {
  request.headers['Shared Key'] = `${bundle.authData['shrdKey']}`;

  request.headers['Username'] = `${bundle.authData['userN']}`;

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
    [NumlookupSearch.key]: NumlookupSearch,
    [NumvalidationSearch.key]: NumvalidationSearch
  },

  creates: {
    [HybridmessagesCreate.key]: HybridmessagesCreate,
    [MessagesCreate.key]: MessagesCreate,
    [PushmessagesCreate.key]: PushmessagesCreate,
    [VoicetextCreate.key]: VoicetextCreate
  }
};

module.exports = App;
