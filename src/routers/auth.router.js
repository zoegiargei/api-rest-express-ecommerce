import { Router } from 'express'
import { handlerPostAuth, handlerPostLogout } from '../controllers/api/auth.controllers.js'
import { authJwtApi } from '../middlewares/authentication/jwt/auth.byJwt.api.js'
import { loginAuthentication } from '../middlewares/passport/passport.strategies.js'
import { validateLogin } from '../middlewares/validators/user.validators.js'

const authRouter = Router()

authRouter.post('/login', validateLogin, loginAuthentication, handlerPostAuth)
authRouter.post('/logout', authJwtApi, handlerPostLogout)

export default authRouter
