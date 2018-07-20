type httpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

export default class ZapierRequest {
	public body: string | undefined
	public headers: any

	constructor(public url: string, public method: httpMethod = "GET", body: null | object | string = null){
		if(body) this.body = typeof body === "object" ? JSON.stringify(body) : body
		
		if(body && typeof body === "object") this.headers = {
			"Content-Type": "application/json"
		}
	}

	addHeader(key: string, value: string){
		this.headers = this.headers ? this.headers : {}
		this.headers[key] = value
	}
}