import { zObject } from "zapier-platform-core"
import { ZapierInputField } from "../../../lib/Zapier/main/ZapierFields"
import Link from "../../../lib/Zapier/main/Link"
import ZapierHttpRequest from "../../../lib/Zapier/main/ZapierHttpRequest"
import config from "../../../lib/CM/main/config"

const testAuthenticationValidity = async (z: zObject): Promise<object> => {
	const response = await z.request(new ZapierHttpRequest("https://api.cmtelecom.com/echo/v1.0/sso2"))
	
	if (response.status === 401) 
		throw new Error('The Product Token you supplied is invalid')

	return {}
}

const productTokenField = new ZapierInputField("productToken", "Product Token")
	.setDescription(`Enter ${new Link("the product token you got", config.links.productToken)} from CM.`)

export default {
	type: 'custom',
	test: testAuthenticationValidity,
	fields: [ productTokenField ],
	connectionLabel: ''
}