require('json5/lib/register')
const config = require('../config.json5')
const ZapierRequest = require("../model/ZapierRequest")

const testAuthenticationValidity = async (z) => {
	const response = await z.request(new ZapierRequest("https://api.cmtelecom.com/echo/v1.0/producttoken"))
	
	if (response.status === 401) 
		throw new Error('The Product Token you supplied is invalid')

	return {}
}

module.exports = {
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