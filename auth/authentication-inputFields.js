module.exports = {
	type: 'custom',
	
	test: require('./authentication-request.js'),
	
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