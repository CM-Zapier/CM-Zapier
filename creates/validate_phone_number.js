// "Create" stub created by 'zapier convert'. This is just a stub - you will need to edit!
const { replaceVars } = require('../utils');

const makeRequest = (z, bundle) => {
  const scripting = require('../scripting');
  const legacyScriptingRunner = require('zapier-platform-legacy-scripting-runner')(scripting);

  bundle._legacyUrl = 'https://api.cmtelecom.com/v1.1/numbervalidation';
  bundle._legacyUrl = replaceVars(bundle._legacyUrl, bundle);

  // Do a _pre_write() from scripting.
  const preWriteEvent = {
    name: 'create.pre',
    key: 'validate_phone_number'
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
  key: 'validate_phone_number',
  noun: 'Validate',

  display: {
    label: 'Validate a Phone Number',
    description: 'Validate any phone number.',
    hidden: false,
    important: true
  },

  operation: {
    inputFields: [
      {
        key: 'PhoneNumber',
        label: 'Phone Number',
        helpText: 'Enter the phone number(with country code) that you want to validate.',
        type: 'string',
        required: true
      },
      {
        key: 'XCMProductToken',
        label: 'X-Cm-Product Token',
        helpText:
          'Please provide the product token that was emailed to you after registration.You can also get the product token inside cm telecom in "Messaging Gateway" option.',
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
