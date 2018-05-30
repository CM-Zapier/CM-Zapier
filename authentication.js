const testTrigger = require('./triggers/new_account');

const authentication = {
  // TODO: just an example stub - you'll need to complete
  type: 'custom',

  test: testTrigger.operation.perform,

  fields: [
    {
      key: 'productToken_text',
      label: 'Product Token (Text)',
      helpText: "You **must** enter this field if you're going to use message functionality.",
      type: 'string',
      required: false
    },
    {
      key: 'productToken_voice',
      label: 'Product Token (Voice)',
      helpText: "You **must** enter this field if you're going to use voice functionality.",
      type: 'string',
      required: false
    },
    {
      key: 'shrdKey',
      label: 'Shared Key (Voice, Old)',
      helpText: "Only needed if you're using text to speech functionality.",
      type: 'string',
      required: false
    },
    {
      key: 'userN',
      label: 'Username (Voice, Old)',
      helpText: "Only needed if you're using text to speech functionality.",
      type: 'string',
      required: false
    }
  ],

  connectionLabel: ''
};

module.exports = authentication;
