import passport from 'passport'
import errors from '../../../lib/customErrors.js'

export function authJwtApi (req, res, next) {
    passport.authenticate('jwt', (error, user) => {
        if (error || !user) return next(errors.authentication_failed.withDetails('You are not logged in'))
        const securityUser = { ...JSON.parse(user.payload), password: '' }
        req.user = securityUser
        next()
    })(req, res, next)
}
