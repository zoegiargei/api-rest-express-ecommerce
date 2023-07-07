import errors from '../../lib/customErrors.js'

export const authByRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            next(errors.invalid_auth.withDetails('From authByRole: You are not authenticated'))
        }
        if (roles.includes(req.user.role)) {
            next()
        } else {
            next(errors.invalid_permission.withDetails('From authByRole: You are not allowed to get that resource'))
        }
    }
}
