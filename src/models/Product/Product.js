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
    #regexEmail = /^([a-zA-Z0-9._-]+)@(gmail|hotmail|coder)\.com$/
    #regexStock = /^(1?[1-9]|[1-9][0-9]|[1][01][0-9]|100)$/
    #regexAlphanumeric = /^[a-zA-Z0-9]+$/

    constructor ({ _id = null, title, description, code, price, status = true, stock, category, thumbnail = [], owner }) {
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

    ensureValueIsDefined (field, value) {
        if (typeof value !== 'string' || value === null || value === '') {
            this.throwArgumentError(field, value)
        }
    }

    ensureNumberIsDefinded (field, value) {
        const num = Number(value)
        if (isNaN(num) || num === null || num === '') {
            this.throwArgumentError(field, value)
        }
    }

    capitalizeName (value) {
        const name = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
        return String(name)
    }

    throwArgumentError (field, value) {
        throw errors.invalid_input.withDetails(`${value} is an invalid argument for field ${field}`)
    }

    set _id (value) {
        this.#_id = value
    }

    set title (value) {
        this.ensureValueIsDefined('title', value)
        this.#title = this.capitalizeName(value)
    }

    set description (value) {
        this.ensureValueIsDefined('description', value)
        this.#description = value
    }

    set code (value) {
        this.#regexAlphanumeric.test(value)
        this.#code = value
    }

    set price (value) {
        this.ensureNumberIsDefinded('Price', value)
        this.#price = Number(value)
    }

    set status (value) {
        const bool = Boolean(value)
        if (typeof bool !== 'boolean') this.throwArgumentError('status', bool)
        this.#status = bool
    }

    set stock (value) {
        if (!this.#regexStock.test(value)) this.throwArgumentError('stock', value)
        this.#stock = Number(value)
    }

    set category (value) {
        this.ensureValueIsDefined('category', value)
        this.#category = value
    }

    set thumbnail (value) {
        if (typeof value !== 'object') this.throwArgumentError('thumbnail', value)
        this.#thumbnail = value
    }

    set owner (value) {
        const email = value.toLowerCase()
        if (!this.#regexEmail.test(email)) this.throwArgumentError('owner', email)
        this.#owner = email
    }

    toDto () {
        return {
            _id: this.#_id,
            title: this.#title,
            description: this.#description,
            code: this.#code,
            price: Number(this.#price),
            status: Boolean(this.#status),
            stock: Number(this.#stock),
            category: this.#category,
            thumbnail: this.#thumbnail,
            owner: this.#owner
        }
    }
}
