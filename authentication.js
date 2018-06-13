const testTrigger = require('./triggers/new_account');

const authentication = {
	type: 'custom',
	
	test: testTrigger.operation.perform,
	
	fields: [
		{
			key: 'productToken',
			label: 'Product Token',
			helpText: "You **must** enter this field if you're going to use message functionality.",
			type: 'string',
			required: true,
			placeholder: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX'
		}, {
			key: 'userName',
			label: 'Username (Voice)',
			helpText: "Only needed if you're using text to speech functionality.",
			type: 'string',
			required: false
		}, {
			key: 'sharedKey',
			label: 'Shared Key (Voice)',
			helpText: "Only needed if you're using text to speech functionality.",
			type: 'string',
			required: false
		}
	],
	
	connectionLabel: ''
};

module.exports = authentication;
