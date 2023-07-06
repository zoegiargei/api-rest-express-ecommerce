import productServices from '../../services/product.services.js'

export async function handlerPostProducts (req, res, next) {
    try {
        const productData = req.body
        const productImages = req.files || req.file
        const result = await productServices.loadProduct(productData, productImages)
        res.sendCreated({ message: 'Product created successfully', object: result })
    } catch (error) {
        next(error)
    }
}
