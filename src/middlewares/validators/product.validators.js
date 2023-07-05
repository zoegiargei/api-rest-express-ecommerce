import { buildCheckFunction } from 'express-validator'
import { validateResult } from './validation.result.js'

const check = buildCheckFunction(['body', 'query', 'params'])

const validateGeneralSearch = [
    check('limit').escape(),
    (req, res, next) => {
        validateResult(req, res, next, 400)
    }
]

const validateQueryParams = (req) => {
    // eslint-disable-next-line no-unused-expressions
    [
        check(req.query).exists().not().isEmpty().escape(),
        (req, res, next) => {
            validateResult(req, res, next, 400)
        }
    ]
}

export {
  validateGeneralSearch,
  validateQueryParams
}
