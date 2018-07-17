require('json5/lib/register')
const config = require('../config.json5')
const ZapierRequest = require("../model/ZapierRequest")
const errorHandler = require("../ErrorHandlerCM")
const Contact = require("../model/Contact")

const makeRequest = async (z, bundle) => {
    const contact = new Contact()
    contact.setName(bundle.inputData.firstName, bundle.inputData.insertion, bundle.inputData.lastName)
    contact.setEmail(bundle.inputData.email)
    
    const response = await z.request(new ZapierRequest(`https://api.cmtelecom.com/addressbook/v2/accounts/${bundle.inputData.accountID}/groups/${bundle.inputData.groupID}/contacts`, "POST", contact))
    
    errorHandler(response.status, response.content)
    
    return {
        result: "success"
    }
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
                key: "contact_fields",
                label: "Contact Fields",
                children: [
                    {
                        key: "firstName",
                        label: "First name",
                        type: "string",
                        required: true
                    }, {
                        key: "insertion",
                        label: "Insertion",
                        type: "string",
                        required: false
                    }, {
                        key: "lastName",
                        label: "Last name",
                        type: "string",
                        required: true
                    }, {
                        key: "email",
                        label: "Email",
                        type: "string",
                        required: false
                    }
                ]
            }
		],
		outputFields: [
            {
                key: "result",
                label: "Result"
            }
        ],
		perform: makeRequest,
		sample: {
            result: "success"
        }
	}
}