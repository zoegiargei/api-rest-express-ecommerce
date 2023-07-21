import passport from 'passport'
import cartServices from '../../../services/cart.services.js'

export async function catchDataUserWeb (req, res, next) {
    passport.authenticate('jwt', async (error, user) => {
        if (error || !user) return next()
        const securityUser = { ...JSON.parse(user.payload), password: '' }
        req.user = securityUser
        const cart = await cartServices.getCartById(securityUser.cart[0]._id)
        req.quantity = cart.productsCart.length
        console.log(req.quantity)
        next()
    })(req, res, next)
}
