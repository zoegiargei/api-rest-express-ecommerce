import { buildCheckFunction } from 'express-validator'
import config from '../../../config.js'
import userServices from '../../services/user.services.js'
import { validateResult } from './validation.result.js'

const check = buildCheckFunction(['body', 'query', 'params'])

const validateSignUp = [
    check('firstName').exists().notEmpty().isString().trim().escape(),
    check('lastName').exists().notEmpty().isString().trim().escape(),
    check('email')
    .exists()
    .notEmpty()
    .normalizeEmail({ all_lowercase: true })
    .isEmail({ blacklisted_chars: ['<', '>', '&', "'", '"', '/'] })
    .custom(async value => {
        if (config.NODE_ENV === 'dev') {
            const users = await userServices.getUsers()
            if (users.find(u => u.email === value)) {
                throw new Error('Email already exist')
            } else {
                return true
            }
        } else {
            const user = await userServices.getUserByQuery({ email: value })
            if (user.length > 0) throw new Error('Email already exist')
            return true
        }
    })
    .trim()
    .escape(),
    check('age').exists().notEmpty().isString().trim().escape(),
    check('password', 'Validation error: Please, introduce a valid password. Minimum eight characters, at least one letter and one number').exists()
    .isLength({ min: 8, max: 16 }),
    check('confirmPassword').exists().notEmpty()
    .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match')
        }
        return true
    }),

    (req, res, next) => {
        validateResult(req, res, next)
    }
]

const validateLogin = [
    check('email').exists().notEmpty().normalizeEmail({ all_lowercase: true })
    .isEmail({ blacklisted_chars: ['<', '>', '&', "'", '"', '/'] })
    .trim().escape(),
    check('password', 'Validation error: Please, introduce a valid password. Minimum eight characters, at least one letter and one number').exists()
    .isLength({ min: 8, max: 16 }),

    (req, res, next) => {
        validateResult(req, res, next)
    }
]

export {
  validateSignUp,
  validateLogin
}
