import generatorProductsMock from '../../mocks/utils/mocks/generator.products.mock.js'
import assert from 'assert'
import mongoose from 'mongoose'
import { afterEach, beforeEach, describe, it } from 'mocha'
import ProductsDbDAO from '../../src/DAO/DB_DAOs/Products.DAO.db.js'

const MONGO_CNX_STR_TEST = process.env.MONGO_CNX_STR

describe('Products DAO mongoose', () => {
    beforeEach(async () => {
        await mongoose.connect(MONGO_CNX_STR_TEST, { useNewUrlParser: true, useUnifiedTopology: true })
        if (await mongoose.connection.collection.products) {
            await mongoose.connection.collection.products.drop()
        }
    })
    afterEach(async () => {
        await mongoose.disconnect()
    })

    it('unit test: The dao can get the products in an arrangement', async () => {
        const result = await ProductsDbDAO.findElements()
        assert.strictEqual(Array.isArray(result), true)
    })

    it('unit test: The dao can successfully create a product', async () => {
        const productProof = generatorProductsMock.createProductMock()
        const result = await ProductsDbDAO.creaeteElement(productProof)
        assert.ok(result._id, 'Dao cannot create a product')
        // delete result._id
        const productProof2 = { ...productProof, _id: result._id }
        assert.deepEqual(productProof2, result._doc)
    })

    it('unit test: The dao can successfully find a product given the _id', async () => {
        const productProof = generatorProductsMock.createProductMock()
        const created = await ProductsDbDAO.creaeteElement(productProof)
        const result = await ProductsDbDAO.findElementById(created._id)
        delete result._id
        assert.deepEqual(productProof, result)
    })
})
