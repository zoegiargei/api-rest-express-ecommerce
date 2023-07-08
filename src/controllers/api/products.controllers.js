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
        const result = productServices.deleteProduct(pid)
        res.json({ result })
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
