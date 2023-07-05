import cartModel from '../mongoSchemas/Cart.model.js'
import DAODb from './dao.mongo.js'
const cartDaoMongo = new DAODb(cartModel)
export default cartDaoMongo
