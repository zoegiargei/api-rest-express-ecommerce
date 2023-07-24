/* eslint-disable dot-notation */
import { PORT } from '../../configs/server.config.js'
import productServices from '../../services/product.services.js'

export async function handlerShowProducts (req, res, next) {
    try {
        const page = req.query.page || 1
        const limitValue = 2
        const allProducts = await productServices.productsByPaginate(limitValue, page)
        const thIsProd = allProducts['docs'].length > 0
        const prevLink = allProducts.hasPrevPage ? `http://localhost:${PORT}/web/home?page=${allProducts.prevPage}` : null
        const nextLink = allProducts.hasNextPage ? `http://localhost:${PORT}/web/home?page=${allProducts.nextPage}` : null
        const numPage = allProducts.page
        const user = req.user
        let dataCart
        if (user) dataCart = req.quantity
        res.render('home', { title: 'Home', loggedin: user, quantity: dataCart, admin: req.admin, thIsProducts: thIsProd, products: allProducts['docs'], prevLink: prevLink || false, nextLink: nextLink || false, numberPage: numPage })
    } catch (error) {
        next(error)
    }
}

export async function handlerShowProductDetails (req, res, next) {
    try {
        const user = req.user ? req.user : null
        const dataCart = req.user ? req.quantity : null
        const cid = user ? req.user.cart[0]._id : null
        const result = await productServices.getProductById(req.params.pid)
        res.render('product', { title: 'Details of product', loggedin: user, quantity: dataCart, admin: req.admin, product: result, cartId: cid, stock: result.stock })
    } catch (error) {
        next(error)
    }
}

export async function handlerShowProductsByCategory (req, res, next) {
    try {
        const productCategory = req.query.category
        const cod = '%20'
        const clearCategory = String(productCategory.replace(cod, ' '))
        const limitValue = 2
        const page = req.query.page || 1
        const allProducts = await productServices.productsByPaginateWithQuery({ category: clearCategory }, limitValue, page)
        console.log(allProducts)
        const thIsProd = allProducts['docs'].length > 0
        const prevLink = allProducts.hasPrevPage ? `http://localhost:${PORT}/web/home?page=${allProducts.prevPage}` : null
        const nextLink = allProducts.hasNextPage ? `http://localhost:${PORT}/web/home?page=${allProducts.nextPage}` : null
        const numPage = allProducts.page
        const user = req.user
        let dataCart
        if (user) dataCart = req.quantity

        res.render('home', { title: 'Home', loggedin: user, quantity: dataCart, admin: req.admin, thIsProducts: thIsProd, products: allProducts['docs'], prevLink: prevLink || false, nextLink: nextLink || false, numberPage: numPage })
    } catch (error) {
        next(error)
    }
}
