// "Create" stub created by 'zapier convert'. This is just a stub - you will need to edit!
const { replaceVars } = require('../utils');

const makeRequest = (z, bundle) => {
  const scripting = require('../scripting');
  const legacyScriptingRunner = require('zapier-platform-legacy-scripting-runner')(scripting);

  bundle._legacyUrl = 'https://voiceapi.cmtelecom.com/v2.0/Notification';
  bundle._legacyUrl = replaceVars(bundle._legacyUrl, bundle);

  // Do a _pre_write() from scripting.
  const preWriteEvent = {
    name: 'create.pre',
    key: 'voice_text'
  };
  return legacyScriptingRunner
    .runEvent(preWriteEvent, z, bundle)
    .then(preWriteResult => z.request(preWriteResult))
    .then(response => {
      response.throwForStatus();
      return z.JSON.parse(response.content);
    });
};

module.exports = {
  key: 'voice_text',
  noun: 'Voice',

  display: {
    label: 'Send Voice Text to Speech Notification',
    description: 'Send a new voice text to speech notification.',
    hidden: false,
    important: true
  },

  operation: {
    inputFields: [
      {
        key: 'Callee',
        label: 'To',
        helpText: 'Please provide the recipient number(with country code) to whom you want to send the voice text.',
        type: 'string',
        required: true
      },
      {
        key: 'Caller',
        label: 'From',
        helpText: "Please specify the sender's number (caller).",
        type: 'string',
        required: true
      },
      {
        key: 'Language',
        label: 'Language',
        helpText: 'Please select the language of the voice text.',
        type: 'string',
        required: true,
        choices: {
          'en-AU;Male;1': 'en-AU;Male',
          'en-AU;Female;1': 'en-AU;Female',
          'en-US;Male;2': 'en-US;Male',
          'es-US;Female;5': 'es-US;Female',
          'en-IN;Female;1': 'en-IN;Female'
        }
      },
      {
        key: 'SharedKey',
        label: 'Shared Key',
        helpText: 'Please provide the shared key or secret key that will be given to you by the administrator.',
        type: 'string',
        required: true
      },
      {
        key: 'Text',
        label: 'Text',
        helpText: 'Please type the text that you want to convert into the appropriate speech.',
        type: 'string',
        required: true
      },
      {
        key: 'Username',
        label: 'Username',
        helpText: 'Please provide your username.',
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
