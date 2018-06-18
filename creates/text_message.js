const makeRequest = (z, bundle) => {
    const Zap = require('../scripting');

    const zapierRequestData = Zap.textMessage_pre_write({
        auth_fields: bundle.authData,
        action_fields: bundle.inputData
    });

    return z.request({
        method: zapierRequestData.method,
        url: zapierRequestData.url,
        headers: zapierRequestData.headers,
        body: zapierRequestData.data
    }).then(response => {
        const resp = response;
        resp.status_code = response.status;
        Zap.textMessage_post_write({
            response: resp
        });
        
        return {
			response: JSON.parse(response.content)
		};
    });
};

module.exports = {
    key: 'text_message',
    noun: 'Message',

    display: {
        label: 'Send Text (SMS/Push) Message',
        description: 'Send a SMS or Push message to one or multiple people.',
        hidden: false,
        important: true
    },

    operation: {
        inputFields: [
            {
                key: 'messageType',
                label: 'Message Type',
                helpText: 'Please select the appropriate channel by which you want to send the message.',
                type: 'string',
                required: true,
                default: 'SMS Only',
                choices: { 
                    sms: 'SMS only', 
                    push_sms: 'Push or SMS', 
                    push: 'Push only' 
                }
            }, {
                key: 'from',
                label: 'From',
                helpText: "Please provide sender's name. The maximum length is 11 alphanumerical characters or 16 digits.",
                type: 'string',
                required: true
            }, {
                key: 'to',
                label: 'To',
                helpText: 'Please provide the recipient numbers (with country code) to whom you want to send the message. You can use the list functionality, or put all your numbers into the first field seperated by a comma.',
                type: 'string',
                required: true,
                placeholder: '+1224589XXXX, +91976056XXXX',
                list: true
            }, {
                key: 'messageContent',
                label: 'Body',
                helpText: 'Please provide the content of message.',
                type: 'string',
                required: true
            }, {
                key: 'validityTime',
                label: 'Validity Time',
                helpText: 'Set the validity time for your message. Minimally 1 minute, maximally 48 hours. Format: 0h0m.',
                type: 'string',
                required: true,
                default: '48h0m'
            }, {
                key: 'reference',
                label: 'Reference',
                helpText: 'Please set the reference.',
                type: 'string',
                required: false,
                default: 'None'
            }, {
                key: 'appKey',
                label: 'Push: App Key',
                helpText: '**This field is required for push messages.**\n\nThe app key will be generated in the [app manager](https://appmanager.cmtelecom.com/).',
                type: 'string',
                required: false,
                placeholder: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX'
            }
        ],
        outputFields: [
            {
                key: 'Status',
                type: 'string'
            }
        ],
        perform: makeRequest,
        sample: { 
            Status: 'Success' 
        }
    }
};
