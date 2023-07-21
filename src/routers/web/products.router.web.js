import { Router } from 'express'
import { handlerShowProductDetails, handlerShowProductsByCategory } from '../../controllers/web/products.controller.web.js'
import { catchDataUserWeb } from '../../middlewares/web/authentication/catch.data.user.web.js'

const productsRouterWeb = Router()

productsRouterWeb.get('/productDetails/:pid', catchDataUserWeb, handlerShowProductDetails)
productsRouterWeb.get('/category', catchDataUserWeb, handlerShowProductsByCategory)

export default productsRouterWeb
