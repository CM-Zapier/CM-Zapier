const getList = (z, bundle) => {
    // Enable when product token for voice & sms is the same.
    /* const zapierRequest = {
        url: "https://api.cmtelecom.com/echo/v1.0/producttoken",
        body: {
            // TODO
        }
    }
    
    return z.request(zapierRequest).then(response => {
        response.throwForStatus();
        return JSON.parse(response.content);
    }); */
    
    return {
        status: 200,
        content: {
            Status: "Success"
        }
    };
};

module.exports = {
    key: 'new_account',
    noun: 'Account',
    
    display: {
        label: 'New Account',
        description: 'Triggers when a new account is added.',
        hidden: true,
        important: false
    },
    
    operation: {
        inputFields: [],
        outputFields: [
            {
                key: 'Status',
                type: 'string'
            }
        ],
        perform: getList,
        sample: { Status: 'Success' }
    }
};
