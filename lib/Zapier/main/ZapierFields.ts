export class ZapierField {
    public constructor(public key: string, public label: string) {}
}

export class ZapierGroup extends ZapierField {
    public constructor(key: string, label: string, public readonly children: (ZapierInputField | object)[] = []){
        super(key, label)
    }

    public add(...child: (ZapierInputField | object)[]){
        this.children.push(child)
    }

    public static get Builder() {
        return class Builder extends ZapierGroup {
            public add(...child: (ZapierInputField | object)[]): this {
                super.add(child)
                return this
            }

            public build(): ZapierGroup {
                return this
            }
        }
    }
}

type ZapierInputType = "string" | "text" | "datetime" | "integer" | "number"

export class ZapierInputField extends ZapierField {
    public choices?: { [key: string]: string }
    public default?: string
    public helpText?: string
    public placeholder?: string
    public list?: boolean
    public altersDynamicFields?: boolean
    public dynamic?: string
    public dict?: boolean
    
    public constructor (key: string, label: string, public type: ZapierInputType = "string", public required: boolean = true) {
        super(key, label)
    }

    public addDropdownItem(key: string, value: string, defaultChoice = false){
        this.choices = this.choices || {}
        this.choices[key] = value
        if(defaultChoice) this.default = key
    }

    public connectDropdownToTrigger(triggerKey: string, param1: string, param2: string){
        this.dynamic = `${triggerKey}.${param1}.${param2}`
    }

    public setDefault(text: string){
        this.default = text
    }

    public setDescription(text: string){
        this.helpText = text
    }

    public setPlaceholder(text: string){
        this.placeholder = text
    }

    public asList(){
        this.list = true
    }

    public modifiesDynamicFields(){
        this.altersDynamicFields = true
    }

    public asKeyValueList(){
        this.dict = true
    }

    static get Builder() {
        return class Builder extends ZapierInputField {
            public connectDropdownToTrigger(triggerKey: string, param1: string, param2: string): this {
                super.connectDropdownToTrigger(triggerKey, param1, param2)
                return this
            }

            public addDropdownItem(key: string, value: string, defaultChoice?: boolean): this {
                super.addDropdownItem(key, value, defaultChoice)
                return this
            }
        
            public setDefault(text: string): this {
                super.setDefault(text)
                return this
            }
        
            public setDescription(text: string): this {
                super.setDescription(text)
                return this
            }
        
            public setPlaceholder(text: string): this {
                super.setPlaceholder(text)
                return this
            }
        
            public asList(): this {
                super.asList()
                return this
            }
        
            public modifiesDynamicFields(): this {
                super.modifiesDynamicFields()
                return this
            }

            public asKeyValueList(): this {
                super.asKeyValueList()
                return this
            }

            public build(): ZapierInputField {
                return this
            }
        }
    }
}