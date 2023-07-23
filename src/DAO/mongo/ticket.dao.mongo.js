import DAODb from './Dao.mongo.js'
import ticketModel from '../mongoSchemas/Ticket.model.js'
const ticketDaoMongo = new DAODb(ticketModel)
export default ticketDaoMongo
