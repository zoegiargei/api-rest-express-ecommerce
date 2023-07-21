import { Router } from 'express'
import { handlerAddProductToCart, handlerCleanCart, handlerDeleteCart, handlerDelProdInCart, handlerGetCart, handlerPurchase, handlerPutProductsCart } from '../../controllers/api/carts.controllers.js'
import errors from '../../lib/customErrors.js'
import { authJwtApi } from '../../middlewares/api/authentication/jwt/auth.byJwt.api.js'
import { validateQuantity } from '../../middlewares/validators/cart.validator.js'
import { validateGetById } from '../../middlewares/validators/id.validator.js'

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

cartRouter.get('/:cid', authJwtApi, handlerGetCart)
cartRouter.post('/products/:pid', authJwtApi, validateQuantity, handlerAddProductToCart)
cartRouter.post('/purchase', authJwtApi, handlerPurchase)
cartRouter.put('/products', authJwtApi, validateQuantity, handlerPutProductsCart)
cartRouter.delete('/products/:pid', authJwtApi, handlerDelProdInCart)
cartRouter.delete('/:cid', authJwtApi, handlerDeleteCart)
cartRouter.delete('/cleanCart/:cid', authJwtApi, handlerCleanCart)

export default cartRouter
