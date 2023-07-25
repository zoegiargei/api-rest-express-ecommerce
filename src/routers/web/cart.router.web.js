import { Router } from 'express'
import { handlerShowUserCart } from '../../controllers/web/cart.controllers.web.js'
import { authByRole } from '../../middlewares/api/authentication/auth.role.api.js'
import { authJwtWeb } from '../../middlewares/web/authentication/jwt/auth.byJwt.web.js'

const cartRouter = Router()

cartRouter.get('/userCart', authJwtWeb, authByRole(['Premium', 'User']), handlerShowUserCart)

export default cartRouter
