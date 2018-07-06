class ZapierApp {
    constructor(){
        this.version = require('../package.json').version
        this.platformVersion = require('zapier-platform-core').version
        this.beforeRequest = []
        this.afterResponse = []
        this.resources = {}
        this.triggers = {}
        this.searches = {}
        this.creates = {}
    }

    addAuthentication(authObject, addToHeaderFunction){
        this.authentication = authObject
        this.beforeRequest.push(addToHeaderFunction)
    }

    addTrigger(trigger){
        this.triggers[trigger.key] = trigger
    }

    addSearch(search){
        this.searches[search.key] = search
    }

    addAction(action){
        this.creates[action.key] = action
    }
}

module.exports = ZapierApp