import config from '../../config.js'
import cartDaoMemory from '../DAO/memory/cart.dao.memory.js'
import cartDaoMongo from '../DAO/mongo/cart.dao.mongo.js'
import errors from '../lib/customErrors.js'
import { winstonLogger } from '../middlewares/logger/logger.js'
import Cart from '../models/Cart/Cart.js'
import Order from '../models/Order.js'
import Ticket from '../models/Ticket.js'
import templatesForEmails from '../utils/templates/templates.send.email.js'
import emailService from './email.services.js'
import productServices from './product.services.js'
import ticketServices from './ticket.services.js'
import userServices from './user.services.js'

class CartServices {
    constructor (cartDao) {
        this.cartDao = cartDao
    }

    async validateCartId (cid) {
        const cartInDb = await this.cartDao.findElementById(cid)
        if (!cartInDb) throw errors.invalid_input.withDetails('Invalid cart id')
        return cartInDb
    }

    async validateProductId (pid) {
        const productById = await productServices.getProductById(pid)
        if (!productById) throw errors.invalid_input.withDetails('Invalid product id')
        return productById
    }

    async createCart (userEmail) {
        const newCart = new Cart(userEmail)
        const cartDto = newCart.toDto()
        const cart = await this.cartDao.createElement(cartDto)
        return cart
    }

    async getLastOne () {
        const lastOne = await this.cartDao.findTheLastOne()
        return lastOne
    }

    async getCartById (cid) {
        return await this.cartDao.findElementById(cid)
    }

    async getCartByIdAndQuery (cid, query) {
        return await this.cartDao.findElementByIdAndQuery(cid, query)
    }

    async addToCart (cid, pid, quantity = 1) {
        const cartInDb = await this.validateCartId(cid)
        const productsCart = cartInDb.productsCart
        if (productsCart) {
            const index = productsCart.findIndex(prod => String(prod.product._id) === pid)
            if (index !== -1) {
                productsCart[index].quantity += Number(quantity)
            } else {
                productsCart.push({ product: pid, quantity })
            }
            const result = await this.updateProductsCart(cid, productsCart)
            return result
        } else {
            throw errors.not_found.withDetails('There is not a product cart with this cart ID')
        }
    }

    async updateProductsCart (cid, data) {
        const cartInDb = await this.validateCartId(cid)
        if (!data || data === []) throw errors.invalid_input.withDetails('You sent an invalid data for update the cart')
        cartInDb.productsCart = data
        const result = await this.cartDao.updateElement(cid, cartInDb)
        return result
    }

    async updateProdInCart (cid, pid, newQuantity) {
        const cartInDb = await this.validateCartId(cid)
        const productsCart = cartInDb.productsCart
        const index = productsCart.findIndex(prod => String(prod.product._id) === pid)
        if (index !== -1) {
            productsCart[index].quantity = newQuantity
            await this.cartDao.updateElement(cid, cartInDb)
            return cartInDb
        } else {
            throw errors.not_found.withDetails('Product not found in cart')
        }
    }

    async delProdInCart (cid, pid) {
        const cartInDb = await this.validateCartId(cid)
        const productsCart = cartInDb.productsCart

        const index = productsCart.findIndex(prod => String(prod.product._id) === pid)
        if (index !== -1) {
            const newCartInDb = productsCart.filter(prod => String(prod.product._id) !== pid)
            await this.cartDao.updateElement(cid, newCartInDb)
            return cartInDb
        } else {
            throw errors.not_found.withDetails('Product not found in cart')
        }
    }

    async deleteAllProducts (cid) {
        const cartInDb = await this.validateCartId(cid)
        cartInDb.productsCart = []
        return await this.updateProductsCart(cid, cartInDb)
    }

    async deleteCart (cid) {
        return await this.cartDao.deleteElement(cid)
    }

    async purchaseFirstStep (user) {
        const cid = user.cart[0]._id
        const cart = await this.getCartById(cid)
        const productsCart = cart.productsCart
        const purchaseData = []
        let totalPurchase = 0
        const newProductsCart = []

        for (const obj of productsCart) {
            if (obj.product) {
                const product = await productServices.getProductById(String(obj.product._id))
                const quantity = obj.quantity

                if (product.stock >= quantity) {
                    product.stock = product.stock - quantity
                    const price = product.price * quantity
                    totalPurchase = totalPurchase + Number(price)
                    delete productsCart.obj
                    purchaseData.push({ _id: product._id, quantity, totalAmount: price })
                    await productServices.updateProduct(product._id, product)
                    await this.updateProductsCart(cid, productsCart)
                } else {
                    newProductsCart.push(obj)
                }
            }
        }

        const result = this.updateProductsCart(cid, newProductsCart)
        winstonLogger.warn(result)

        return { totalPurchase, purchaseData }
    }

    async purchaseSecondStep (totalPurchase, user, purchaseData) {
        const ticket = new Ticket(totalPurchase, user.email)
        const resultSaveTicket = await ticketServices.saveTicket(ticket)
        winstonLogger.info(resultSaveTicket)
        const ticketInDb = await ticketServices.getLastCreatedTicket()
        const newOrder = new Order(purchaseData, ticketInDb)
        user.orders.push(newOrder)
        await userServices.updateUser(user._id, user)
        const hardcodedEmail = 'zoegiargei00@gmail.com'
        const message = templatesForEmails.templateSendTicket(ticket)
        await emailService.send(hardcodedEmail, message, 'Purchase ticket')
        return ticket
    }
}
let cartServices
if (config.NODE_ENV === 'dev') {
    cartServices = new CartServices(cartDaoMemory)
} else {
    cartServices = new CartServices(cartDaoMongo)
}
export default cartServices
