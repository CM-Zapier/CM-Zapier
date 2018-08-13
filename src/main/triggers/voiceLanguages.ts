import { zObject, Bundle, HttpMethod } from "zapier-platform-core"
import errorHandler from "../../../lib/CM/main/errorHandler"
import ZapierRequest from "../../../lib/Zapier/main/ZapierRequest"

// --- Request to CM API ---

class VoiceLanguageRequest extends ZapierRequest {
    protected url: string = `https://api.cmtelecom.com/voicesendapi/v1.0/tts/languages`

    constructor(z: zObject, bundle: Bundle){
        super(z, bundle, errorHandler)
    }

    protected createInput(): undefined {
        return undefined
    }

    protected mapOutput(response: json): {id: string, name: string}[] {
        const languageList = Object.keys(response).map(key => {
            return {
                id: key, 
                name: response[key]
            }
        }).sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)
        return languageList
    }
}

const fetchList = (z: zObject, bundle: Bundle) => new VoiceLanguageRequest(z, bundle).startFlow()

// --- Export ---

export default {
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