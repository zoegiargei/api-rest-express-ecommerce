import passport from 'passport'

export function authLoggedinWeb (req, res, next) {
    passport.authenticate('jwt', (user) => {
        if (!user) {
            next()
        } else {
            return res.redirect('/web/home')
        }
    })(req, res, next)
}
