module.exports = (request, z, bundle) => {
    request.headers = request.headers ? request.headers : {}
    request.headers['X-CM-PRODUCTTOKEN'] = bundle.authData.productToken
    return request
}