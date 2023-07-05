import errors from '../../lib/customErrors.js'
import { UserEmail, UserPassword } from './values.user.js'

export class User {
    #_id
    #firstName
    #lastName
    #email
    #age
    #password
    #cart
    #role
    #orders
    #documents
    #lastConnection
    #regexNames = /^[a-zA-Z]+$/
    #regexAge = /^(0?[1-9]|[1-9][0-9]|[1][01][0-9]|100)$/

    constructor ({ _id = null, firstName, lastName, email, age, password, cart = [], role = 'User' }) {
        this._id = _id
        this.firstName = firstName
        this.lastName = lastName
        this.username = `${firstName} ${lastName}`
        this.email = email
        this.age = age
        this.password = password
        this.cart = cart
        this.role = role
        this.orders = []
        this.documents = []
        this.lastConnection = `${new Date().toLocaleDateString()} | ${new Date().toLocaleTimeString()}`
    }

    get _id () { return this.#_id }
    get firstName () { return this.#firstName }
    get lastName () { return this.#lastName }
    get email () { return this.#email }
    get age () { return this.#age }
    get password () { return this.#password }
    get cart () { return this.#cart }
    get role () { return this.#role }
    get orders () { return this.#orders }
    get documents () { return this.#documents }
    get lastConnection () { return this.#lastConnection }

    ensureValueIsDefined (value) {
        if (typeof value !== 'string' || value === null || value === '') {
            throw errors.invalid_input.withDetails(`${value} is an invalid argument`)
        }
    }

    throwArgumentError (value, propertyName) {
        throw errors.invalid_input.withDetails(`${value} is an invalid argument for the ${propertyName} field`)
    }

    capitalizeName (value) {
        const name = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
        return String(name)
    }

    set _id (value) {
        this.#_id = value
    }

    set firstName (value) {
        this.ensureValueIsDefined(value)
        if (!this.#regexNames.test(value)) this.throwArgumentError(value, 'firstName')
        this.#firstName = this.capitalizeName(value)
    }

    set lastName (value) {
        this.ensureValueIsDefined(value)
        if (!this.#regexNames.test(value)) this.throwArgumentError(value, 'lastName')
        this.#lastName = this.capitalizeName(value)
    }

    set email (value) {
        const email = new UserEmail(value)
        this.#email = email.toString()
    }

    set age (value) {
        this.ensureValueIsDefined(value)
        if (!this.#regexAge.test(value)) this.throwArgumentError(value, 'age')
        this.#age = value
    }

    set password (value) {
        const password = new UserPassword(value)
        this.#password = password.getPassword()
    }

    set cart (value) {
        this.#cart = value
    }

    set role (value) {
        this.ensureValueIsDefined(value)
        const roles = ['Admin', 'User', 'Premium']
        if (!roles.includes(value)) {
            throw errors.invalid_permission.withDetails(`${value} is not a valid Role`)
        }
        this.#role = value
    }

    set orders (value) {
        this.#orders = value
    }

    set documents (value) {
        this.#documents = value
    }

    set lastConnection (value) {
        this.#lastConnection = value
    }

    toDto () {
        return {
            username: this.username,
            _id: this.#_id,
            firstName: this.#firstName,
            lastName: this.#lastName,
            email: this.#email,
            age: this.#age,
            password: this.#password,
            cart: this.#cart,
            role: this.#role,
            orders: this.#orders,
            documents: this.#documents,
            lastConnection: this.#lastConnection
        }
    }
}
