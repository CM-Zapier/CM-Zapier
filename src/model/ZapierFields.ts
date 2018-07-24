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
            public addChild(child: ZapierInputField | object): Builder {
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
        this.choices = this.choices ? this.choices : {}
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
            connectDropdownToTrigger(triggerKey: string, param1: string, param2: string): Builder {
                super.connectDropdownToTrigger(triggerKey, param1, param2)
                return this
            }

            addDropdownItem(key: string, value: string, defaultChoice?: boolean): Builder {
                super.addDropdownItem(key, value, defaultChoice)
                return this
            }
        
            setDefault(text: string): Builder {
                super.setDefault(text)
                return this
            }
        
            setDescription(text: string): Builder {
                super.setDescription(text)
                return this
            }
        
            setPlaceholder(text: string): Builder {
                super.setPlaceholder(text)
                return this
            }
        
            asList(): Builder {
                super.asList()
                return this
            }
        
            modifiesDynamicFields(): Builder {
                super.modifiesDynamicFields()
                return this
            }

            build(): ZapierInputField {
                return this
            }
        }
    }
}