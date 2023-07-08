import { buildCheckFunction } from 'express-validator'
import { validateResult } from './validation.result.js'

const check = buildCheckFunction(['query', 'params'])

const validateGetById = (id, path) => {
    // eslint-disable-next-line no-unused-expressions
    [
        check(id, `Bad request, path ${path} requires an id`).exists().not().isEmpty().trim().escape(),
        (req, res, next) => {
            validateResult(req, res, next, 400)
        }
    ]
}

export {
    validateGetById
}
