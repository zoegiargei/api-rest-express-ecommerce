import config from '../../config.js'
import DAOMemory from '../DAO/memory/memory.dao.js'
import cartDaoMongo from '../DAO/mongo/cart.dao.mongo.js'
import errors from '../lib/customErrors.js'
import Cart from '../models/Cart/Cart.js'
import productServices from './product.services.js'

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

    async addToCart (cid, pid, quantity = 1) {
        const cartInDb = this.validateCartId(cid)
        const productById = this.validateProductId(pid)

        if (cartInDb.productsCart.find(prod => String(prod.product._id) === pid)) {
            cartInDb.productsCart.forEach(obj => {
                if (String(obj.product._id) === pid) {
                    obj.quantity += Number(quantity)
                }
            })
        } else {
            cartInDb.productsCart.push({ product: pid, quantity: Number(quantity) })
        }
        productById.stock = productById.stock - quantity
        await productServices.updateProduct(pid, productById)
        await this.cartDao.replaceElement(cid, cartInDb)
    }

    async updateProductsCart (cid, data) {
        const cartInDb = this.validateCartId(cid)
        if (!data || data === []) throw errors.invalid_input.withDetails('You sent an invalid data for update the cart')
        cartInDb.productsCart = data
        return await this.cartDao.replaceElement(cid, cartInDb)
    }

    async updateProdInCart (cid, pid, newQuantity) {
        const cartInDb = this.validateCartId(cid)
        const productById = this.validateProductId(pid)

        if (cartInDb.productsCart.find(prod => String(prod.product._id) === pid)) {
            cartInDb.productsCart.forEach(obj => {
                if (String(obj.product._id) === pid) {
                    productById.stock = productById.stock + obj.quantity
                    obj.quantity = newQuantity
                }
            })

            productById.stock = productById.stock - newQuantity
            await productServices.updateProduct(pid, productById)
            await this.cartDao.replaceElement(cid, cartInDb)
        } else {
            throw errors.not_found.withDetails('Product not found in cart')
        }
    }

    async delProdInCart (cid, pid) {
        const cartInDb = this.validateCartId(cid)
        const product = cartInDb.productsCart.find(prod => String(prod.product._id) === pid)
        const quantity = product.quantity

        if (product) {
            const newCartInDb = cartInDb.productsCart.filter(prod => String(prod.product._id) !== pid)
            const productInDb = await productServices.getProductById(pid)
            productInDb.stock = productInDb.stock + quantity

            await productServices.updateProduct(pid, productInDb)
            await this.cartDao.replaceElement(cid, newCartInDb)
        } else {
            throw errors.not_found.withDetails('Product not found in cart')
        }
    }

    async deleteAllProducts (cid) {
        const cartInDb = this.validateCartId(cid)

        cartInDb.productsCart.forEach(async (prod) => {
            const pid = String(prod.product._id)
            const quantity = prod.quantity

            const product = this.validateProductId(pid)
            product.stock = product.stock + quantity
            await productServices.updateProduct(pid, product)
        })

        cartInDb.productsCart = []
        return await this.cartDbDAO.replaceElement(cid, cartInDb)
    }

    async deleteCart (cid) {
        const cartInDb = this.validateCartId(cid)

        cartInDb.productsCart.forEach(async prod => {
            const pid = prod.product._id
            const quantity = prod.quantity
            const product = await productServices.getProductById(pid)
            product.stock = product.stock + quantity
            await productServices.updateProduct(pid, product)
        })

        return await this.cartDao.deleteElement(cid)
    }
}
let cartServices
if (config.NODE_ENV === 'dev') {
    const cartDaoMemory = new DAOMemory()
    cartServices = new CartServices(cartDaoMemory)
} else {
    cartServices = new CartServices(cartDaoMongo)
}
export default cartServices
