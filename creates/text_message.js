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
    key: 'text_message'
  };
  return legacyScriptingRunner
    .runEvent(preWriteEvent, z, bundle)
    .then(preWriteResult => z.request(preWriteResult))
    .then(response => {
      response.throwForStatus();

      // Do a _post_write() from scripting.
      const postWriteEvent = {
        name: 'create.post',
        key: 'text_message',
        response
      };
      return legacyScriptingRunner.runEvent(postWriteEvent, z, bundle);
    });
};

module.exports = {
  key: 'text_message',
  noun: 'Message',

  display: {
    label: 'Send Text (SMS/Push) Message',
    description:
      'Send an SMS or Push message to one or multiple people, optionally with different senders and different content.',
    hidden: false,
    important: true
  },

  operation: {
    inputFields: [
      {
        key: 'appKey',
        label: 'App Key',
        helpText:
          '**This field is required for push messages.**\n\nThe app key will be generated in the [app manager](https://appmanager.cmtelecom.com/).',
        type: 'string',
        required: false,
        placeholder: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX'
      },
      {
        key: 'from',
        label: 'From',
        helpText: "Please provide sender's name. The maximum length is 11 alphanumerical characters or 16 digits.",
        type: 'string',
        required: true
      },
      {
        key: 'messageContent',
        label: 'Body',
        helpText: 'Please provide the content of message.',
        type: 'string',
        required: true
      },
      {
        key: 'messageType',
        label: 'Message Type',
        helpText: 'Please select the appropriate channel by which you want to send the message.',
        type: 'string',
        required: true,
        default: 'SMS Only',
        choices: { sms: 'SMS only', push_sms: 'Push or SMS', push: 'Push Only' }
      },
      {
        key: 'reference',
        label: 'Reference',
        helpText: 'Please set the reference.',
        type: 'string',
        required: false,
        default: 'None'
      },
      {
        key: 'to',
        label: 'To',
        helpText:
          'Please provide the recipient number (with country code) to whom you want to send the message.\n\nTo send a message to multiple numbers, seperate them with a comma.',
        type: 'string',
        required: true,
        placeholder: '+1224589XXXX , +91976056XXXX'
      },
      {
        key: 'validityTime',
        label: 'Validity Time',
        helpText: 'Set the validity time for your message. Minimally 1 minute, maximally 48 hours. Format: 0h0m.',
        type: 'string',
        required: true,
        default: '48h0m'
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
