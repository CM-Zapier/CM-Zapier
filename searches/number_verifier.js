const getList = (z, bundle) => {
    const Zap = require('../scripting');

    const zapierRequestData = Zap.numberVerifier_pre_search({
        auth_fields: bundle.authData,
        search_fields: bundle.inputData
    });

    return z.request({
        method: zapierRequestData.method,
        url: zapierRequestData.url,
        headers: zapierRequestData.headers,
        body: zapierRequestData.data
    }).then(response => {
        const resp = response;
        resp.status_code = response.status;
        const newResponse = Zap.numberVerifier_post_search({
            response: resp
        });
        
        return newResponse;
    });
};

module.exports = {
    key: 'number_verifier',
    noun: 'Validation',
    
    display: {
        label: 'Number Verifier',
        description:
        'Validate if a phone number is valid and use the result (like formatting options, number type, carrier) in a next step. Please make sure your CM.com account has enough rights to use this action.',
        hidden: false,
        important: true
    },
    
    operation: {
        inputFields: [
            {
                key: 'type',
                label: 'Action Type',
                helpText:
                'The type of request to make. LookUp returns the same data as validate, plus some additional data (like roaming information).',
                type: 'string',
                required: true,
                default: 'Validate',
                choices: { numberValidation: 'Validate', numberLookUp: 'LookUp' }
            }, {
                key: 'phoneNumber',
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
            }, {
                key: 'Status_Code',
                type: 'string',
                label: 'Status_Code'
            }
        ],
        perform: getList,
        sample: { 
            Status: 'Success', 
            Status_Code: 200 
        }
    }
};
