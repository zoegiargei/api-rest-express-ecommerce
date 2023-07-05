import productsDaoMongo from '../DAO/mongo/products.dao.mongo.js'
import productModel from '../DAO/mongoSchemas/Product.model.js'
import errors from '../lib/customErrors.js'
import { Product } from '../models/Product/Product.js'

class ProductServices {
    constructor (productsDao) {
        this.productsDao = productsDao
    }

    async loadProduct (data, attach) {
        const codeProd = await this.productsDao.findElementByProjection({ code: Number(data.code) }, { code: 1 })

        if (codeProd.length > 0) throw errors.invalid_input.withDetails('CODE NOT EXISTING')
        const prod = { ...data, thumbnail: attach }

        const newProd = new Product(prod)
        await this.productsDao.creaeteElement(newProd)
        return newProd
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
        if (!product) throw errors.invalid_input.withDetails('Sent an invalid product id')
        return product
    }

    async updateProduct (pid, data) {
        return await this.productsDao.updateElement({ _id: pid }, data)
    }

    async sortAndShowElements (value) {
        const sort = value
        if ((!sort || sort !== 1) && (sort !== -1)) throw errors.invalid_input.withDetails('The sort value only can be 1 or -1')
        return await this.productsDao.sortElements({ price: sort })
    }

    async deleteProduct (pid) {
        return await this.productsDao.deleteElement(pid)
    }

    async productsByPaginate (limitValue, pageValue) {
        const products = await productModel.paginate({}, { limit: limitValue, page: pageValue, lean: true })
        return products
    }
}
const productServices = new ProductServices(productsDaoMongo)
export default productServices
