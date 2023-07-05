import { v4 as uuidv4 } from 'uuid'
import errors from '../lib/customErrors.js'

class Ticket {
    #purcharser
    #regexEmail = /^([a-zA-Z0-9._-]+)@(gmail|hotmail)\.com$/

    constructor (amount, purchaser) {
        this.code = this.generateCode()
        this.purchase_datetime = this.generateDatetime()
        this.amount = amount
        this.purchaser = purchaser
    }

    get purchaser () { return this.#purcharser }
    set purchaser (value) {
        if (!this.#regexEmail.test(value)) throw errors.invalid_input.withDetails('An email must be provided to generate the ticket.')
        this.#purcharser = value
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
            purcharser: this.#purcharser
        }
    }
}
export default Ticket
