import { HttpMethod, HttpRequestOptions } from "zapier-platform-core"

export default class ZapierRequest implements HttpRequestOptions {
	public readonly body?: string
	public headers?: { [name: string]: string }

	public constructor(public url: string, public method: HttpMethod = "GET", body?: object | string){
		if(body) this.body = typeof body === "object" ? JSON.stringify(body) : body
		
		if(body && typeof body === "object") this.headers = {
			"Content-Type": "application/json"
		}
	}

	public addHeader(key: string, value: string){
		this.headers = this.headers ? this.headers : {}
		this.headers[key] = value
	}
}