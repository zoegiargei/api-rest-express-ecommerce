import errors from '../../lib/customErrors.js'
import userServices from '../../services/user.services.js'

export async function handlerShowRegister (req, res, next) {
    try {
        res.render('Register', { title: 'Register', loggedin: null, quantity: null, admin: null })
    } catch (error) {
        next(error)
    }
}

export async function handlerShowUsers (req, res, next) {
    try {
        const result = await userServices.getUsersByProjection({}, { _id: 1, username: 1, email: 1, role: 1, lastConnection: 1 })
        if (!result) throw errors.not_found.withDetails('Users not found')
        const dataCart = req.quantity
        res.render('users', { title: 'Users', loggedin: req.user, quantity: dataCart, admin: req.admin, thAreUsers: result.length, users: result, allowedProtoMethods: true })
    } catch (error) {
        next(error)
    }
}

export async function handlerShowProfile (req, res, next) {
    try {
        const dataUser = req.user
        const dataCart = req.quantity
        const thIsDocuments = dataUser.documents?.length > 0 ? dataUser.document : false
        res.render('profile', { title: 'Profile', loggedin: dataUser, quantity: dataCart, admin: req.admin, user: dataUser, document: thIsDocuments })
    } catch (error) {
        next(error)
    }
}

export async function handlerShowUpdatePassword (req, res, next) {
    try {
        const dataUser = req.user
        const dataCart = req.quantity
        res.render('updatePassword', { title: 'Update password', loggedin: dataUser.length > 0, quantity: dataCart, admin: req.admin, user: dataUser })
    } catch (error) {
        next(error)
    }
}
