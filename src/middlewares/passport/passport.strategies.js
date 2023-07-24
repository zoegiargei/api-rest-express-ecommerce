/* eslint-disable object-shorthand */
/* eslint-disable camelcase */
import passport from 'passport'
import userServices from '../../services/user.services.js'
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'
import { Strategy as LocalStrategy } from 'passport-local'
import encryptedPass from '../../utils/password/encrypted.pass.js'
import cartServices from '../../services/cart.services.js'
import errors from '../../lib/customErrors.js'
import { JWT_PRIVATE_KEY } from '../../configs/auth.config.js'

passport.use('register', new LocalStrategy({ passReqToCallback: true, usernameField: 'email' }, async (req, _u, _p, done) => {
    const { firstName, lastName, email, age, password, role } = req.body

    const exist = await userServices.getUserByQuery({ email: email })
    if (exist.length > 0) throw errors.invalid_input.withDetails('Email already exist')

    const user = await userServices.saveUser({ firstName, lastName, email, age, password, role })
    done(null, user)
}))

passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL
        const adminPassword = process.env.ADMIN_PASSWORD
        if (username === adminEmail && password === adminPassword) {
            const exist = await cartServices.getCartByQuery({ userEmail: adminEmail })
            console.log(exist)
            let cid
            if (exist.length > 0) {
                cid = exist[0]
            } else {
                await cartServices.createCart(username)
                cid = await cartServices.getLastOne()
            }

            const userAdmin = {
                username: 'User Admin',
                email: 'adminCoder@coder.com',
                cart: [cid],
                role: 'Admin'
            }

            return done(null, userAdmin)
        }

        const user = await userServices.getUserByEmail(username)
        console.log(user)
        if (!user || user.length === 0) throw errors.invalid_auth.withDetails('One of the credentials is wrong')

        const isValidatePassword = encryptedPass.isValidPassword(user.password, password)
        if (isValidatePassword === false) throw errors.invalid_auth.withDetails('One of the credentials is wrong')
        const userToSend = user
        done(null, userToSend)
    } catch (error) {
        done(error, null)
    }
}))

// JWT
passport.use('jwt', new JwtStrategy({

    jwtFromRequest: ExtractJwt.fromExtractors([
        function (req) {
            let token = null
            if (req && req.signedCookies) {
                token = req.signedCookies.jwt_authorization
            }
            return token
        }
    ]),
    secretOrKey: JWT_PRIVATE_KEY

}, async (jwt_payload, done) => {
    try {
        done(null, jwt_payload)
    } catch (error) {
        done(error)
    }
}))

export const passportInitialize = passport.initialize()

export const registerAuthentication = passport.authenticate('register', { session: false, failWithError: true })
export const loginAuthentication = passport.authenticate('login', { session: false, failWithError: true })
