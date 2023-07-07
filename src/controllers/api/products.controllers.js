import productServices from '../../services/product.services.js'

export async function handlerPostProducts (req, res, next) {
    try {
        const productData = req.body
        const productImages = req.files || req.file
        let owner
        if (req.user.role === 'Premium') {
            owner = req.user.email
        } else {
            owner = null
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
