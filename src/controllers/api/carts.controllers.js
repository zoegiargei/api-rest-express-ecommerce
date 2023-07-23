import cartServices from '../../services/cart.services.js'
import userServices from '../../services/user.services.js'

export async function handlerGetCart (req, res, next) {
    try {
        const cid = req.params.cid
        const result = await cartServices.getCartById(cid)
        res.sendOk({ message: 'Cart found successfully', object: result })
    } catch (error) {
        next(error)
    }
}

export async function handlerAddProductToCart (req, res, next) {
    try {
        const cid = req.user.cart[0]._id
        console.log(cid)
        const pid = req.params.pid
        console.log(pid)
        const quantity = Number(req.body.quantity)
        const result = await cartServices.addToCart(cid, pid, quantity)
        res.sendCreated({ message: 'Product added to cart successfully', object: result })
    } catch (error) {
        next(error)
    }
}

export async function handlerPutProductsCart (req, res, next) {
    try {
        const cid = req.user.cart[0]._id
        const pid = req.body.pid
        const quantity = req.body.quantity
        const result = await cartServices.updateProdInCart(cid, pid, quantity)
        res.sendOk({ message: 'Product updated successfully', object: result })
    } catch (error) {
        next(error)
    }
}

export async function handlerDelProdInCart (req, res, next) {
    try {
        const cid = req.user.cart[0]._id
        const pid = req.params.pid
        const result = await cartServices.delProdInCart(cid, pid)
        req.logger.warn(`Result in Delete products cart: ${result}`)
        res.sendOk({ message: 'Product deleted of cart successfully', object: result })
    } catch (error) {
        next(error)
    }
}

export async function handlerCleanCart (req, res, next) {
    try {
        const cid = req.user.cart[0]._id
        const result = await cartServices.deleteAllProducts(cid)
        res.sendOk({ message: 'Cart emptyed successfully', object: result })
    } catch (error) {
        next(error)
    }
}

export async function handlerDeleteCart (req, res, next) {
    try {
        const cid = req.user.cart[0]._id
        const result = await cartServices.deleteCart(cid)
        res.sendOk({ message: 'Car deleted successfully', object: result })
    } catch (error) {
        next(error)
    }
}

export async function handlerPurchase (req, res, next) {
    try {
        const uid = req.user._id
        const user = await userServices.getUserById(uid)
        const { totalPurchase, purchaseData } = await cartServices.purchaseFirstStep(user)
        let ticket
        if (totalPurchase > 0) {
            ticket = await cartServices.purchaseSecondStep(totalPurchase, user, purchaseData)
        }
        res.sendOk({ message: 'The purchase was successful', object: { totalPurchase, purchaseData, ticket } })
    } catch (error) {
        next(error)
    }
}

export async function payment (req, res, next) {
    try {
        res.send('we are working on this endpoint')
    } catch (error) {
        next(error)
    }
}
