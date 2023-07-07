import { buildCheckFunction } from 'express-validator'
import { validateResult } from './validation.result.js'

const check = buildCheckFunction(['body', 'query', 'params'])

const validateProductFields = [
    check('title').exists().notEmpty().isString().escape(),
    check('description').exists().notEmpty().isString().escape(),
    check('code').exists().notEmpty().trim().escape(),
    check('price').exists().notEmpty().trim().escape(),
    check('status').exists().notEmpty().trim().escape(),
    check('stock').exists().notEmpty().trim().escape().isLength({ min: 1, max: 3 }),
    check('category').exists().notEmpty().escape(),

    (req, res, next) => {
        validateResult(req, res, next)
    }
]

export {
    validateProductFields
}
