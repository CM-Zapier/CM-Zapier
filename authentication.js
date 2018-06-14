const testTrigger = require('./triggers/new_account');

const authentication = {
	type: 'custom',
	
	test: testTrigger.operation.perform,
	
	fields: [
		{
			key: 'productToken',
			label: 'Product Token',
			helpText: "Enter the product token you got from CM.",
			type: 'string',
			required: true,
			placeholder: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX'
		}
	],
	
	connectionLabel: ''
};

module.exports = authentication;
