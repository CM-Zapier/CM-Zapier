import { zObject, Bundle, HttpRequestOptions } from "zapier-platform-core"

export default (request: HttpRequestOptions, z: zObject, bundle: Bundle): HttpRequestOptions => {
    request.headers = request.headers ? request.headers : {}
    request.headers['X-CM-PRODUCTTOKEN'] = bundle.authData.productToken
    return request
}