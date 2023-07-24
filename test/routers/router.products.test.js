import assert from 'assert'
import supertest from 'supertest'
import mongoose from 'mongoose'
import { after, afterEach, before, beforeEach, describe, it } from 'mocha'
import generatorProductsMock from '../../mocks/utils/mocks/generator.products.mock.js'
import generatorUserMock from '../../mocks/utils/mocks/generator.user.mock.js'
import UsersDAODb from '../../src/DAO/DB_DAOs/Users.DAO.db.js'
import ProductsDbDAO from '../../src/DAO/DB_DAOs/Products.DAO.db.js'

const PORT = 8080
const serverBaseUrl = `http://localhost:${PORT}`
const httpClient = supertest.agent(serverBaseUrl)
const MONGO_CNX_STR_TEST = process.env.MONGO_CNX_STR

// eslint-disable-next-line no-unused-vars
let user
describe('Testing router products', () => {
    before(async () => {
        await mongoose.connect(MONGO_CNX_STR_TEST)
    })
    beforeEach(async () => {
        if (mongoose.connection.collection('carts')) await mongoose.connection.collection('carts').deleteMany({})
        if (mongoose.connection.collection('products')) await mongoose.connection.collection('carts').deleteMany({})
    })
    afterEach(async () => {
        await mongoose.connection.collection('carts').deleteMany({})
        await mongoose.connection.collection('products').deleteMany({})
    })
    after(async () => {
        await mongoose.connection.collection('users').deleteMany({})
        await mongoose.disconnect()
    })

    describe('POST to Endpoint: /api/products/addProduct', () => {
        it('Login', async () => {
            const newUser = generatorUserMock.createUserMockWithEmptyCart()
            await UsersDAODb.creaeteElement(newUser)
            const userCredentials = { email: newUser.email, password: 'mypassword123.' }
            await httpClient
            .post('/api/session/login')
            .send(userCredentials)
            user = newUser
        })

        describe('Should create a new product (without photo) when valid data is sent and a valid token is provided', () => {
            it('Create a product with hardcoded data', async () => {
                const prodProof = generatorProductsMock.createProductMock()
                const { statusCode, ok, body } = await httpClient
                .post('/api/products/addProduct')
                .send(prodProof)
                assert.ok(ok, 'The request was not successfully')
                assert.deepStrictEqual(statusCode, 201, 'The status code is wrong')
                assert.deepStrictEqual(body.object, prodProof, 'The expected product was not equal to the real')
            })
        })

        describe('Should create a new product (with photo) when valid data is sent and a valid token is provided', () => {
            it('Create a product with hardcoded data', async () => {
                const prodProof = generatorProductsMock.createProductMock()
                const { statusCode, ok, body } = await httpClient
                .post('/api/products/addProduct')
                .send(prodProof)
                .attach('attach', user.thumbnail)
                assert.ok(ok, 'The request was not successfully')
                assert.deepStrictEqual(statusCode, 201, 'The status code is wrong')
                assert.deepStrictEqual(body.object, prodProof, 'The expected product was not equal to the real')
            })
        })
    })

    describe('PUT to Endpoint: /api/products/:pid', () => {
        describe('Should update a product when the product ID is provided and valid data is sent to update it', () => {
            it('Update product being admin user', async () => {
                const newProduct = generatorProductsMock.createProductMock()
                const product = await ProductsDbDAO.creaeteElement(newProduct)
                const updatedProduct = { ...product._doc, title: 'New Title' }
                const pid = String(updatedProduct._id)
                console.log(JSON.stringify(updatedProduct._id))

                const { statusCode, ok, body } = await httpClient
                .put(`/api/products/${pid}`)
                .send(updatedProduct)
                assert.ok(ok, 'The request was not successfully')
                assert.strictEqual(statusCode, 200, 'The status code is wrong')
                assert.strictEqual(body.status, 'success')
                assert.strictEqual(body.object.acknowledged, true)
            })
        })

        describe('The product should not be updated even providing the id and sending all the correct information', () => {
            it('Logout', async () => {
                await httpClient
                .post('/api/session/logout')
            })
            it('Login', async () => {
                await mongoose.connection.collection('users').deleteMany({})
                const newUser = generatorUserMock.createUserMockWithEmptyCart()
                await UsersDAODb.creaeteElement({ ...newUser, role: 'Premium' })
                const userCredentials = { email: newUser.email, password: 'mypassword123.' }
                await httpClient
                .post('/api/session/login')
                .send(userCredentials)
            })
            it('Update product being Premium user but not owning', async () => {
                const newProduct = generatorProductsMock.createProductMock()
                const product = await ProductsDbDAO.creaeteElement(newProduct)
                const updatedProduct = { ...product._doc, owner: 'other@gmail.com' }
                const pid = String(updatedProduct._id)

                const { statusCode } = await httpClient
                .put(`/api/products/${pid}`)
                .send(updatedProduct)
                assert.strictEqual(statusCode, 401)
            })
        })
    })
})
