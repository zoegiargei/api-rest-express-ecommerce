import errors from '../../lib/customErrors.js'

export class Product {
    #_id
    #title
    #description
    #code
    #price
    #status
    #stock
    #category
    #thumbnail
    #owner
    #regexEmail = /^([a-zA-Z0-9._-]+)@(gmail|hotmail)\.com$/
    #regexStock = /^(1?[1-9]|[1-9][0-9]|[1][01][0-9]|100)$/

    constructor ({ _id = null, title, description, code, price, status = true, stock, category, thumbnail = [], owner = 'Admin' }) {
        this._id = _id
        this.title = title
        this.description = description
        this.code = code
        this.price = price
        this.status = status
        this.stock = stock
        this.category = category
        this.thumbnail = thumbnail
        this.owner = owner
    }

    get _id () { return this.#_id }
    get title () { return this.#title }
    get description () { return this.#description }
    get code () { return this.#code }
    get price () { return this.#price }
    get status () { return this.#status }
    get stock () { return this.#stock }
    get category () { return this.#category }
    get thumbnail () { return this.#thumbnail }
    get owner () { return this.#owner }

    ensureValueIsDefined (value) {
        if (typeof value !== 'string' || value === null || value === '') {
            throw errors.invalid_input.withDetails(`${value} is an invalid argument`)
        }
    }

    ensurePriceIsDefinded (value) {
        if (isNaN(value) || value === null || value === '') {
            throw errors.invalid_input.withDetails(`${value} is an invalid Price`)
        }
    }

    capitalizeName (value) {
        const name = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
        return String(name)
    }

    throwArgumentError (value, propertyName) {
        throw errors.invalid_input.withDetails(`${value} is an invalid argument for the ${propertyName} field`)
    }

    set _id (value) {
        this.#_id = value
    }

    set title (value) {
        this.ensureValueIsDefined(value)
        this.#title = this.capitalizeName(value)
    }

    set description (value) {
        this.ensureValueIsDefined(value)
        this.#description = value
    }

    set code (value) {
        this.ensureValueIsDefined(value)
        this.#code = value
    }

    set price (value) {
        this.ensurePriceIsDefinded(value)
        this.#price = value
    }

    set status (value) {
        if (typeof value !== 'boolean') this.throwArgumentError(value, 'status')
        this.#status = value
    }

    set stock (value) {
        if (!this.#regexStock.test(value)) this.throwArgumentError(value, 'stock')
        this.#stock = value
    }

    set category (value) {
        this.#category = value
    }

    set thumbnail (value) {
        if (typeof value !== 'object') this.throwArgumentError(value, 'thumbnail')
        this.#thumbnail = value
    }

    set owner (value) {
        if (!this.#regexEmail.test(value)) this.throwArgumentError(value, 'owner')
        this.#owner = value
    }

    toDto () {
        return {
            _id: this.#_id,
            title: this.#title,
            description: this.#description,
            code: this.#code,
            price: this.#price,
            status: this.#status,
            stock: this.#stock,
            category: this.#category,
            thumbnail: this.#thumbnail,
            owner: this.#owner
        }
    }
}
