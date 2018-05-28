// Created by 'zapier convert'. This is just a stub - you will need to edit!

const BulkmessagesCreate = require('./creates/bulk_messages');
const HybridmessagesCreate = require('./creates/hybrid_messages');
const LookupCreate = require('./creates/look_up');
const MessagesCreate = require('./creates/messages');
const PushmessagesCreate = require('./creates/push_messages');
const ValidatephonenumberCreate = require('./creates/validate_phone_number');
const VoicetextCreate = require('./creates/voice_text');

const App = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  beforeRequest: [],

  afterResponse: [],

  resources: {},

  triggers: {},

  searches: {},

  creates: {
    [BulkmessagesCreate.key]: BulkmessagesCreate,
    [HybridmessagesCreate.key]: HybridmessagesCreate,
    [LookupCreate.key]: LookupCreate,
    [MessagesCreate.key]: MessagesCreate,
    [PushmessagesCreate.key]: PushmessagesCreate,
    [ValidatephonenumberCreate.key]: ValidatephonenumberCreate,
    [VoicetextCreate.key]: VoicetextCreate
  }
};

module.exports = App;
