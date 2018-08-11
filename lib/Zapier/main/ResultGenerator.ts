import { ZapierField } from "./ZapierFields"
import "../../utils/main/index"

export default class ResultGenerator {
    private outputFields: ZapierField[] = []
    private sample: json = {}

    public add(key: string, name: string, sample: any): this {
        this.outputFields.push(new ZapierField(key, name))
        this.sample[key] = sample
        return this
    }

    public getOutputFields(): json[] {
        return this.outputFields
    }

    public getSample(): json {
        return this.sample
    }
}