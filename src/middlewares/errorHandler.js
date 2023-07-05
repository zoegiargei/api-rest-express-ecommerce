import multer from 'multer'
import ApiError from '../models/Error/api.error.js'

export function errorHandler (error, req, res, next) {
    console.log(error)
    const type = typeof error
    console.log(type)

    const instance = error instanceof ApiError
    console.log('instance of ApiError?')
    console.log(instance) // Si esto es TRUE tendria que dar de baja un process y levantar otro

    const instance2 = error instanceof TypeError
    console.log('instance of typeError?')
    console.log(instance2)

    const instance3 = error instanceof SyntaxError
    console.log('instance of SyntaxError?')
    console.log(instance3)

    const instance4 = error instanceof RangeError
    console.log('instance of RangeError?')
    console.log(instance4)

    const instance5 = error instanceof Error
    console.log('instance of Error?')
    console.log(instance5)

    const instance6 = error instanceof multer.MulterError
    console.log('instance of Multer error?')
    console.log(instance6)

    const statusCode = error.httpCode ? error.httpCode : 500
    res.status(statusCode).json({ error })
}
