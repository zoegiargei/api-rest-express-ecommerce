import { User } from '../../models/User/User.js'
import userDaoMemory from '../memory/user.dao.memory.js'
import userDaoMongo from '../mongo/user.dao.mongo.js'
import Repository from './Repository.js'

let userDao
if (process.env.NODE_ENV === 'dev') {
    userDao = userDaoMemory
} else {
    userDao = userDaoMongo
}
export const userRepository = new Repository(userDao, User)
