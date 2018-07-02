const ZapierRequest = require("model/ZapierRequest")

const testProductTokenValidity = (z) => {
	return z.request(new ZapierRequest("https://api.cmtelecom.com/echo/v1.0/producttoken")).then((response) => {
		if (response.status === 401) 
			throw new Error('The Product Token you supplied is invalid')

		return {}
	})
}

const authentication = {
	type: 'custom',
	
	test: testProductTokenValidity,
	
	fields: [
		{
			key: 'productToken',
			label: 'Product Token',
			helpText: "Enter [the product token you got](https://gateway.cmtelecom.com/) from CM.",
			type: 'string',
			required: true,
			placeholder: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX'
		}
	],
	
	connectionLabel: ''
}

module.exports = authentication