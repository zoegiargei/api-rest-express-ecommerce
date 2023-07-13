import { Router } from 'express'
import errors from '../lib/customErrors.js'
import { validateSignUp, validateUpdatePassword } from '../middlewares/validators/user.validators.js'
import { validateGetById } from '../middlewares/validators/id.validator.js'
import ConfigMulter from '../utils/multer/config.files.multer.js'
import { handlerConvertToPremium, handlerDeleteUsers, handlerGetUser, handlerGetUsers, handlerPostDocuments, handlerPostProfileImg, handlerPostUser, handlerPutLastConnection, handlerPutPassword, handlerRegister, handlerUpdatePassFirstStep } from '../controllers/api/user.controllers.js'
import { registerAuthentication } from '../middlewares/passport/passport.strategies.js'
import { authJwtApi } from '../middlewares/authentication/jwt/auth.byJwt.api.js'
import { authByRole } from '../middlewares/authentication/authentication.byRole.js'
import authTokenResetPass from '../middlewares/user/auth.token.reset.pass.middleware.js'

const userRouter = Router()

const configMulter = new ConfigMulter()
const upload = configMulter.configUpload()

userRouter.param('uid', (req, res, next, param) => {
    try {
        if (param === null || param === undefined) throw errors.invalid_input.withDetails('You did not send the USER ID')
        validateGetById(param, req.url)
        next()
    } catch (error) {
        next(error)
    }
})

userRouter.post('/register', validateSignUp, registerAuthentication, handlerRegister)

userRouter.post('/', authJwtApi, authByRole(['Admin', 'Premium']), validateSignUp, handlerPostUser)

userRouter.post('/:uid/documents', authJwtApi, upload.fields([{ name: 'identification', maxCount: 1 }, { name: 'proofAddress', maxCount: 1 }, { name: 'statementAccount', maxCount: 1 }]), handlerPostDocuments)

userRouter.get('/', authJwtApi, authByRole(['Admin', 'Premium']), handlerGetUsers)

userRouter.get('/premium/:uid', authJwtApi, authByRole(['Admin', 'User']), handlerConvertToPremium)

userRouter.post('/profileImage', authJwtApi, upload.single('profileImage'), handlerPostProfileImg)

userRouter.get('/:uid', authJwtApi, handlerGetUser)

userRouter.put('/lastConnection/:uid', authJwtApi, handlerPutLastConnection)

userRouter.post('/updatePassword/firstStep', authJwtApi, handlerUpdatePassFirstStep)

userRouter.put('/updatePassword', authJwtApi, validateUpdatePassword, authTokenResetPass, handlerPutPassword)

userRouter.delete('/', handlerDeleteUsers)

export default userRouter
