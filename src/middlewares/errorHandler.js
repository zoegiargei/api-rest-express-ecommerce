import multer from 'multer'
import ApiError from '../models/Error/api.error.js'

export async function errorHandler (error, req, res, next) {
    let instanceOfError
        if (error instanceof ApiError) {
            instanceOfError = 'ApiError'
        } else if (error instanceof TypeError) {
            instanceOfError = 'TypeError'
        } else if (error instanceof SyntaxError) {
            instanceOfError = 'SyntaxError'
        } else if (error instanceof RangeError) {
            instanceOfError = 'RangeError'
        } else if (error instanceof multer.MulterError) {
            instanceOfError = 'MulterError'
        } else if (error instanceof Error) {
            instanceOfError = 'RangeError'
        }
    req.logger.error(`>>> INSTANCE OF ERROR: ${instanceOfError}`)
    req.logger.error({ status: error.httpCode, details: error.details })
    if (error !== {}) req.logger.error(error)
    const statusCode = error.httpCode ? error.httpCode : 500
    res.status(statusCode).json(error)
}
