import { Router } from 'express'
import { handlerDeleteProduct, handlerPostProducts } from '../controllers/api/products.controllers.js'
import errors from '../lib/customErrors.js'
import { authByRole } from '../middlewares/authentication/authentication.byRole.js'
import { authJwtApi } from '../middlewares/authentication/jwt/auth.byJwt.api.js'
import { validateGetById } from '../middlewares/validators/id.validator.js'
import { validateProductFields } from '../middlewares/validators/product.validators.js'
import ConfigMulter from '../utils/multer/config.files.multer.js'

const configMulter = new ConfigMulter('./public/uploads/products')
const upload = configMulter.configUpload()

const productsRouter = Router()

productsRouter.param('pid', (req, res, next, param) => {
    try {
        if (param === null || param === undefined) throw errors.invalid_input.withDetails('You did not send the USER ID')
        validateGetById(param, req.url)
        next()
    } catch (error) {
        next(error)
    }
})

productsRouter.post('/', authJwtApi, authByRole(['Admin', 'Premium']), upload.any('productImages'), validateProductFields, handlerPostProducts)
productsRouter.get('/:pid')
productsRouter.put('/:pid')
productsRouter.delete('/:pid', authJwtApi, authByRole(['Admin']), handlerDeleteProduct)

export default productsRouter
