import passport from 'passport'

export function authJwtWeb (req, res, next) {
    passport.authenticate('jwt', (error, user) => {
        if (error || !user) return res.redirect('/web/session/login')
        const securityUser = { ...JSON.parse(user.payload), password: '' }
        req.user = securityUser
        next()
    })(req, res, next)
}
