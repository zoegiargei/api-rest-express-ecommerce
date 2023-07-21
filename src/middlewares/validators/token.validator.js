import { buildCheckFunction } from 'express-validator'
import { validateResult } from './validation.result.js'

const checkTokens = buildCheckFunction(['query'])
const validateToken = [
    checkTokens('token', 'The token must be in the header').exists(),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

export {
    validateToken
}
