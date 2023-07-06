import { Router } from 'express'
import { handlerPostProducts } from '../controllers/api/products.controllers.js'
import errors from '../lib/customErrors.js'
import { validateGetById } from '../middlewares/validators/id.validator.js'
import ConfigMulter from '../utils/multer/config.files.multer.js'

const configMulter = new ConfigMulter('./public/uploads/products')
const upload = configMulter.configUpload()

const productsRouter = Router()

productsRouter.param('pid', (req, res, next, param) => {
    try {
        if (param === null || param === undefined) throw errors.invalid_input.withDetails('You did not send the USER ID')
        validateGetById(param)
        next()
    } catch (error) {
        next(error)
    }
})

productsRouter.post('/product', upload.any('productImages'), handlerPostProducts)
productsRouter.get('/:pid')
productsRouter.put('/:pid')
productsRouter.delete('/:pid')

export default productsRouter
