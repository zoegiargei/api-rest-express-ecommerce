import { Router } from 'express'
import { handlerShowUserCart } from '../../controllers/web/cart.controllers.js'
import { authJwtWeb } from '../../middlewares/web/authentication/jwt/auth.byJwt.web.js'

const cartRouter = Router()

cartRouter.get('/userCart', authJwtWeb, handlerShowUserCart)

export default cartRouter
