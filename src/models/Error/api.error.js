class ApiError extends Error {
    constructor (httpCode, type, message) {
        super(message)
        this.httpCode = httpCode
        this.type = type
        this.message = message
        this.details = null
    }

    withDetails (details) {
        this.details = details
        return this
    }
}
export default ApiError
