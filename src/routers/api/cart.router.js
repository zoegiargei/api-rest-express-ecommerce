import { Router } from 'express'
import { handlerAddProductToCart, handlerDeleteCart, handlerDeleteProducts, handlerDelProdInCart, handlerGetCart, handlerPurchase, handlerPutProductsCart } from '../../controllers/api/carts.controllers.js'
import errors from '../../lib/customErrors.js'
import { authByRole } from '../../middlewares/api/authentication/auth.role.api.js'
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
cartRouter.post('/products/:pid', authJwtApi, authByRole(['Premium', 'User']), validateQuantity, handlerAddProductToCart)
cartRouter.post('/purchase', authJwtApi, authByRole(['Premium', 'User']), handlerPurchase)
cartRouter.put('/products', authJwtApi, authByRole(['Premium', 'User']), validateQuantity, handlerPutProductsCart)
cartRouter.delete('/products/:pid', authJwtApi, authByRole(['Premium', 'User']), handlerDelProdInCart)
cartRouter.delete('/products', authJwtApi, handlerDeleteProducts)
cartRouter.delete('/', authJwtApi, authByRole(['Premium', 'User']), handlerDeleteCart)

export default cartRouter
