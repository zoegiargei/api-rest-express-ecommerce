/* eslint-disable object-shorthand */
import cartServices from '../../services/cart.services.js'

export async function handlerShowUserCart (req, res, next) {
    try {
        const cid = req.user.cart[0]._id
        req.logger.warn(`CID: ${cid}`)
        const dataCart = await cartServices.getCartById(cid)
        const productsCart = dataCart.productsCart
        const thAreProducts = productsCart.length > 0
        res.render('cart', { title: 'Cart', loggedin: req.user, quantity: req.quantity, admin: req.admin, thAreProducts: thAreProducts, cart: productsCart, cartId: cid })
    } catch (error) {
        next(error)
    }
}
