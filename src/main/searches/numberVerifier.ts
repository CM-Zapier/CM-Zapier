// Zapier
import { zObject, Bundle, HttpMethod } from "zapier-platform-core"

// Zapier lib
import Link from "../../../lib/Zapier/main/Link"
import ResultGenerator from "../../../lib/Zapier/main/ResultGenerator"
import { ZapierInputField } from "../../../lib/Zapier/main/ZapierFields"
import ZapierRequest from "../../../lib/Zapier/main/ZapierRequest"

// CM lib
import config from "../../../lib/CM/main/config"
import errorHandler from "../../../lib/CM/main/errorHandler"

// Other
import phoneNumberFormatter from "../../../lib/utils/main/phoneNumberFormatter"

// --- Request to CM API ---

class NumberVerifierRequest extends ZapierRequest {
    private requestType = this.bundle.inputData.type
    protected url: string = `https://api.cmtelecom.com/v1.1/number${this.requestType}`
    protected method: HttpMethod = "POST"

    constructor(z: zObject, bundle: Bundle){
        super(z, bundle, (statusCode, responseBody) => {
            let responseObject: json = {}
            try {
                responseObject = JSON.parse(responseBody)
            } catch (error) {
                try {
                    responseObject = JSON.parse(responseBody.substring(responseBody.indexOf("{")))
                } catch (error) {}
            }

            if(this.requestType == "lookup" && statusCode == 503 && responseObject.message == "Unable to process the request" && Object.keys(responseObject).length == 1)
                throw new Error("Your account doesn't have enough rights to use this feature. Please contact cmsupport@cm.nl to request extra permissions on your account.")
            else if (responseObject.message && !responseObject.valid_number)
                throw new Error(responseObject.message)
            
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

// --- Inputfields ---

const type = new ZapierInputField("type", "Request Type")
    .setDescription(`The type of request to make.\n\nLookUp returns the same data as validate, plus some additional data (like roaming information).\nLookUp can cost more depending by country.`)
    .addDropdownItem("validation", "Validate", true)
    .addDropdownItem("lookup", "LookUp")

const phoneNumber = new ZapierInputField("phoneNumber", "Phone Number")
    .setDescription(`The phone number where you want to get the information of.\n\nNote: ${new Link("The phone number must include the country code", config.links.helpDocs.phoneNumberFormat)}.`)

// --- OutputFields & Sample ---

const result = new ResultGenerator()
    .add('id', 'ID', 1)
    .add('carrier', 'Carrier', "Lycamobile")
    .add('country_code', 'Country code', 31)
    .add('country_iso', 'Country (ISO)', "NL")
    .add('format_e164', 'Format (E164)', "+31687654321")
    .add('format_international', 'Format (international)', "+31 6 87654321")
    .add('format_national', 'Format (national)', "06 87654321")
    .add('region', 'Region', "Netherlands")
    .add('region_code', 'Region code', "NL")
    .add('timezone', 'Timezone', ["Europe/Amsterdam"])
    .add('mobile', 'Is mobile', true)
    .add('fixed_line', 'Is fixed line', false)
    .add('fixed_line_or_mobile', 'Is fixed line or mobile', false)
    .add('voip', 'VoIP', false)
    .add('toll_free', 'Is toll free', false)
    .add('premium_rate', 'Has premium rate', false)
    .add('standard_rate', 'Has standard rate', false)
    .add('shared_cost', 'Shared cost', false)
    .add('personal', 'Is personal', false)
    .add('pager', 'Pager', false)
    .add('voicemail', 'Voicemail', false)
    .add('shortcode', 'Shortcode', false)
    .add('emergency', 'Is emergency number', false)
    .add('unknown', 'Is unknown', false)
    .add('valid_number', 'Is a valid number', true)

// --- Export ---

export default {
    key: 'numberVerifier',
    noun: 'Verification',
    
    display: {
        label: 'Lookup or Validate Phone Number',
        description: 'Searches for information (like formatting options, number type or carrier) of a phone number.',
        hidden: false,
        important: true
    },
    
    operation: {
        inputFields: [ type, phoneNumber ],
        outputFields: result.getOutputFields(),
		sample: result.getSample(),
        perform: (z: zObject, bundle: Bundle) => new NumberVerifierRequest(z, bundle).startFlow()
    }
}