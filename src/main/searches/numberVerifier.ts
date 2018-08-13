import { zObject, Bundle, HttpMethod } from "zapier-platform-core"
import ZapierHttpRequest from "../../../lib/Zapier/main/ZapierHttpRequest"
import errorHandler from "../../../lib/CM/main/errorHandler"
import phoneNumberFormatter from "../../../lib/utils/main/phoneNumberFormatter"
import outputFields from "./numberVerifier-outputFields"
import sample from "./numberVerifier-sample"
import config from "../../../lib/CM/main/config"
import ZapierRequest from "../../../lib/Zapier/main/ZapierRequest"

// --- Request to CM API ---

class VoiceLanguageRequest extends ZapierRequest {
    private requestType = this.bundle.inputData.type
    protected url: string = `https://api.cmtelecom.com/voicesendapi/v1.0/tts/languages`
    protected method: HttpMethod = "GET"

    constructor(z: zObject, bundle: Bundle){
        super(z, bundle, (statusCode, responseBody) => {
            let responseObject
            try {
                responseObject = JSON.parse(responseBody)
            } catch (error) {
                responseObject = {}
            }
            if(this.requestType == "lookup" && statusCode == 503 && responseObject.message == "Unable to process the request" && Object.keys(responseObject.length == 1))
                throw new Error("Your account doesn't have enough rights to use this feature")
            
            errorHandler(statusCode, responseBody)
        })
    }

    protected createInput(): json {
        if(["validation", "lookup"].indexOf(this.requestType) == -1) 
            throw new Error(`Invalid request type. Was '${this.requestType}', but expected 'validation' or 'lookup'.`)

        return {
            phonenumber: phoneNumberFormatter(this.bundle.inputData.phoneNumber)
        }
    }

    protected mapOutput(response: json): json[] {
        response.id = 1
        const type = response.type
        Object.keys(type).forEach((key) => {
            response[key] = type[key]
        })
        delete response.type

        // Zapier users can select data returned here to use in a action, so don't return sensitive data here.
        return [ response ]
    }
}

const makeRequest = (z: zObject, bundle: Bundle) => new VoiceLanguageRequest(z, bundle).startFlow()

// --- Export ---

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
                default: 'validation',
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