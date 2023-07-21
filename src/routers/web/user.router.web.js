import { Router } from 'express'
import { handlerShowProfile, handlerShowRegister, handlerShowUpdatePassword, handlerShowUsers } from '../../controllers/web/user.controllers.web.js'
import { authUserAdmin } from '../../middlewares/web/authentication/auth.userAdmin.web.js'
import { authJwtWeb } from '../../middlewares/web/authentication/jwt/auth.byJwt.web.js'
import { authLoggedinWeb } from '../../middlewares/web/authentication/jwt/auth.logged.in.js'

const userRouterWeb = Router()

userRouterWeb.get('/register', authLoggedinWeb, handlerShowRegister)
userRouterWeb.get('/users', authJwtWeb, authUserAdmin, handlerShowUsers)
userRouterWeb.get('/profile', authJwtWeb, handlerShowProfile)
userRouterWeb.get('/updatePassword', authJwtWeb, handlerShowUpdatePassword)
export default userRouterWeb
