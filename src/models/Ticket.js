import { v4 as uuidv4 } from 'uuid'
import errors from '../lib/customErrors.js'

class Ticket {
    #purchaser
    #regexEmail = /^([a-zA-Z0-9._-]+)@(gmail|hotmail|coder)\.com$/

    constructor (amount, purchaser) {
        this.code = this.generateCode()
        this.purchase_datetime = String(this.generateDatetime())
        this.amount = Number(amount)
        this.purchaser = String(purchaser)
    }

    get purchaser () { return this.#purchaser }
    set purchaser (value) {
        if (!this.#regexEmail.test(value)) throw errors.invalid_input.withDetails('An email must be provided to generate the ticket.')
        this.#purchaser = value
    }

    generateCode () {
        return String(uuidv4())
    }

    generateDatetime () {
        const today = `${new Date().toLocaleDateString()} | ${new Date().toLocaleTimeString()}`
        return today
    }

    getTicket () {
        return {
            ...this,
            purchaser: this.#purchaser
        }
    }
}
export default Ticket
