import passport from 'passport'
import cartServices from '../../../../services/cart.services.js'

export function authJwtWeb (req, res, next) {
    passport.authenticate('jwt', async (error, user) => {
        if (error || !user) return res.redirect('/web/auth/login')
        const securityUser = { ...JSON.parse(user.payload), password: '' }
        req.user = securityUser
        req.admin = req.user.role === 'Admin'
        if (!req.admin) {
            const cart = await cartServices.getCartById(securityUser.cart[0]._id)
            req.quantity = cart.productsCart.length
        } else {
            req.quantity = null
        }
        next()
    })(req, res, next)
}
