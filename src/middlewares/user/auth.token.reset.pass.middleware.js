import errors from '../../lib/customErrors.js'
import tokenServices from '../../services/token.services.js'

export async function authTokenResetPass (req, res, next) {
    try {
        const token = req.query.token
        const tokenByToken = await tokenServices.validateEqualsTokens(token)
        if (tokenByToken.length === 0) throw errors.permission_failes.withDetails('Expired Token to reset password')
        next()
    } catch (error) {
        next(error)
    }
}
export default authTokenResetPass
