import { buildCheckFunction } from 'express-validator'
import { validateResult } from './validation.result.js'

const check = buildCheckFunction(['query', 'params'])

const validateGetById = (id) => {
    // eslint-disable-next-line no-unused-expressions
    [
        check(id, 'Bad request. Insert an id.').exists().not().isEmpty().escape(),
        (req, res, next) => {
            validateResult(req, res, next, 400)
        }
    ]
}

export {
    validateGetById
}
