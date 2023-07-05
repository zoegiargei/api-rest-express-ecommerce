import DAODb from './dao.mongo.js'
import productModel from '../mongoSchemas/Product.model.js'
const productsDaoMongo = new DAODb(productModel)
export default productsDaoMongo
