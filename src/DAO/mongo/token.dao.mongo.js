import DAODb from './Dao.mongo.js'
import tokenModel from '../mongoSchemas/Token.model.js'
const tokenDaoMongo = new DAODb(tokenModel)
export default tokenDaoMongo
