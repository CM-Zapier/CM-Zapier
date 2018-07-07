const ZapierRequest = require("../model/ZapierRequest")
const TextMessage = require("../model/TextMessage")
const errorHandler = require("../ErrorHandlerCM")

module.exports = (z, bundle) => {
    let toNumbersList = bundle.inputData.to
    toNumbersList = toNumbersList.length == 1 && toNumbersList[0].includes(",") ? toNumbersList[0].split(",") : toNumbersList
    
    const messageObject = new TextMessage(bundle.inputData.from, toNumbersList, bundle.inputData.messageContent)
    
    if(bundle.inputData.messageType.includes("sms")) messageObject.setUseSMS()
    if(bundle.inputData.messageType.includes("push")) messageObject.setUsePush(bundle.inputData.appKey)
    
    if(bundle.inputData.reference) messageObject.reference = bundle.inputData.reference.trim()
    
    const requestData = {
        Messages: {
            Authentication: {
                ProductToken: bundle.authData.productToken
            },
            Msg: [messageObject]
        }
    }
    
    return z.request(new ZapierRequest("https://gw.cmtelecom.com/v1.0/message", "POST", requestData)).then(response => {
        errorHandler(response.status, response.content)
    
        return {
            response: JSON.parse(response.content)
        }
    })
}