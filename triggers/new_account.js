const getList = (z, bundle) => {
    const zapierRequest = {
        url: "https://api.cmtelecom.com/echo/v1.0/producttoken",
        method: "GET"
    }
    
    return z.request(zapierRequest).then(response => {
        response.throwForStatus();

        return [{
            response: "Success",
            id: 1,
            status_code: 200,
            content: {}
        }];
    });
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
