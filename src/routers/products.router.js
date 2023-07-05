import { Router } from 'express'
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

productsRouter.post('/', upload.single('productImage'), (req, res, next) => {
    try {
        const prodImage = req.file
        console.log(prodImage)
        res.json({ prodImage })
    } catch (error) {
        next(error)
    }
})
productsRouter.get('/:pid')
productsRouter.put('/:pid')
productsRouter.delete('/:pid')

export default productsRouter
