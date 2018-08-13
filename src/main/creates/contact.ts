import { zObject, Bundle, HttpMethod } from "zapier-platform-core"
import Contact from "../../../lib/CM/main/model/Contact"
import errorHandler from "../../../lib/CM/main/errorHandler"
import config from "../../../lib/CM/main/config"
import ZapierRequest from "../../../lib/Zapier/main/ZapierRequest"
import ZapierHttpRequest from "../../../lib/Zapier/main/ZapierHTTPRequest"
import ResultGenerator from "../../../lib/Zapier/main/ResultGenerator"
import { ZapierGroup, ZapierInputField } from "../../../lib/Zapier/main/ZapierFields"
import Link from "../../../lib/Zapier/main/Link"
import "../../../lib/utils/main/index"

// --- Request to CM API ---

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

// --- Inputfields ---

const accountID = new ZapierInputField.Builder("accountID", "Account Token")
    .setDescription(`Your account token. You can find this token in the url when you visit the ${new Link("CM AdressBook", config.links.addressbook)}, behind the country/language code.`)
    .setPlaceholder(`XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX`)
    .modifiesDynamicFields()
    .build()

const groupID = async (z: zObject, bundle: Bundle) => {
    const accountID = bundle.inputData.accountID

    const groupField = new ZapierInputField.Builder("groupID", "Group")
        .setDescription(`The group to add the contact to. Needs the Account Token to show groups. If you don't see any groups, hit the 'Refresh Fields' button on the bottom of this page.`)
    
    if(accountID){
        const response = await z.request(new ZapierHttpRequest(`https://api.cmtelecom.com/addressbook/v2/accounts/${accountID}/groups`))
        const responseContent = JSON.parse(response.content) as json[]
        const groupList: { id: string, name: string }[] = responseContent.map(group => {
            return {
                id: group.id, 
                name: group.name
            }
        }).sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)

        groupList.forEach(it => groupField.addDropdownItem(it.id, it.name))
    }

    return [ groupField.build() ]
}

const nameType = new ZapierInputField.Builder("nameType", "Name Type")
    .setDescription(`The type of the name to input.\n\nYou can choose between 3 fields for the first name, insertion and last name (recommended), or 1 field for the entire name.`)
    .addDropdownItem("splitted", "First name, insertion & last name (recommended)", true)
    .addDropdownItem("full", "Full name only")
    .modifiesDynamicFields()
    .build()

const contactFields = (z: zObject, bundle: Bundle) => {
    const fullName = new ZapierInputField.Builder("fullName", "Name", undefined, false).build()

    const firstName = new ZapierInputField.Builder("firstName", "First name", undefined, false).build()
    const insertion = new ZapierInputField.Builder("insertion", "Insertion", undefined, false).build()
    const lastName = new ZapierInputField.Builder("lastName", "Last name", undefined, false).build()
    
    const contactField = new ZapierGroup.Builder("contact_fields", "Contact Fields", bundle.inputData.nameType == "full" ? [ fullName ] : [ firstName, insertion, lastName ])

    const email = new ZapierInputField.Builder("email", "Email", undefined, false).build()
    const telephoneNumber = new ZapierInputField.Builder("telephoneNumber", "Phone", undefined, false)
        .setDescription(`Must be a ${new Link("valid phone number (with country code)", config.links.helpDocs.phoneNumberFormat)}`)
        .build()
    const company = new ZapierInputField.Builder("company", "Company", undefined, false).build()
    const customFields = new ZapierInputField.Builder("customFields", "Custom fields", undefined, false)
        .setDescription(`Enter the custom field number on the left, the content on the right.\n\nNote: custom fields support numbers 1 to 10.`)
        .asKeyValueList()
        .build()

    return [ contactField.add(email).add(telephoneNumber).add(company).add(customFields).build() ]
}

// --- OutputFields & Sample ---

const result = new ResultGenerator()
    .add("createdAt", "Created at", "2018-07-12T13:37:38Z")
    .add("email", "Email", "john.doe@example.com")
    .add("firstName", "First name", "John")
    .add("insertion", "insertion", "test")
    .add("lastName", "Last name", "Doe")
    .add("fullName", "Full name", "John test Doe")
    .add("phoneCountry", "Phone number (country code)", "NL")
    .add("phoneNumber", "Phone number", "+31612345678")
    .add("id", "ID", "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX")
    .add("groupId", "Group ID", "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX")

// --- Export ---

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
		inputFields: [ accountID, groupID, nameType, contactFields ],
		outputFields: result.getOutputFields(),
		perform: makeRequest,
		sample: result.getSample()
	}
}