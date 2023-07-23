import userServices from '../../services/user.services.js'
import encryptedJWT from '../../utils/jwt/encrypted.jwt.js'

const DocumentTypes = {
    IDENTIFICATION: 'identification',
    PROOF_OF_ADDRESS: 'proofAddress',
    STATEMENT_OF_ACCOUNT: 'statementAccount'
}

export async function handlerPostUser (req, res, next) {
    try {
        const dataUser = req.body
        const result = await userServices.saveUser(dataUser)
        res.sendCreated({ message: 'User created successfully', object: result })
    } catch (error) {
        next(error)
    }
}

export async function handlerRegister (req, res, next) {
    try {
        const ttl = '2h'
        res.cookie('jwt_authorization', encryptedJWT.encryptData(req.user, ttl), {
            signed: true,
            httpOnly: true
        })
        const userToShow = req.user
        delete userToShow.password
        res.sendCreated({ message: 'successful user registration', object: userToShow })
    } catch (error) {
        next(error)
    }
}

export async function handlerPostDocuments (req, res, next) {
    try {
        const files = req.files
        const uid = req.params.uid
        const result = await userServices.addUserDocuments(files, uid)
        res.sendCreated({ message: 'Upload successful', object: result })
    } catch (error) {
        next(error)
    }
}

export async function handlerConvertToPremium (req, res, next) {
    try {
        const uid = req.params.uid
        const result = await userServices.convertToPremium(uid, DocumentTypes)
        res.sendOk({ message: 'The user has been upgraded to Premium', object: result })
    } catch (error) {
        next(error)
    }
}

export async function handlerPostProfileImg (req, res, next) {
    try {
        const uid = req.user._id
        const image = req.file
        const result = await userServices.addProfileImage(uid, image)
        res.sendCreated({ message: 'Upload successful', object: result })
    } catch (error) {
        next(error)
    }
}

export async function handlerGetUsers (req, res, next) {
    try {
        const result = await userServices.getUsersByProjection({}, { _id: 1, username: 1, email: 1, role: 1, lastConnection: 1 })
        res.sendOk({ message: 'Users found successfully', object: result })
    } catch (error) {
        next(error)
    }
}

export async function handlerGetUser (req, res, next) {
    try {
        const uid = String(req.params.uid)
        const result = await userServices.getUserById(uid)
        res.sendOk({ message: 'User found successfully', object: result })
    } catch (error) {
        next(error)
    }
}

export async function handlerPutLastConnection (req, res, next) {
    try {
        const uid = String(req.params.uid)
        const result = await userServices.updateLastConnection(uid)
        res.sendNoContent({ message: 'Last connection data of the user was updated', object: result })
    } catch (error) {
        next(error)
    }
}

export async function handlerDeleteUsers (req, res, next) {
    try {
        const result = await userServices.deleteOldUsers()
        res.json({ result })
    } catch (error) {
        next(error)
    }
}

export async function handlerUpdatePassFirstStep (req, res, next) {
    try {
        const uid = req.user._id
        let result
        if (req.params.web) {
            result = await userServices.sendEmailToUpdatePass(uid, true)
        } else {
            result = await userServices.sendEmailToUpdatePass(uid, false)
        }
        res.sendOk({ message: 'Email to reset password sent successfully', object: result })
    } catch (error) {
        next(error)
    }
}

export async function handlerPutPassword (req, res, next) {
    try {
        const uid = req.user._id
        console.log(req.body)
        const { currentPassword, newPassword } = req.body
        const result = await userServices.updatePassword(uid, currentPassword, newPassword)
        res.sendCreated({ message: "The user's password was successfully updated", object: result })
    } catch (error) {
        next(error)
    }
}

export async function handlerDeleteUser (req, res, next) {
    try {
        const uid = req.params.uid
        const result = await userServices.deleteUser(uid)
        res.sendOk({ message: 'User deleted successfully', object: result })
    } catch (error) {
        next(error)
    }
}

export async function handlerUpdateRole (req, res, next) {
    try {
        const uid = req.params.uid
        const user = await userServices.getUserById(uid)
        const newRole = req.body.role
        user.role = newRole
        const result = await userServices.updateUser(uid, user)
        res.sendOk({ message: 'User updated successfully', object: result })
    } catch (error) {
        next(error)
    }
}
