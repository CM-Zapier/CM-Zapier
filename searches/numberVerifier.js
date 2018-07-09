require('json5/lib/register')
const ZapierRequest = require("../model/ZapierRequest")
const errorHandler = require("../ErrorHandlerCM")

const makeRequest = async (z, bundle) => {
    const requestType = bundle.inputData.type
    if(!["validation", "lookup"].includes(requestType)) 
        throw new Error(`Invalid request type. Was '${requestType}', but expected 'validation' or 'lookup'.`)

    const phoneNumber = bundle.inputData.phoneNumber
    if (!phoneNumber.matches(/(|\+)[0-9]+/) || phoneNumber.matches(/[A-z]+/))
        throw new Error("The specified phone number is not a valid phone number, it contains invalid characters")
    
    const response = await z.request(new ZapierRequest(`https://api.cmtelecom.com/v1.1/number${requestType}`, "POST", { phonenumber: phoneNumber }))
    
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
                helpText: "The phone number where you want to get the information of.\n\nNote: [The phone number must include the country code](https://help.cmtelecom.com/en/supporting-apps/address-book/what-is-the-right-phone-number-format).",
                type: 'string',
                required: true
            }      
        ],
        perform: makeRequest,
        sample: require("./numberVerifier-sample.json5"),
        outputFields: require("./numberVerifier-outputFields.json5")
    }
}