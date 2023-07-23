import tokenDaoMongo from '../DAO/mongo/token.dao.mongo.js'
import Token from '../models/Token.js'
import encryptedJWT from '../utils/jwt/encrypted.jwt.js'
import { v4 as uuidv4 } from 'uuid'
import { winstonLogger } from '../middlewares/logger/logger.js'
import errors from '../lib/customErrors.js'
import config from '../../config.js'
import tokenDaoMemory from '../DAO/memory/token.dao.memory.js'

class TokenServices {
    constructor (tokenDAO) {
        this.tokenDAO = tokenDAO
    }

    async createToken (userId) {
        const ttl = '1h'
        const randomScript = uuidv4()
        const token = new Token(userId, encryptedJWT.encryptData(randomScript, ttl))
        return token
    }

    async getTokenByUserId (uid) {
        const tokenInDb = await this.tokenDAO.findElementsByQuery({ userId: uid })
        if (tokenInDb.length === 0) throw errors.not_found.withDetails('Token not found')
        return tokenInDb
    }

    async validateEqualsTokens (tk) {
        const tokenInDb = await this.tokenDAO.findElementsByQuery({ token: tk })
        if (tokenInDb.length === 0) throw errors.not_found.withDetails('Tokens do not match')
        return tokenInDb
    }

    async saveTockenUpdatePass (uid, token) {
        const tokenInDb = await this.tokenDAO.findElementsByQuery({ userId: uid })
        if (tokenInDb.length > 0) {
            await this.tokenDAO.deleteElement(tokenInDb._id)
        }
        const result = await this.tokenDAO.createElement(token)
        return result
    }

    async deleteToken (tk) {
        const tokenInDb = await this.tokenDAO.findElementsByQuery({ token: tk })
        if (tokenInDb.length > 0) {
            const tkId = tokenInDb[0]._id
            return await this.tokenDAO.deleteElement(tkId)
        }
        throw errors.not_found.withDetails('Token not found')
    }
}

let tokenServices
if (config.NODE_ENV === 'dev') {
    tokenServices = new TokenServices(tokenDaoMemory)
} else {
    tokenServices = new TokenServices(tokenDaoMongo)
}
export default tokenServices
