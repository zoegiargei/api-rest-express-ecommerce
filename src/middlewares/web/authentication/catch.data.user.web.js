import passport from 'passport'
import cartServices from '../../../services/cart.services.js'

export async function catchDataUserWeb (req, res, next) {
    passport.authenticate('jwt', async (error, user) => {
        if (error || !user) return next()
        const securityUser = { ...JSON.parse(user.payload), password: '' }
        req.user = securityUser
        const cart = await cartServices.getCartByIdAndQuery(securityUser.cart[0]?._id, { select: { productsCart: 1 } })
        req.quantity = cart.productsCart.length
        req.admin = req.user.role === 'Admin'
        next()
    })(req, res, next)
}
