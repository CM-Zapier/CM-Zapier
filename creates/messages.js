// "Create" stub created by 'zapier convert'. This is just a stub - you will need to edit!
const { replaceVars } = require('../utils');

const makeRequest = (z, bundle) => {
  const scripting = require('../scripting');
  const legacyScriptingRunner = require('zapier-platform-legacy-scripting-runner')(scripting);

  bundle._legacyUrl = 'https://gw.cmtelecom.com/v1.0/message';
  bundle._legacyUrl = replaceVars(bundle._legacyUrl, bundle);

  // Do a _pre_write() from scripting.
  const preWriteEvent = {
    name: 'create.pre',
    key: 'messages'
  };
  return legacyScriptingRunner
    .runEvent(preWriteEvent, z, bundle)
    .then(preWriteResult => z.request(preWriteResult))
    .then(response => {
      response.throwForStatus();

      // Do a _post_write() from scripting.
      const postWriteEvent = {
        name: 'create.post',
        key: 'messages',
        response
      };
      return legacyScriptingRunner.runEvent(postWriteEvent, z, bundle);
    });
};

module.exports = {
  // const Messages = {
  key: 'messages',
  noun: 'Sms',

  display: {
    label: 'Send SMS',
    description: 'Send an SMS to one number.',
    hidden: false,
    important: true
  },

  operation: {
    inputFields: [
      {
        key: 'Body',
        label: 'Body',
        helpText: 'Please provide the content of message.',
        type: 'string',
        required: true
      },
      {
        key: 'From',
        label: 'From',
        helpText: "Please provide sender's name.",
        type: 'string',
        required: true
      },
      {
        key: 'Reference',
        label: 'Reference',
        helpText: 'Please set the reference.',
        type: 'string',
        required: false,
        default: 'None'
      },
      {
        key: 'To',
        label: 'To',
        helpText: 'Please provide the recipient number(with country code) to whom you want to send the message.',
        type: 'string',
        required: true
      }
    ],
    outputFields: [
      {
        key: 'Status',
        type: 'string'
      }
    ],
    perform: makeRequest,
    sample: { Status: 'Success' }
  }
};
// module.exports = Messages;

