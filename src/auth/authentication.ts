import 'json5/lib/register'
import { zObject } from "zapier-platform-core"
import ZapierRequest from "../model/ZapierRequest"

declare function require(path: string): any
const config = require("../config.json5")

const testAuthenticationValidity = async (z: zObject): Promise<object> => {
	const response = await z.request(new ZapierRequest("https://api.cmtelecom.com/echo/v1.0/sso2"))
	
	if (response.status === 401) 
		throw new Error('The Product Token you supplied is invalid')

	return {}
}

export default {
	type: 'custom',
	
	test: testAuthenticationValidity,
	
	fields: [
		{
			key: 'productToken',
			label: 'Product Token',
			helpText: `Enter [the product token you got](${config.links.productToken}) from CM.`,
			type: 'string',
			required: true,
			placeholder: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX'
		}
	],
	
	connectionLabel: ''
}