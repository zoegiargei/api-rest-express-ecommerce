import errors from '../../lib/customErrors.js'
import encryptedPass from '../../utils/password/encrypted.pass.js'

export class UserEmail {
    #regexEmail = /^([a-zA-Z0-9._-]+)@(gmail|hotmail|coder)\.com$/
    constructor (value) {
        this.value = this.toLowerCase(value)

        this.#ensureValueIsDefined(value)
        this.#ensureValueIsValidEmail(value)
    }

    toLowerCase (value) {
        return String(value.toLowerCase())
    }

    #ensureValueIsDefined (value) {
        if (typeof value !== 'string' || value === null || value === '') {
            throw errors.invalid_input.withDetails('Email must be defined')
        }
    }

    #ensureValueIsValidEmail (value) {
        if (!this.#regexEmail.test(value)) {
            throw errors.invalid_input.withDetails(`${value} is not a valid Email`)
        }
    }

    equals (otherEmail) {
        return this.value === otherEmail
    }

    toString () {
        return String(this.value)
    }
}

export class UserPassword {
    #regexPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).+$/
    constructor (password) {
        this.password = password

        this.#ensureValueIsDefined(password)
        this.#ensureValueIsValidPassword(password)
    }

    #ensureValueIsDefined (value) {
        if (typeof value !== 'string' || value === null || value === '') {
            throw errors.invalid_input.withDetails('Password must be defined')
        }
    }

    #ensureValueIsValidPassword (value) {
        if (this.#regexPassword.test(value) === false) {
            throw errors.invalid_input.withDetails(`${value} is not a valid Password. Password Must contain at least one uppercase letter [A-Z]). Must contain at least one lowercase letter. Must contain at least one digit. Must contain at least one special character from the set. Must be at least 8 characters long`)
        }
    }

    getPassword () {
        return encryptedPass.createHash(this.password)
    }
}

/*
    Password:
    Must contain at least one uppercase letter ((?=.*[A-Z])).
    Must contain at least one lowercase letter ((?=.*[a-z])).
    Must contain at least one digit ((?=.*\d)).
    Must contain at least one special character from the set @$!%*?& ((?=.*[@$!%*?&])).
    Must be at least 8 characters long ({8,}).
*/
