import config from '../../../../config.js'
import errors from '../../../lib/customErrors.js'

export async function authUserAdmin (req, res, next) {
    if (!req.user) return res.redirect('/web/auth/login')
    if (req.user.email !== config.ADMIN_EMAIL) throw errors.permission_failes.withDetails('Resource not enabled for users')
    next()
}
