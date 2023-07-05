import config from '../../../config.js'
import { User } from '../../models/User/User.js'
import userDaoMemory from '../memory/user.dao.memory.js'
import userDaoMongo from '../mongo/user.dao.mongo.js'
import Repository from './repository.js'

let userDao
if (config.NODE_ENV === 'dev') {
    userDao = userDaoMemory
} else {
    userDao = userDaoMongo
}
export const userRepository = new Repository(userDao, User)
