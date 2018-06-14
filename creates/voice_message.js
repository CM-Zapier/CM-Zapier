const makeRequest = (z, bundle) => {
    const Zap = require('../scripting');

    const zapierRequestData = Zap.voiceMessage_pre_write({
        auth_fields: bundle.authData,
		action_fields: bundle.inputData
    });

    return z.request({
        method: "POST",
        url: "https://api.cmtelecom.com/voiceapi/v2/Notification",
        headers: zapierRequestData.headers,
        body: zapierRequestData.data
    }).then(response => {
		const resp = response;
        resp.status_code = response.status;
        Zap.voiceMessage_post_write({
            response: resp
        });
        
        return JSON.parse(response.content);
    });
};

module.exports = {
	key: 'voice_message',
	noun: 'Voice',
	
	display: {
		label: 'Send Voice (Text to Speech) Message',
		description: 'Your zap will call a phone number, a speech engine will tell the message based on your text input. Text to speech is available in many different languages, several dialects and genders.',
		hidden: false,
		important: true
	},
	
	operation: {
		inputFields: [
			{
				key: 'from',
				label: 'From',
				helpText: "Please specify the sender's number (caller).",
				type: 'string',
				required: true
			}, {
				key: 'to',
				label: 'To',
				helpText: 'Please provide the recipient number (with country code) to whom you want to send the voice text.',
				type: 'string',
				required: true,
                list: true
			}, {
				key: 'messageContent',
				label: 'Text',
				helpText: 'Please type the text that you want to convert into the appropriate speech.',
				type: 'string',
				required: true
			}, {
				key: 'language',
				label: 'Language',
				helpText: "Please select the language of the voice text. There are 46 languages and dialects available. In case you can't find your prefered language in the drop-down, use Custom Value and try [any other available language](https://docs.cmtelecom.com/voice-api-apps/v2.0#/prerequisites%7Ctext-to-speech) in a similar format in your Zap.",
				type: 'string',
				required: true,
				choices: {
					'da-DK': 'da-DK',
					'de-DE': 'de-DE',
					'en-GB': 'en-GB',
					'en-IN': 'en-IN',
					'en-US': 'en-US',
					'es-ES': 'es-ES',
					'es-US': 'es-US',
					'fr-CA': 'fr-CA',
					'fr-FR': 'fr-FR',
					'is-IS': 'is-IS',
					'it-IT': 'it-IT',
					'ja-JP': 'ja-JP',
					'nb-NO': 'nb-NO',
					'nl-NL': 'nl-NL',
					'pl-PL': 'pl-PL',
					'pt-BR': 'pt-BR',
					'pt-PT': 'pt-PT',
					'ro-RO': 'ro-RO',
					'ru-RU': 'ru-RU',
					'sv-SE': 'sv-SE',
					'tr-TR': 'tr-TR'
				}
			}, {
				key: 'gender',
				label: 'Gender',
				helpText: 'Note: not all voices support all genders, look at the list provided in the description above for all voices.',
				type: 'string',
				required: true,
				default: 'Female',
				choices: { 
					Female: 'Female', 
					Male: 'Male' 
				}
			}, {
				key: 'voiceNumber',
				label: 'Number',
				helpText: 'The number of the voice to use.',
				type: 'integer',
				required: true,
				default: '1'
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
