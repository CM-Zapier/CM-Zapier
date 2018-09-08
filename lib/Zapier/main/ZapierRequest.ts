import { zObject, Bundle, HttpMethod } from "zapier-platform-core"
import "../../utils/main/index"
import ZapierHttpRequest from "./ZapierHttpRequest"

export default abstract class ZapierRequest {
    protected abstract url: string
    protected method: HttpMethod = "GET"

    constructor(protected readonly z: zObject, protected readonly bundle: Bundle, private readonly errorHandler: (statusCode: number, responseBody: string) => void = (a, b) => {}){}

    public async startFlow(): Promise<json | any[]> {
        const input = this.createInput()
        const response = await this.makeRequest(input)
        this.errorHandler(response.status, response.content)
        return this.mapOutput(JSON.parse(response.content))
    }

    private async makeRequest(input: any): Promise<json> {
        const httpRequest = new ZapierHttpRequest(this.url, this.method, input)
        return await this.z.request(httpRequest)
    }

    protected abstract createInput(): any

    protected abstract mapOutput(response: json | any[]): json | any[]
}