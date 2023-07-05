import express from 'express'
import { errorHandler } from './middlewares/errorHandler.js'
import apiRouter from './routers/api.router.js'
import cookieParser from 'cookie-parser'
import { SECRET_WORD } from './configs/cookie.config.js'
import { passportInitialize } from './middlewares/passport/passport.strategies.js'
import cors from 'cors'
import { customResponses } from './lib/custom.responses.js'
import config from '../config.js'
import { MONGO_CNX_STR } from './configs/mongo.config.js'

const app = express()
const PORT = 8080

app.use(customResponses)
app.use(cookieParser(SECRET_WORD))
app.use(passportInitialize)
const corsOptions = {
    origin: `http://localhost:${PORT}`,
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept'
}
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api', apiRouter)
app.use(errorHandler)

app.get('*', (req, res) => {
    if ((/^[/](web)[/][a-z]*$/i).test(req.url)) {
        res.json({ message: 'Similar route' })
    }
    res.json({ message: `Unknown route: ${req.url}` })
})

if (config.PERSISTENCE === 'MONGO') {
    const mongoose = await import('mongoose')
    console.log(MONGO_CNX_STR)
    await mongoose.connect(MONGO_CNX_STR, { useNewUrlParser: true, useUnifiedTopology: true })
}

app.listen(PORT, () => { console.log(`Server connected to port ${8080}`) })
