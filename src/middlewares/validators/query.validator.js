import { buildCheckFunction } from 'express-validator'
import { validateResult } from './validation.result.js'

const check = buildCheckFunction(['query'])

const validateQuery = (query) => {
    // eslint-disable-next-line no-unused-expressions
    [
        check(query).exists().not().isEmpty().trim().escape(),
        (req, res, next) => {
            validateResult(req, res, next, 400)
        }
    ]
}

export {
    validateQuery
}
