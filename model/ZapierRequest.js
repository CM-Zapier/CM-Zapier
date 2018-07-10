class ZapierRequest {
	constructor(url, method = "GET", body = null){
		this.url = url
		this.method = method
		if(body) this.body = typeof body === "object" ? JSON.stringify(body) : body
		if(body && typeof body === "object") this.headers = {
			"Content-Type": "application/json"
		}
	}

	addHeader(key, value){
		this.headers = this.headers ? this.headers : {}

		this.headers[key] = value
	}
}

module.exports = ZapierRequest