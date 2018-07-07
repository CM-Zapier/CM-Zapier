const ZapierRequest = require("../model/ZapierRequest")

module.exports = (z) => {
	return z.request(new ZapierRequest("https://api.cmtelecom.com/echo/v1.0/producttoken")).then((response) => {
		if (response.status === 401) 
			throw new Error('The Product Token you supplied is invalid')

		return {}
	})
}