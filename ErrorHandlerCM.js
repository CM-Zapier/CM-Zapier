module.exports = (statusCode, responseBody) => {
    if (statusCode >= 200 && statusCode < 300) return

    let response
    
    try {
        response = JSON.parse(responseBody)
    } catch (error){
        throw new Error("The response we got is incomplete or corrupted. Please check your internet connection and try again later.")
    }
    
    var errorMessages = [] // A list of error messages
    if (response.message !== undefined) { // If the error has a single message.
        errorMessages.push(response.message) // Add the message to the list
    } else if (response.messages !== undefined && response.messages.length > 0) { // If the error has multiple messages in an array.
        errorMessages = response.messages
            .filter((item) => item.messageDetails !== null) // Filter all success messages from the list
            .map((item) => `Message ${response.messages.indexOf(item) + 1} (to "${item.to}"): ${item.messageDetails}` + (item.errorCode ? ` (error code ${item.errorCode} + ")` : "")) // Convert all error messages from json to text.
    }
    
    if (errorMessages.length === 0) { // If no error messages where found, use details and errorCode.
        let msg = ""
        
        if (response.details) msg += response.details
        if (response.errorCode) msg += response.details ? ` (error code: ${response.errorCode})` : `Error with code: ${response.errorCode}`
        
        errorMessages.push(msg)
    }
    
    throw new Error(errorMessages.join("\n"))    
}