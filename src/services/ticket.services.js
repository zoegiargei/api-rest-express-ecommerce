import config from '../../config.js'
import ticketDaoMemory from '../DAO/memory/ticket.dao.memory.js'
import ticketDaoMongo from '../DAO/mongo/ticket.dao.mongo.js'
import Ticket from '../models/Ticket.js'

class TicketServices {
    constructor (ticketDAO) {
        this.ticketDAO = ticketDAO
    }

    async generateTicket (total, email) {
        const ticket = new Ticket(total, email)
        return ticket
    }

    async saveTicket (ticket) {
        const dtoTicket = ticket.getTicket()
        return await this.ticketDAO.createElement(dtoTicket)
    }

    async getLastCreatedTicket () {
        return await this.ticketDAO.findTheLastOne()
    }

    async cancelTicket (id) {
        return await this.ticketDAO.deleteElement(id)
    }
}

let ticketServices
if (config.NODE_ENV === 'dev') {
    ticketServices = new TicketServices(ticketDaoMemory)
} else {
    ticketServices = new TicketServices(ticketDaoMongo)
}
export default ticketServices
