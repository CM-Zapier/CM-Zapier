require('json5/lib/register')
const config = require('../config.json5')
const ZapierRequest = require("../model/ZapierRequest")
const errorHandler = require("../ErrorHandlerCM")
const phoneNumberFormatter = require("../phoneNumberFormatter")

const makeRequest = async (z, bundle) => {
    const requestType = bundle.inputData.type
    if(!["validation", "lookup"].includes(requestType)) 
        throw new Error(`Invalid request type. Was '${requestType}', but expected 'validation' or 'lookup'.`)

    const requestData = {
        phonenumber: phoneNumberFormatter(bundle.inputData.phoneNumber)
    }
    
    const response = await z.request(new ZapierRequest(`https://api.cmtelecom.com/v1.1/number${requestType}`, "POST", requestData))
    
    errorHandler(response.status, response.content)

    const result = JSON.parse(response.content)
    result.id = 1

    // Zapier users can select data returned here to use in a action, so don't return sensitive data here.
    return [ result ]
}

module.exports = {
    key: 'numberVerifier',
    noun: 'Verification',
    
    display: {
        label: 'Number Verifier',
        description: 'Validate if a phone number is valid and use the result (like formatting options, number type, carrier) in a next step. Please make sure your CM.com account has enough rights to use this action.',
        hidden: false,
        important: true
    },
    
    operation: {
        inputFields: [
            {
                key: 'type',
                label: 'Request Type',
                helpText: 'The type of request to make.\n\nLookUp returns the same data as validate, plus some additional data (like roaming information).\nLookUp can cost more depending by country.',
                type: 'string',
                required: true,
                default: 'Validate',
                choices: { 
                    validation: 'Validate', 
                    lookup: 'LookUp' 
                }
            }, {
                key: 'phoneNumber',
                label: 'Phone Number',
                helpText: `The phone number where you want to get the information of.\n\nNote: [The phone number must include the country code](${config.links.helpDocs.phoneNumberFormat}).`,
                type: 'string',
                required: true
            }      
        ],
        perform: makeRequest,
        sample: require("./numberVerifier-sample.json5"),
        outputFields: require("./numberVerifier-outputFields.json5")
    }
}