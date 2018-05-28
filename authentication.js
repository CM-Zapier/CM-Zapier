const testTrigger = require('./triggers/new_account');

const authentication = {
  // TODO: just an example stub - you'll need to complete
  type: 'custom',

  test: testTrigger.operation.perform,

  fields: [
    {
      key: 'productKey',
      label: 'Product Token',
      type: 'string',
      required: true
    },
    {
      key: 'shrdKey',
      label: 'Shared Key',
      helpText: "Only needed if you're using text to speech functionality.",
      type: 'string',
      required: false
    },
    {
      key: 'userN',
      label: 'Username',
      helpText: "Only needed if you're using text to speech functionality.",
      type: 'string',
      required: false
    }
  ],

  // TODO: Set connection label.
  connectionLabel: ''
};

module.exports = authentication;
