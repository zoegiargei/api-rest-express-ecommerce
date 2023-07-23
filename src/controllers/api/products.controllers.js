import config from '../../../config.js'
import productServices from '../../services/product.services.js'

export async function handlerPostProducts (req, res, next) {
    try {
        const productData = req.body
        const productImages = req.files || req.file
        let owner
        if (req.user.role === 'Premium') {
            owner = req.user.email
        } else {
            owner = config.ADMIN_EMAIL
        }
        const result = await productServices.loadProduct(productData, productImages, owner)
        res.sendCreated({ message: 'Product created successfully', object: result })
    } catch (error) {
        next(error)
    }
}

export async function handlerDeleteProduct (req, res, next) {
    try {
        const pid = req.params.pid
        await productServices.deleteProduct(pid)
        res.sendNoContent({ message: null, object: null })
    } catch (error) {
        next(error)
    }
}

export async function handlerPutProduct (req, res, next) {
    try {
        const pid = req.params.pid
        const data = req.body
        const role = req.user.role
        const userEmail = req.user.email

        const result = productServices.updateProductByOwner(pid, data, role, userEmail)
        res.sendOk({ message: 'Product updated successfully', object: result })
    } catch (error) {
        next(error)
    }
}

export async function handlerGetProduct (req, res, next) {
    try {
        const pid = req.params.pid
        const result = await productServices.getProductById(pid)
        res.sendOk({ message: 'Product found successfully', object: result })
    } catch (error) {
        next(error)
    }
}

export async function handlerGetProducts (req, res, next) {
    try {
        let result
        if (req.query.category) {
            result = await productServices.getProductsByQuery({ category: req.query.category })
        } else {
            result = await productServices.getProducts()
        }
        res.sendOk({ message: 'Products found successfully', object: result })
    } catch (error) {
        next(error)
    }
}

export async function handlerGetProductsPaginate (req, res, next) {
    try {
        const page = req.query.page || 1
        const limit = req.query.limit || 5
        const result = await productServices.productsByPaginate(limit, page)

        const prevLink = result.hasPrevPage ? `api/products/limit=${limit}&?page=${Number(page) - 1}` : null
        const nextLink = result.hasPrevPage ? `api/products/limit=${limit}&?page=${Number(page) + 1}` : null

        // eslint-disable-next-line dot-notation
        return res.sendOk({ message: 'Products lookup by page were found successfully', object: [result['docs'], prevLink, nextLink] })
    } catch (error) {
        next(error)
    }
}
