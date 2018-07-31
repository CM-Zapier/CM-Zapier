export class ZapierField {
    public constructor(public key: string, public label: string) {}
}

export class ZapierGroup extends ZapierField {
    public constructor(key: string, label: string, public readonly children: (ZapierInputField | object)[] = []){
        super(key, label)
    }

    public addChild(child: ZapierInputField | object){
        this.children.push(child)
    }

    public static get Builder() {
        return class Builder extends ZapierGroup {
            public addChild(child: ZapierInputField | object): this {
                super.addChild(child)
                return this
            }

            public build(): ZapierGroup {
                return this
            }
        }
    }
}

type ZapierInputType = "string" | "text" | "datetime" | "integer"

export class ZapierInputField extends ZapierField {
    private choices?: { [key: string]: string }
    private default?: string
    private helpText?: string
    private placeholder?: string
    private list?: boolean
    private altersDynamicFields?: boolean
    private dynamic?: string
    
    public constructor (key: string, label: string, private type: ZapierInputType = "string", private required: boolean = true) {
        super(key, label)
    }

    addDropdownItem(key: string, value: string, defaultChoice = false){
        this.choices = this.choices || {}
        this.choices[key] = value
        if(defaultChoice) this.default = value
    }

    connectDropdownToTrigger(triggerKey: string, param1: string, param2: string){
        this.dynamic = `${triggerKey}.${param1}.${param2}`
    }

    setDefault(text: string){
        this.default = text
    }

    setDescription(text: string){
        this.helpText = text
    }

    setPlaceholder(text: string){
        this.placeholder = text
    }

    asList(){
        this.list = true
    }

    modifiesDynamicFields(){
        this.altersDynamicFields = true
    }

    static get Builder() {
        return class Builder extends ZapierInputField {
            connectDropdownToTrigger(triggerKey: string, param1: string, param2: string): this {
                super.connectDropdownToTrigger(triggerKey, param1, param2)
                return this
            }

            addDropdownItem(key: string, value: string, defaultChoice?: boolean): this {
                super.addDropdownItem(key, value, defaultChoice)
                return this
            }
        
            setDefault(text: string): this {
                super.setDefault(text)
                return this
            }
        
            setDescription(text: string): this {
                super.setDescription(text)
                return this
            }
        
            setPlaceholder(text: string): this {
                super.setPlaceholder(text)
                return this
            }
        
            asList(): this {
                super.asList()
                return this
            }
        
            modifiesDynamicFields(): this {
                super.modifiesDynamicFields()
                return this
            }

            build(): ZapierInputField {
                return this
            }
        }
    }
}