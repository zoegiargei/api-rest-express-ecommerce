export const authByRoleWeb = (roles) => {
    return (req, res, next) => {
        if (!req.user) return res.redirect('/web/auth/login')
        if (roles.includes(req.user.role)) {
            next()
        } else {
            return res.redirect('/web/home')
        }
    }
}
