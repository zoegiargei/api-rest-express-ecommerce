import errors from '../../lib/customErrors.js'

class Cart {
    #userEmail
    #regexEmail = /^([a-zA-Z0-9._-]+)@(gmail|hotmail|coder)\.com$/

    constructor (userEmail) {
        this.productsCart = []
        this.userEmail = userEmail
    }

    get userEmail () { return this.#userEmail }
    set userEmail (value) {
        if (!this.#regexEmail.test(value)) errors.invalid_input.withDetails('All carts must have an email associated with an existing user.')
        this.#userEmail = value
    }

    toDto () {
        return {
            productsCart: this.productsCart,
            userEmail: this.#userEmail
        }
    }
}
export default Cart
