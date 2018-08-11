export default (statusCode: number, responseBody: string): void => {
    if (statusCode >= 200 && statusCode < 300) return

    let response: any

    try {
        response = JSON.parse(responseBody) as { [name: string]: any }
    } catch (error){
        if(statusCode == 401) throw new Error("Your account doesn't have enough rights to use this feature. Please contact [cmsupport@cm.nl](mailto:cmsupport@cm.nl) to request extra permissions on your account.")
        else throw new Error("The response we got is incomplete or corrupted. Please check your internet connection and try again later.")
    }
    
    var errorMessages: string[] = [] // A list of error messages
    if (response.message) { // If the error has a single message.
        errorMessages.push(response.message) // Add the message to the list
    } else if (response.messages && response.messages.length > 0) { // If the error has multiple messages in an array.
        errorMessages.push(response.messages
            .filter((item: any) => item.messageDetails !== null) // Filter all success messages from the list
            .map((item: any) => `Message ${response.messages.indexOf(item) + 1} (to "${item.to}"): ${item.messageDetails}` + (item.errorCode ? ` (error code ${item.errorCode} + ")` : ""))) // Convert all error messages from json to text.
    }
    
    if (errorMessages.length === 0) { // If no error messages where found, use details and errorCode.
        let msg = ""
        
        if (response.details) msg += response.details
        if (response.errorCode) msg += response.details ? ` (error code: ${response.errorCode})` : `Error with code: ${response.errorCode}`
        
        errorMessages.push(msg)
    }
    
    throw new Error(errorMessages.join("\n"))    
}