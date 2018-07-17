const ZapierRequest = require("../model/ZapierRequest")
const errorHandler = require("../ErrorHandlerCM")

const fetchList = async (z, bundle) => {
    const response = await z.request(new ZapierRequest("https://api.cmtelecom.com/voicesendapi/v1.0/tts/languages"))
    errorHandler(response.status, response.content)
    const responseContent = JSON.parse(response.content)
    const languageList = Object.keys(responseContent).map(key => {
        return {
            id: key, 
            name: responseContent[key]
        }
    }).sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)
    return languageList
}

module.exports = {
    key: "voiceLanguages",
    noun: "Languages",
    display: {
        label: "List of Voice Languages",
        description: "This is a hidden trigger, and is used in a Dynamic Dropdown within this app.",
        hidden: true
    },
    
    operation: {
        perform: fetchList,
        canPaginate: false
    }
}