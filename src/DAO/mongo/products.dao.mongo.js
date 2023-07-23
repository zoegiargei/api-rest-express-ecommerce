import DAODb from './Dao.mongo.js'
import productModel from '../mongoSchemas/Product.model.js'
const productsDaoMongo = new DAODb(productModel)
export default productsDaoMongo
