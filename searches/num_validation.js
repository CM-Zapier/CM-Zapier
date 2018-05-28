// Search stub created by 'zapier convert'. This is just a stub - you will need to edit!
const _ = require('lodash');
const { replaceVars } = require('../utils');

const getList = (z, bundle) => {
  const scripting = require('../scripting');
  const legacyScriptingRunner = require('zapier-platform-legacy-scripting-runner')(scripting);

  // We're cloning bundle to re-use it when mimicking a "fetch resource" that happened in WB
  const resourceBundle = _.cloneDeep(bundle);

  bundle._legacyUrl = 'https://api.cmtelecom.com/v1.1/numbervalidation/{{Phn_Numb}}';
  bundle._legacyUrl = replaceVars(bundle._legacyUrl, bundle);

  resourceBundle._legacyUrl = 'https://api.cmtelecom.com/v1.1/numberlookup/{{Phn_Numb}}';

  // Do a _pre_search() from scripting.
  const preSearchEvent = {
    name: 'search.pre',
    key: 'num_validation'
  };
  return legacyScriptingRunner
    .runEvent(preSearchEvent, z, bundle)
    .then(preSearchResult => z.request(preSearchResult))
    .then(response => {
      response.throwForStatus();

      // Do a _post_search() from scripting.
      const postSearchEvent = {
        name: 'search.post',
        key: 'num_validation',
        response
      };
      return legacyScriptingRunner.runEvent(postSearchEvent, z, bundle);
    })

    .then(postSearchResult => {
      // Mimick the "fetch resource" that happened in WB
      const results = postSearchResult;

      resourceBundle.results = results;

      const finalUrl = replaceVars(resourceBundle._legacyUrl, resourceBundle, _.get(results, 0));
      return z.request({ url: finalUrl });
    })
    .then(response => {
      response.throwForStatus();

      // Do a _post_read_resource() from scripting.
      const postResourceEvent = {
        name: 'search.resource.post',
        key: 'num_validation',
        response,
        results: resourceBundle.results
      };
      return legacyScriptingRunner.runEvent(postResourceEvent, z, resourceBundle);
    })
    .then(results => {
      // WB would return a single record, but in CLI we expect an array
      if (_.isArray(results)) {
        return results;
      } else {
        return [results];
      }
    });
};

module.exports = {
  key: 'num_validation',
  noun: 'Validation',

  display: {
    label: 'Number Validation',
    description: 'Validate if the format of a phone number is correct and use the feedback in a next step.\n.',
    hidden: false,
    important: false
  },

  operation: {
    inputFields: [
      {
        key: 'Phn_Numb',
        label: 'Phone Number',
        type: 'string',
        required: true
      }
    ],
    outputFields: [
      {
        key: 'Status',
        type: 'string',
        label: 'Status'
      },
      {
        key: 'Status_Code',
        type: 'string',
        label: 'Status_Code'
      }
    ],
    perform: getList,
    sample: { Status: 'Success', Status_Code: 200 }
  }
};
