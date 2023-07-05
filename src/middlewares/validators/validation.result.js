import { validationResult } from 'express-validator'

export function validateResult (req, res, next, status) {
  try {
    validationResult(req).throw()
    return next()
  } catch (error) {
    next(error)
  }
}
