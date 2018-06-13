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
    key: 'voice_message'
  };
  return legacyScriptingRunner
    .runEvent(preWriteEvent, z, bundle)
    .then(preWriteResult => z.request(preWriteResult))
    .then(response => {
      response.throwForStatus();

      // Do a _post_write() from scripting.
      const postWriteEvent = {
        name: 'create.post',
        key: 'voice_message',
        response
      };
      return legacyScriptingRunner.runEvent(postWriteEvent, z, bundle);
    });
};

module.exports = {
  key: 'voice_message',
  noun: 'Voice',

  display: {
    label: 'Send Voice (Text to Speech) Message',
    description:
      'Your zap will call a phone number, a speech engine will tell the message based on your text input. Text to speech is available in many different languages, several dialects and genders.',
    hidden: false,
    important: true
  },

  operation: {
    inputFields: [
      {
        key: 'from',
        label: 'From',
        helpText: "Please specify the sender's number (caller).",
        type: 'string',
        required: true
      },
      {
        key: 'gender',
        label: 'Gender',
        helpText:
          'Note: not all voices support all genders, look at the list provided in the description above for all voices.',
        type: 'string',
        required: true,
        default: 'Female',
        choices: { Female: 'Female', Male: 'Male' }
      },
      {
        key: 'language',
        label: 'Language',
        helpText:
          "Please select the language of the voice text. There are 46 languages and dialects available. In case you can't find your prefered language in the drop-down, use Custom Value and try [any other available language](https://docs.cmtelecom.com/voice-api-apps/v2.0#/prerequisites%7Ctext-to-speech) in a similar format in your Zap.",
        type: 'string',
        required: true,
        choices: {
          'da-DK': 'da-DK',
          'de-DE': 'de-DE',
          'en-GB': 'en-GB',
          'en-IN': 'en-IN',
          'en-US': 'en-US',
          'es-ES': 'es-ES',
          'es-US': 'es-US',
          'fr-CA': 'fr-CA',
          'fr-FR': 'fr-FR',
          'is-IS': 'is-IS',
          'it-IT': 'it-IT',
          'ja-JP': 'ja-JP',
          'nb-NO': 'nb-NO',
          'nl-NL': 'nl-NL',
          'pl-PL': 'pl-PL',
          'pt-BR': 'pt-BR',
          'pt-PT': 'pt-PT',
          'ro-RO': 'ro-RO',
          'ru-RU': 'ru-RU',
          'sv-SE': 'sv-SE',
          'tr-TR': 'tr-TR'
        }
      },
      {
        key: 'messageContent',
        label: 'Text',
        helpText: 'Please type the text that you want to convert into the appropriate speech.',
        type: 'string',
        required: true
      },
      {
        key: 'to',
        label: 'To',
        helpText: 'Please provide the recipient number (with country code) to whom you want to send the voice text.',
        type: 'string',
        required: true
      },
      {
        key: 'voiceNumber',
        label: 'Number',
        helpText: 'The number of the voice to use.',
        type: 'integer',
        required: true,
        default: '1'
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
