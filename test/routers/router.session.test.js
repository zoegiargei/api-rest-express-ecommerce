import assert from 'assert'
import supertest from 'supertest'
import mongoose from 'mongoose'
import { after, afterEach, before, beforeEach, describe, it } from 'mocha'
import generatorUserMock from '../../mocks/utils/mocks/generator.user.mock.js'
import UsersDAODb from '../../src/DAO/DB_DAOs/Users.DAO.db.js'
import config from '../../config.js'

const PORT = 8080
const serverBaseUrl = `http://localhost:${PORT}`
const httpClient = supertest.agent(serverBaseUrl)
const MONGO_CNX_STR_TEST = config.MONGO_CNX_STR

describe('Testing router session', () => {
    before(async () => {
        await mongoose.connect(MONGO_CNX_STR_TEST)
    })
    beforeEach(async () => {
        if (mongoose.connection.collection('carts')) await mongoose.connection.collection('carts').deleteMany({})
    })
    afterEach(async () => {
        await mongoose.connection.collection('carts').deleteMany({})
    })
    after(async () => {
        await mongoose.connection.collection('users').deleteMany({})
        await mongoose.disconnect()
    })

    describe('Enpoints', async () => {
        describe('POST to Endpoint: /api/session/login', () => {
            describe('Should authenticate a user if the correct credentials are sent', () => {
                it('The correct credentials are sent and the user is authenticated', async () => {
                    const newUser = generatorUserMock.createUserMockWithEmptyCart()
                    await UsersDAODb.creaeteElement(newUser)
                    const userCredentials = { email: newUser.email, password: 'mypassword123.' }
                    const { statusCode, body, headers } = await httpClient
                    .post('/api/session/login')
                    .send(userCredentials)
                    assert.deepEqual(body.status, 'success', 'The status is not success')
                    assert.ok(headers['set-cookie'][0], 'There is not a cookie with the authorized token')
                    assert.deepStrictEqual(statusCode, 202)
                })
            })

            describe('Should not authenticate the user if one of the credentials are wrong', () => {
                it('One of the credentials is sent wrong and the user is not authenticated', async () => {
                    // assert.throws(() => {}, 'expectedError')
                    const newUser = generatorUserMock.createUserMockWithEmptyCart()
                    await UsersDAODb.creaeteElement(newUser)
                    const userCredentials = { email: newUser.email, password: 'mypasswordWRONG' }
                    const { statusCode, headers } = await httpClient
                    .post('/api/session/login')
                    .send(userCredentials)
                    assert.ok(!(headers['set-cookie']), 'There is a cookie with the authorized token')
                    assert.strictEqual(statusCode, 407)
                })
            })
        })

        describe('POST to Endpoint: /api/session/logout', () => {
            describe('Should log out the user if the user was successfully authenticated', () => {
                it('The correct credentials are sent and the user is authenticated and then the user is log out', async () => {
                    const { statusCode, body } = await httpClient
                    .post('/api/session/logout')
                    console.log(body)
                    assert.strictEqual(statusCode, 200)
                })
            })
        })
    })
})
