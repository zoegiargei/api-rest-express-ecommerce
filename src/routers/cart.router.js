import { Router } from 'express'
import errors from '../lib/customErrors.js'
import { validateGetById } from '../middlewares/validators/id.validator.js'

const cartRouter = Router()

cartRouter.param('cid', (req, res, next, param) => {
    try {
        if (param === null || param === undefined) throw errors.invalid_input.withDetails('You did not send the USER ID')
        validateGetById(param, req.url)
        next()
    } catch (error) {
        next(error)
    }
})

export default cartRouter
