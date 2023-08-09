import { PORT } from '../configs/server.config.js'

const domain = process.env.DOMAIN || `http://localhost:${PORT}/`

const corsOptions = {
    origin: domain,
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept'
}

export default corsOptions
