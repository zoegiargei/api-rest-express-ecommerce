import errors from '../../../lib/customErrors.js'

export async function authUserAdmin (req, res, next) {
    if (!req.user) return res.redirect('/web/auth/login')
    if (req.user.role !== 'Admin') throw errors.permission_failes.withDetails('Resource not enabled for users')
    next()
}
