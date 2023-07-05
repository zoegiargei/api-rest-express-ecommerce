import { JWT_PRIVATE_KEY } from '../../configs/auth.config.js'
import jwt from 'jsonwebtoken'

class EncryptedJwt {
    encryptData (payload, ttl) {
        const token = jwt.sign({ payload: JSON.stringify(payload) }, JWT_PRIVATE_KEY, { expiresIn: ttl })
        return token
    }
}
const encryptedJWT = new EncryptedJwt()
export default encryptedJWT
