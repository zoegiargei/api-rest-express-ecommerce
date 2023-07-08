import { buildCheckFunction } from 'express-validator'
import { validateResult } from './validation.result.js'

const check = buildCheckFunction(['body', 'query', 'params'])

const validateProductFields = [
    check('title', 'Invalid argument for product.title field').exists().notEmpty().isString().escape(),
    check('description', 'Invalid argument for product.description field').exists().notEmpty().isString().escape(),
    check('code', 'Invalid argument for product.code field').exists().notEmpty().trim().escape(),
    check('price', 'Invalid argument for product.price field').exists().notEmpty().trim().escape(),
    check('status', 'Invalid argument for product.status field').exists().notEmpty().trim().escape(),
    check('stock', 'Invalid argument for product.stock field').exists().notEmpty().trim().escape().isLength({ min: 1, max: 3 }),
    check('category', 'Invalid argument for product.category field').exists().notEmpty().escape(),

    (req, res, next) => {
        validateResult(req, res, next)
    }
]

export {
    validateProductFields
}
