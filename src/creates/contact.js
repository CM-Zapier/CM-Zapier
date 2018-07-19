require('json5/lib/register')
const config = require('../config.json5')

const ZapierRequest = require("../model/ZapierRequest")
const errorHandler = require("../ErrorHandlerCM")
const Contact = require("../model/Contact")

const makeRequest = async (z, bundle) => {
    const contact = new Contact()
    if(bundle.inputData.nameType == "full") contact.setFullName(bundle.inputData.fullName)
    else contact.setName(bundle.inputData.firstName, bundle.inputData.insertion, bundle.inputData.lastName)
    contact.setEmail(bundle.inputData.email)
    contact.setTelephoneNumber(bundle.inputData.telephoneNumber)
    contact.setCompany(bundle.inputData.company)
 
    const customFields = bundle.inputData.customFields || []
    Object.keys(customFields).forEach(key => {
        contact.addCustomField(parseInt(key), customFields[key])
    })
    
    const response = await z.request(new ZapierRequest(`https://api.cmtelecom.com/addressbook/v2/accounts/${bundle.inputData.accountID}/groups/${bundle.inputData.groupID}/contacts`, "POST", contact))
    
    errorHandler(response.status, response.content)

    const responseContent = JSON.parse(response.content)
    responseContent.fullName = [responseContent.firstName, responseContent.insertion, responseContent.lastName].filter(item => item && item !== "").join(" ")
    responseContent.createdAt = responseContent.createdOnUtc.split(".")[0] + "Z"
    delete responseContent.createdOnUtc
    if(responseContent.customValues){
        responseContent.customValues.forEach(item => {
            if(item.fieldId === 6) responseContent.company = item.value
            else responseContent[`customField${item.fieldId - 6}`] = item.value
        })
        //delete responseContent.customValues
    }
    
    return responseContent
}

module.exports = {
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
			}, async (z, bundle) => {
                const accountID = bundle.inputData.accountID
                const groupList = {}
                if(accountID){
                    const response = await z.request(new ZapierRequest(`https://api.cmtelecom.com/addressbook/v2/accounts/${accountID}/groups`))
                    JSON.parse(response.content).forEach(group => {
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
            }, (z, bundle) => {
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
                ])

                return [{
                    key: "contact_fields",
                    label: "Contact Fields",
                    children: childFields
                }]
            }
		],
		outputFields: require("./contact-outputFields.json5"),
		perform: makeRequest,
		sample: require("./contact-sample.json5")
	}
}