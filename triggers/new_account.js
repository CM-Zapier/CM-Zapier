// Trigger stub created by 'zapier convert'. This is just a stub - you will need to edit!
const { replaceVars } = require('../utils');

const getList = (z, bundle) => {
  let url = 'https://api.cmtelecom.com/echo/v1.0/producttoken';
  url = replaceVars(url, bundle);

  const responsePromise = z.request({ url });
  return responsePromise.then(response => {
    response.throwForStatus();
    return z.JSON.parse(response.content);
  });
};

module.exports = {
  key: 'new_account',
  noun: 'Account',

  display: {
    label: 'New Account',
    description: 'Triggers when a new account is added.',
    hidden: true,
    important: false
  },

  operation: {
    inputFields: [],
    outputFields: [
      {
        key: 'Status',
        type: 'string'
      }
    ],
    perform: getList,
    sample: { Status: 'Success' }
  }
};
