import { buildCheckFunction } from 'express-validator'
import userServices from '../../services/user.services.js'
import { validateResult } from './validation.result.js'

const check = buildCheckFunction(['body', 'query', 'params'])

const validateSignUp = [
    check('firstName', 'Invalid argument for user.firstName field').exists().notEmpty().isString().trim().escape(),
    check('lastName', 'Invalid argument for user.lastName field').exists().notEmpty().isString().trim().escape(),
    check('email', 'Invalid argument for user.email field')
    .exists()
    .notEmpty()
    .normalizeEmail({ all_lowercase: true })
    .isEmail({ blacklisted_chars: ['<', '>', '&', "'", '"', '/'] })
    .custom(async value => {
        if (process.env.NODE_ENV === 'dev') {
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
    check('age', 'Invalid argument for user.age field').exists().notEmpty().isString().trim().escape(),
    check('password', 'Validation error: Please, introduce a valid password. Minimum eight characters, at least one letter and one number')
    .exists().escape().isLength({ min: 8, max: 16 }),
    check('confirmPassword').exists().notEmpty().escape()
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
    check('email', 'Invalid argument for email field').exists().notEmpty()
    .isEmail({ blacklisted_chars: ['<', '>', '&', "'", '"', '/'] })
    .trim().escape(),
    check('password', 'Validation error: Please, introduce a valid password. Minimum eight characters, at least one letter and one number').exists()
    .isLength({ min: 8, max: 16 }),

    (req, res, next) => {
        validateResult(req, res, next)
    }
]

const validateUpdatePassword = [
    check('currentPassword', 'The current password is wrong').exists().escape().isLength({ min: 8, max: 16 }),
    check('newPassword', 'This new password is not allowed').exists().escape().isLength({ min: 8, max: 16 })
    .custom((value, { req }) => {
        if (value === req.body.currentPassword) {
            throw new Error('New password cannot be equal to the old')
        }
        return true
    }),
    check('confirmNewPassword').exists().escape().isLength({ min: 8, max: 16 })
    .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
            throw new Error('NewPasswords and confirmNewPassword do not match')
        }
        return true
    }),

    (req, res, next) => {
        validateResult(req, res, next)
    }
]

export {
  validateSignUp,
  validateLogin,
  validateUpdatePassword
}
