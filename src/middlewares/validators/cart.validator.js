import { buildCheckFunction } from 'express-validator'
import { validateResult } from './validation.result.js'

const check = buildCheckFunction(['body', 'query', 'params'])

const validateQuantity = [
    check('quantity', 'Invalid argument for quantity field').exists().notEmpty().escape()
    .custom(v => {
        const re = /^(?:[1-9]|[1-9][0-9])$/
        return re.test(v)
    }),
    (req, res, next) => {
        validateResult(req, res, next)
    }
]

export {
    validateQuantity
}
