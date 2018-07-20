class ZapierField {
    constructor(key, label) { 
        this.key = key
        this.label = label
    }
}

class ZapierGroup extends ZapierField {
    constructor(key, label, childFields = []){
        super(key, label)
        this.children = childFields
    }

    addChild(child){
        this.children.push(child)
    }

    static get Builder() {
        return class Builder {
            constructor(key, label, childFields = []){
                this._class = new ZapierGroup(key, label, childFields)
            }

            addChild(child){
                this._class.addChild(child)
                return this
            }

            build(){
                return this._class
            }
        }
    }
}

class ZapierInputField extends ZapierField {
    constructor (key, label, type = "string", required = true) {
        super(key, label)
        this.type = type
        this.required = required
    }

    addDropdownItem(key, value, defaultChoice = false){
        this.choices = this.choices ? this.choices : {}
        this.choices[key] = value
        if(defaultChoice) this.default = value
    }

    setDefault(text){
        this.default = text
    }

    setDescription(text){
        this.helpText = text
    }

    setPlaceholder(text){
        this.placeholder = text
    }

    asList(){
        this.list = true
    }

    modifiesDynamicFields(){
        this.altersDynamicFields = true
    }

    static get Builder() {
        return class Builder {
            constructor(key, label, type = "string", required = true){
                this._class = new ZapierInputField(key, label, type, required)
            }

            addDropdownItem(key, value, defaultChoice = false){
                this._class.addDropdownItem(key, value, defaultChoice)
                return this
            }
        
            setDefault(text){
                this._class.setDefault(text)
                return this
            }
        
            setDescription(text){
                this._class.setDescription(text)
                return this
            }
        
            setPlaceholder(text){
                this._class.setPlaceholder(text)
                return this
            }

            asList(){
                this._class.asList()
                return this
            }
        
            modifiesDynamicFields(){
                this._class.modifiesDynamicFields()
                return this
            }

            build(){
                return this._class
            }
        }
    }
}

module.exports = { ZapierField, ZapierGroup, ZapierInputField }