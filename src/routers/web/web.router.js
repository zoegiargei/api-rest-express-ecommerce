import { Router } from 'express'
import { handlerShowProducts } from '../../controllers/web/products.controller.web.js'
import { validateQueryPage } from '../../middlewares/validators/query.validators.js'
import { catchDataUserWeb } from '../../middlewares/web/authentication/catch.data.user.web.js'
import authRouterWeb from './auth.router.web.js'
import cartRouter from './cart.router.web.js'
import productsRouterWeb from './products.router.web.js'
import userRouterWeb from './user.router.web.js'

const webRouter = Router()

webRouter.get('/home', validateQueryPage, catchDataUserWeb, handlerShowProducts)
webRouter.get('/', (req, res) => {
    res.redirect('/web/home')
})
webRouter.get('/error', (req, res, next) => {
    const dataUser = req.user ? req.user : null
    const dataCart = req.quantity
    res.render('error', { title: 'ERROR', loggedin: dataUser, admin: req.admin, quantity: dataCart })
})

webRouter.use('/products', productsRouterWeb)
webRouter.use('/users', userRouterWeb)
webRouter.use('/auth', authRouterWeb)
webRouter.use('/carts', cartRouter)

export default webRouter
