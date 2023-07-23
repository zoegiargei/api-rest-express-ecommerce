import DAODb from './Dao.mongo.js'
import userModel from '../mongoSchemas/User.model.js'
const userDaoMongo = new DAODb(userModel)
export default userDaoMongo
