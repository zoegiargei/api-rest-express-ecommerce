import passport from 'passport'

export function authJwtApi (req, res, next) {
    passport.authenticate('jwt', (error, user) => {
        if (error || !user) return next(error)
        const securityUser = { ...JSON.parse(user.payload), password: '' }
        req.user = securityUser
        next()
    })(req, res, next)
}
