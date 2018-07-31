import { zObject, Bundle } from "zapier-platform-core"
import ZapierRequest from "../model/ZapierRequest"
import errorHandler from "../ErrorHandlerCM"
import phoneNumberFormatter from "../phoneNumberFormatter"
import outputFields from "./numberVerifier-outputFields"
import sample from "./numberVerifier-sample"
import config from "../config"

const makeRequest = async (z: zObject, bundle: Bundle): Promise<object[]> => {
    const requestType = bundle.inputData.type
    if(["validation", "lookup"].indexOf(requestType) == -1) 
        throw new Error(`Invalid request type. Was '${requestType}', but expected 'validation' or 'lookup'.`)

    const requestData = {
        phonenumber: phoneNumberFormatter(bundle.inputData.phoneNumber)
    }
    
    const response = await z.request(new ZapierRequest(`https://api.cmtelecom.com/v1.1/number${requestType}`, "POST", requestData))

    let responseObject
    try {
        responseObject = JSON.parse(response.content)
    } catch (error) {
        responseObject = {}
    }
    if(requestType == "lookup" && response.status == 503 && responseObject.message == "Unable to process the request" && Object.keys(responseObject.length == 1))
        throw new Error("Your account doesn't have enough rights to use this feature")
    
    errorHandler(response.status, response.content)

    const result = JSON.parse(response.content)
    result.id = 1
    const type = result.type
    Object.keys(type).forEach((key) => {
        result[key] = type[key]
    })
    delete result.type

    // Zapier users can select data returned here to use in a action, so don't return sensitive data here.
    return [ result ]
}

export default {
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
        sample: sample,
        outputFields: outputFields
    }
}