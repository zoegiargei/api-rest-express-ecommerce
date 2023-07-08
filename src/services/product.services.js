import config from '../../config.js'
import productDaoMemory from '../DAO/memory/product.dao.memory.js'
import productsDaoMongo from '../DAO/mongo/products.dao.mongo.js'
import productModel from '../DAO/mongoSchemas/Product.model.js'
import errors from '../lib/customErrors.js'
import { Product } from '../models/Product/Product.js'
import templatesForEmails from '../utils/templates/templates.send.email.js'
import emailService from './email.services.js'

class ProductServices {
    constructor (productsDao) {
        this.productsDao = productsDao
    }

    async loadProduct (data, attach, owner) {
        const codeProd = await this.productsDao.findElementByProjection({ code: data.code }, { code: 1 })
        if (codeProd.length > 0) throw errors.invalid_input.withDetails('CODE already exist')

        const files = []
        attach.forEach(file => {
            files.push(file.filename)
        })
        console.log(files)

        const prod = { ...data, thumbnail: files }
        prod.owner = owner

        const newProd = new Product(prod)
        const prodAsDto = newProd.toDto()
        if (prodAsDto._id === null) {
            delete prodAsDto._id
        }
        const result = await this.productsDao.createElement(prodAsDto)
        return result
    }

    async getProducts () {
        return await this.productsDao.findElements()
    }

    async getProductsByQuery (queryCli) {
        if (typeof queryCli !== 'object') throw errors.invalid_input.withDetails('Invalid query')
        return await this.productsDao.findElementsByQuery(queryCli)
    }

    async getProductById (pid) {
        const product = await this.productsDao.findElementById(pid)
        if (!product) throw errors.not_found.withDetails(`Product not found: ${pid}`)
        return product
    }

    async updateProduct (pid, data) {
        return await this.productsDao.updateElement({ _id: pid }, data)
    }

    async updateProductByOwner (pid, data, role, uEmail) {
        let productUpdated
        if (role === 'Premium' || role === 'Admin') {
            const product = await this.getProductById(pid)
            const productOwner = product.owner
            if (role === 'Premium') {
                if (productOwner === uEmail) {
                    productUpdated = await this.updateProduct(pid, data)
                } else {
                    throw errors.invalid_permission.withDetails('You are not allowed to updated that product')
                }
            } else {
                productUpdated = await this.updateProduct(pid, data)
            }
        }

        return productUpdated
    }

    async sortAndShowElements (value) {
        const sort = value
        if ((!sort || sort !== 1) && (sort !== -1)) throw errors.invalid_input.withDetails('The sort value only can be 1 or -1')
        return await this.productsDao.sortElements({ price: sort })
    }

    async deleteProduct (pid) {
        const product = await this.productsDao.findElementById(pid)
        // const owner = product.owner
        const hardcodedEmail = 'zoegiargei00@gmail.com' // Must be 'owner'
        const message = templatesForEmails.templateSendProductRemoved(product.title, product._id)
        emailService.send(hardcodedEmail, message, 'Product Deletion Notification')
        return await this.productsDao.deleteElement(pid)
    }

    async productsByPaginate (limitValue, pageValue) {
        const products = await productModel.paginate({}, { limit: limitValue, page: pageValue, lean: true })
        return products
    }
}

let productServices
if (config.NODE_ENV === 'dev') {
    productServices = new ProductServices(productDaoMemory)
} else {
    productServices = new ProductServices(productsDaoMongo)
}
export default productServices
