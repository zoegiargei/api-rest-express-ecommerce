import { Router } from 'express'
import { handlerShowLogin } from '../../controllers/web/auth.controllers.web.js'
import { authLoggedinWeb } from '../../middlewares/web/authentication/jwt/auth.logged.in.js'

const authRouterWeb = Router()

authRouterWeb.get('/login', authLoggedinWeb, handlerShowLogin)

export default authRouterWeb
