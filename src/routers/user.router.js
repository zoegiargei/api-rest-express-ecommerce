import { Router } from 'express'
import errors from '../lib/customErrors.js'
import { validateSignUp } from '../middlewares/validators/user.validators.js'
import { validateGetById } from '../middlewares/validators/id.validator.js'
import ConfigMulter from '../utils/multer/config.files.multer.js'
import { handlerComePremium, handlerDeleteUsers, handlerGetUser, handlerGetUsers, handlerPostDocuments, handlerPostProfileImg, handlerPostUser, handlerPutLastConnection, handlerPutPassword, handlerRegister } from '../controllers/api/user.controllers.js'
import { registerAuthentication } from '../middlewares/passport/passport.strategies.js'

const userRouter = Router()

const configMulter = new ConfigMulter()
const upload = configMulter.configUpload()

userRouter.param('uid', (req, res, next, param) => {
    try {
        if (param === null || param === undefined) throw errors.invalid_input.withDetails('You did not send the USER ID')
        validateGetById(param)
        next()
    } catch (error) {
        next(error)
    }
})

userRouter.post('/', validateSignUp, handlerPostUser)

userRouter.post('/register', validateSignUp, registerAuthentication, handlerRegister)

userRouter.post('/:uid/documents', upload.fields([{ name: 'identification', maxCount: 1 }, { name: 'proofAddress', maxCount: 1 }, { name: 'statementAccount', maxCount: 1 }]), handlerPostDocuments)

userRouter.get('/', handlerGetUsers)

userRouter.get('/premium/:uid', handlerComePremium)

userRouter.post('/:uid/profileImage', upload.single('profileImage'), handlerPostProfileImg)

userRouter.get('/:uid', handlerGetUser)

userRouter.put('/lastConnection/:uid/', handlerPutLastConnection)

userRouter.put('/updatePassword/:uid', handlerPutPassword)

userRouter.delete('/', handlerDeleteUsers)

export default userRouter
