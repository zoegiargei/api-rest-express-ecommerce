import mongoose from 'mongoose'

const ticketCollection = 'Tickets'

const ticketSchema = new mongoose.Schema({
    code: { type: String, required: true },
    purchase_datetime: { type: String, required: true },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true }
}, { versionKey: false })

const ticketModel = mongoose.model(ticketCollection, ticketSchema)
export default ticketModel
