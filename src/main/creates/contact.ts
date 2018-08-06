import { zObject, Bundle, HttpMethod } from "zapier-platform-core"
// import ZapierRequest from "../model/ZapierRequest"
import Contact from "../../../lib/CM/main/model/Contact"
import errorHandler from "../../../lib/CM/main/errorHandler"
import outputFields from "./contact-outputFields"
import sample from "./contact-sample"
import config from "../../../lib/CM/main/config"
import "../../../lib/utils/main/index"
import ZapierRequest from "../../../lib/Zapier/main/ZapierRequest"
import ZapierHttpRequest from "../../../lib/Zapier/main/ZapierHTTPRequest"

class ContactRequest extends ZapierRequest {
    protected url: string = `https://api.cmtelecom.com/addressbook/v2/accounts/${this.bundle.inputData.accountID}/groups/${this.bundle.inputData.groupID}/contacts`
    protected method: HttpMethod = "POST"

    constructor(z: zObject, bundle: Bundle){
        super(z, bundle, errorHandler)
    }

    protected createInput(): Contact {
        const contact = new Contact()
        if(this.bundle.inputData.nameType == "full") contact.setFullName(this.bundle.inputData.fullName)
        else contact.setName(this.bundle.inputData.firstName, this.bundle.inputData.insertion, this.bundle.inputData.lastName)
        contact.setEmailAddress(this.bundle.inputData.email)
        contact.setTelephoneNumber(this.bundle.inputData.telephoneNumber)
        contact.setCompany(this.bundle.inputData.company)
     
        const customFields = this.bundle.inputData.customFields || []
        Object.keys(customFields).forEach(key => {
            contact.addCustomField(parseInt(key), customFields[key])
        })
    
        return contact
    }

    protected mapOutput(response: json): json {
        response.fullName = [response.firstName, response.insertion, response.lastName].filter(item => item && item !== "").join(" ")
        response.createdAt = response.createdOnUtc.split(".")[0] + "Z"
        delete response.createdOnUtc
        if(response.customValues){
            (response.customValues as {fieldId: number, value: string}[]).forEach(item => {
                if(item.fieldId === 6) response.company = item.value
                else response[`customField_${item.fieldId - 6}`] = item.value
            })
            delete response.customValues
        }
        return response
    }
}

const makeRequest = (z: zObject, bundle: Bundle) => new ContactRequest(z, bundle).startFlow()

export default {
	key: 'contact',
	noun: 'Contact',
	
	display: {
		label: 'Add Contact to Group',
		description: 'Add a contact to a group on the CM Adressbook.',
		hidden: false,
		important: false
	},
	
	operation: {
		inputFields: [
			{
				key: 'accountID',
				label: 'Account Token',
				helpText: `Your account token. You can find this token in the url when you visit the [CM AdressBook](${config.links.addressbook}), behind the country/language code.`,
				type: 'string',
				required: true,
                placeholder: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
                altersDynamicFields: true
			}, async (z: zObject, bundle: Bundle) => {
                const accountID = bundle.inputData.accountID
                const groupList: { [id: string]: string } = {}
                if(accountID){
                    const response = await z.request(new ZapierHttpRequest(`https://api.cmtelecom.com/addressbook/v2/accounts/${accountID}/groups`))
                    JSON.parse(response.content).forEach((group: any) => {
                        groupList[group.id] = group.name
                    })
                }

                return [{
                    key: 'groupID',
                    label: 'Group',
                    helpText: `The group to add the contact to. Needs the Account Token to show groups. If you don't see any groups, hit the 'Refresh Fields' button on the bottom of this page.`,
                    type: 'string',
                    required: true,
                    choices: groupList
                }]
            }, {
                key: 'nameType',
                label: 'Name Type',
                helpText: 'The type of the name to input.\n\nYou can choose between 3 fields for the first name, insertion and last name (recommended), or 1 field for the entire name.',
                type: 'string',
                required: true,
                default: 'First name, insertion & last name (recommended)',
                choices: { 
                    splitted: 'First name, insertion & last name (recommended)',
                    full: 'Full name only' 
                },
                altersDynamicFields: true
            }, (z: zObject, bundle: Bundle) => {
                const fields = bundle.inputData.nameType == "full" ? [
                    {
                        key: "fullName",
                        label: "Name",
                        type: "string",
                        required: false
                    }
                ] : [
                    {
                        key: "firstName",
                        label: "First name",
                        type: "string",
                        required: false
                    }, {
                        key: "insertion",
                        label: "Insertion",
                        type: "string",
                        required: false
                    }, {
                        key: "lastName",
                        label: "Last name",
                        type: "string",
                        required: false
                    }
                ]

                const childFields = fields.concat([
                    {
                        key: "email",
                        label: "Email",
                        type: "string",
                        required: false
                    }, {
                        key: "telephoneNumber",
                        label: "Phone",
                        helpText: `Must be a [valid phone number (with country code)](${config.links.helpDocs.phoneNumberFormat})`,
                        type: "string",
                        required: false
                    }, {
                        key: "company",
                        label: "Company",
                        type: "string",
                        required: false
                    }, {
                        key: "customFields",
                        label: "Custom fields",
                        helpText: "Enter the custom field number on the left, the content on the right.\n\nNote: custom fields support numbers 1 to 10.",
                        type: "string",
                        required: false, 
                        dict: true
                    }
                ] as any[])

                return [{
                    key: "contact_fields",
                    label: "Contact Fields",
                    children: childFields
                }]
            }
		],
		outputFields: outputFields,
		perform: makeRequest,
		sample: sample
	}
}