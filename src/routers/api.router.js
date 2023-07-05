import { Router } from 'express'
import userRouter from './user.router.js'

const apiRouter = Router()

apiRouter.use('/user', userRouter)

export default apiRouter
