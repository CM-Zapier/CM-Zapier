export class ZapierField {
    public constructor(public key: string, public label: string) {}
}

type ZapierInputType = "string" | "text" | "datetime" | "integer" | "number" | "boolean" | "file" | "password" | "copy"

export class ZapierInputField extends ZapierField {
    private choices?: { [key: string]: string }
    private default?: string
    private helpText?: string
    private placeholder?: string
    private list?: boolean
    private altersDynamicFields?: boolean
    private dynamic?: string
    private dict?: boolean
    
    public constructor (key: string, label: string, private type: ZapierInputType = "string", private required: boolean = true) {
        super(key, label)
    }

    public addDropdownItem(key: string, value: string, defaultChoice = false): this {
        this.choices = this.choices || {}
        this.choices[key] = value
        if(defaultChoice) this.default = key
        return this
    }

    public connectDropdownToTrigger(triggerKey: string, param1: string, param2: string): this {
        this.dynamic = `${triggerKey}.${param1}.${param2}`
        return this
    }

    public setDefault(text: string): this {
        this.default = text
        return this
    }

    public setDescription(text: string): this {
        this.helpText = text
        return this
    }

    /* public setPlaceholder(text: string): this {
        this.placeholder = text
        return this
    } */

    public asList(): this {
        this.list = true
        return this
    }

    public modifiesDynamicFields(): this {
        this.altersDynamicFields = true
        return this
    }

    public asKeyValueList(): this {
        this.dict = true
        return this
    }
}