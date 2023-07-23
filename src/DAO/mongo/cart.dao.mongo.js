import cartModel from '../mongoSchemas/Cart.model.js'
import DAODb from './Dao.mongo.js'
const cartDaoMongo = new DAODb(cartModel)
export default cartDaoMongo
