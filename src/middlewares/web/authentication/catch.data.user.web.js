import passport from 'passport'
import cartServices from '../../../services/cart.services.js'

export async function catchDataUserWeb (req, res, next) {
    passport.authenticate('jwt', async (error, user) => {
        if (error || !user) return next()
        const securityUser = { ...JSON.parse(user.payload), password: '' }
        req.user = securityUser
        req.admin = req.user.role === 'Admin'
        if (!req.admin) {
            const cart = await cartServices.getCartByIdAndQuery(securityUser.cart[0]?._id, { select: { productsCart: 1 } })
            req.quantity = cart.productsCart.length
        } else {
            req.quantity = null
        }
        next()
    })(req, res, next)
}
