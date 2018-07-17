require('json5/lib/register')
const config = require('../config.json5')
const ZapierRequest = require("../model/ZapierRequest")
const errorHandler = require("../ErrorHandlerCM")

const makeRequest = async (z, bundle) => {
    /* let toNumbersList = bundle.inputData.to
    toNumbersList = toNumbersList.length == 1 && toNumbersList[0].includes(",") ? toNumbersList[0].split(",") : toNumbersList
    
    const voice = new Voice(bundle.inputData.language, bundle.inputData.gender, bundle.inputData.number)
    const voiceMessage = new VoiceMessage(bundle.inputData.from, toNumbersList, bundle.inputData.messageContent, voice)
    
    const response = await z.request(new ZapierRequest("https://api.cmtelecom.com/voiceapi/v2/Notification", "POST", voiceMessage))
    
    errorHandler(response.status, response.content)
    
    return {
        result: "success"
    } */
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
				helpText: `Your account token. You can find this token in the url when you visit the [CM AdressBook](https://addressbook.cmtelecom.com/) behind the country code.`,
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