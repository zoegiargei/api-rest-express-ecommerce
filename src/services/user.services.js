import errors from '../lib/customErrors.js'
import { User } from '../models/User/User.js'
import { userRepository } from '../DAO/repositories/user.repository.js'
import userDaoMongo from '../DAO/mongo/user.dao.mongo.js'
import encryptedPass from '../utils/password/encrypted.pass.js'
import cartServices from './cart.services.js'
import config from '../../config.js'
import userDaoMemory from '../DAO/memory/user.dao.memory.js'

class UserServices {
    constructor (repository, dao) {
        this.userRepository = repository
        this.userDao = dao
    }

    async saveUser (data) {
        await cartServices.createCart(data.email)
        const cid = await cartServices.getLastOne()

        const userData = { ...data, cart: cid }
        if (config.NODE_ENV === 'dev') userData._id = '1234'
        const newUser = new User(userData)
        const userAsDto = newUser.toDto()
        if (userAsDto._id === null) {
            delete userAsDto._id
        }
        const response = this.userRepository.saveDtoInDB(userAsDto)
        return response
    }

    async getUserById (id) {
        const user = await this.userDao.findElementById(id)
        if (user === {} || user === undefined || user === null) throw errors.not_found.withDetails('User not found')
        return user
    }

    async getUserByQuery (query) {
        return await this.userDao.findElementsByQuery(query)
    }

    async getUsers () {
        return await this.userDao.findElements()
    }

    async getAField (param1, param2) {
        return await this.userDao.findElementByProjection(param1, param2)
    }

    async updateUser (id, newValues) {
        return await this.userDao.updateElement(id, newValues)
    }

    async updatePassword (id, currentPass, newPass) {
        const user = await this.userDao.findElementById(id)

        const isValidCurrentPassword = encryptedPass.isValidPassword(user.password, currentPass)
        if (isValidCurrentPassword === false) throw errors.authentication_failed.withDetails('The current password is wrong')

        const isValidNewPassword = encryptedPass.isValidPassword(user.password, newPass)
        if (isValidNewPassword) throw errors.invalid_input.withDetails('The new password cannot be equal to the current password')

        const rehydratedUser = this.userRepository.getRehydratedElement(null, user)
        rehydratedUser.password = newPass
        const userDto = rehydratedUser.toDto()
        const response = this.userDao.updateElement(id, userDto)
        return response
    }

    async updateLastConnection (uid) {
        const newTime = { lastConnection: `${new Date().toLocaleDateString()} | ${new Date().toLocaleTimeString()}` }
        const response = this.userDao.updateElement(uid, newTime)
        return response
    }

    async deleteUser (id) {
        const user = this.userDao.findElementById(id)
        const cid = user.cart._id
        await cartServices.deleteCart(cid)
        return await this.userDao.deleteElement(id)
    }
}
let userServices
if (config.NODE_ENV === 'dev') {
    userServices = new UserServices(userRepository, userDaoMemory)
} else {
    userServices = new UserServices(userRepository, userDaoMongo)
}
export default userServices
