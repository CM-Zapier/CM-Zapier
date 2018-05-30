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
  key: 'messages',
  noun: 'Sms',

  display: {
    label: 'Send SMS',
    description: 'Send an SMS to one or multiple people, optionally with different senders and different content.',
    hidden: false,
    important: true
  },

  operation: {
    inputFields: [
      {
        key: 'Body',
        label: 'Body',
        helpText:
          '**Please provide the content of message on behalf of every sender and separate them with || (double pipe) separator**.\n\nFor Example : Content Of Sender Name 1 || Content of Sender Name 2 || Content of Sender Name 3 and so on ...',
        type: 'string',
        required: true,
        placeholder: 'Content 1 || Content 2 || Content 3 and so on ...'
      },
      {
        key: 'From',
        label: 'From',
        helpText:
          "**Please provide multiple sender's name and separate them with || (double pipe) separator**.\n\nFor Example : Sender Name 1 || Sender Name 2 || Sender Name 3 and so on ...",
        type: 'string',
        required: true,
        placeholder: 'Name1 || Name2 || Name3 and so on ...'
      },
      {
        key: 'Reference',
        label: 'Reference',
        helpText:
          '**Please set the reference for each sender and separate them with a || (double pipe) separator**.\n\nFor Example : Reference (Sender Name 1) || Reference (Sender Name 2) || Reference (Sender Name 3) and so on ...',
        type: 'string',
        required: false,
        default: 'None'
      },
      {
        key: 'To',
        label: 'To',
        helpText:
          '**Please provide "To" (recipient number) for each sender and separate them with a || (double pipe) separator**\n\nFor Example : To (Sender Name 1) || To (Sender Name 2) || To (Sender Name 3) and so on ...\n\n**Here each "To" can have multiple recipient numbers which are separated with a comma**\n\nFor Example : +1224589XXXX , +91976056XXXX , +3223576XXXX || +1235467XXXX , +91757956XXXX , +3542576XXXX || +1725355XXXX , +91817143XXXX , +3972156XXXX and so on ...',
        type: 'string',
        required: true,
        placeholder: '+1224589XXXX , +91976056XXXX || +1235467XXXX , +91757956XXXX || +3972156XXXX and so on ...'
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
