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

      // Do a _post_write() from scripting.
      const postWriteEvent = {
        name: 'create.post',
        key: 'voice_text',
        response
      };
      return legacyScriptingRunner.runEvent(postWriteEvent, z, bundle);
    });
};

module.exports = {
  key: 'voice_text',
  noun: 'Voice',

  display: {
    label: 'Send Voice Text to Speech Notification',
    description:
      'Your zap will call a phone number, a speech engine will tell the message based on your text input. Text to speech is available in many different languages, several dialects and genders.',
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
        type: 'integer',
        required: true
      },
      {
        key: 'Language',
        label: 'Language',
        helpText:
          "Please select the language of the voice text. There are 46 languages and dialects available. In case you can't find your prefered language in the drop-down, use Custom Value and try [any other available language](https://docs.cmtelecom.com/voice-api-apps/v2.0#/prerequisites%7Ctext-to-speech) in a similar format in your Zap.",
        type: 'string',
        required: true,
        choices: {
          'en-US;Male;1': 'en-US;Male;1',
          'en-US;Female;3': 'en-US;Female;3',
          'en-GB;Female;1': 'en-GB;Female;1',
          'en-GB;Male;2': 'en-GB;Male;2',
          'es-ES;Female;1': 'es-ES;Female;1',
          'fr-FR;Male;1': 'fr-FR;Male;1',
          'nl-NL;Male;1': 'nl-NL;Male;1'
        }
      },
      {
        key: 'Text',
        label: 'Text',
        helpText: 'Please type the text that you want to convert into the appropriate speech.',
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
