import errors from '../../lib/customErrors.js'
import userServices from '../../services/user.services.js'
import Document from '../../models/Document.js'
import encryptedJWT from '../../utils/jwt/encrypted.jwt.js'
import emailService from '../../services/email.services.js'
import templatesForEmails from '../../utils/templates/templates.send.email.js'

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
        res.sendCreated({ message: 'successful user registration', object: req.user })
    } catch (error) {
        next(error)
    }
}

export async function handlerPostDocuments (req, res, next) {
    try {
        const files = req.files
        const uid = req.params.uid
        const docNames = Object.keys(files)
        const user = await userServices.getUserById(uid)

        docNames.forEach(fieldName => {
            const newDocument = new Document(fieldName, files[fieldName][0].filename, uid)
            const userDocuments = user.documents || []
            const existingIndex = userDocuments.findIndex(doc => doc.typeDoc === newDocument.typeDoc)
            if (existingIndex >= 0) {
                user.documents.splice(existingIndex, 1, newDocument)
            } else {
                if (userDocuments.length) {
                    user.documents.push(newDocument)
                } else {
                    user.documents = []
                    user.documents.push(newDocument)
                }
            }
        })
        userServices.updateUser(uid, user)
        res.sendCreated({ message: 'Upload successful', object: user })
    } catch (error) {
        next(error)
    }
}

export async function handlerComePremium (req, res, next) {
    try {
        const uid = req.params.uid
        const user = await userServices.getUserById(uid)

        const userDocuments = user.documents
        const hasAllDocuments = Object.values(DocumentTypes).every(type => {
            return userDocuments.some(doc => doc.typeDoc === type)
        })

        const canBePremium = hasAllDocuments

        if (user.role !== 'Premium') {
            if (canBePremium) {
                user.role = 'Premium'
                await userServices.updateUser(uid, user)
            } else {
                throw errors.invalid_permission.withDetails('The user must have all required documents')
            }
        } else {
            res.sendConflict({ message: 'The user is already Premium', object: user })
        }

        res.sendOk({ message: 'The user has been upgraded to Premium', object: { user, canBePremium } })
    } catch (error) {
        next(error)
    }
}

export async function handlerPostProfileImg (req, res, next) {
    try {
        const uid = req.params.uid
        const image = req.file
        const user = await userServices.getUserById(uid)
        if (image) {
            const profileImage = new Document('profileImage', req.file.filename, uid)
            const existingIndex = user.documents.findIndex(doc => doc.typeDoc === profileImage.typeDoc)
            if (existingIndex >= 0) {
                user.documents.splice(existingIndex, 1, profileImage)
            } else {
                user.documents.push(profileImage)
            }
        }
        userServices.updateUser(uid, user)
        res.sendCreated({ message: 'Upload successful', object: user })
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

export async function handlerPutPassword (req, res, next) {
    try {
        const uid = String(req.params.uid)
        const { currentPassword, newPassword } = req.body
        const result = await userServices.updatePassword(uid, currentPassword, newPassword)
        res.sendNoContent({ message: "The user's password was successfully updated", object: result })
    } catch (error) {
        next(error)
    }
}

export async function handlerDeleteUsers (req, res, next) {
    try {
        const date = new Date() // Obtiene la fecha actual
        date.setDate(date.getDate() - 2) // Resta dos días a la fecha actual
        // const dateQuery = date.toLocaleDateString()
        const dateQuery = '9/7/2023' // proof dateQuery

        const expiredUsers = await userServices.getUsersByProjection({ 'lastConnection.date': { $lt: dateQuery } }, { email: 1, lastConnection: 1 })
        const emails = expiredUsers.map(user => user.email)

        let result
        if (emails.length > 0) {
            emails.forEach(async em => {
                const message = templatesForEmails.templateSendExpiredAccount()
                const hardcodedEmail = 'zoegiargei00@gmail.com' // Must be email of user
                await emailService.send(hardcodedEmail, message, 'Your account was expired')
                result = await userServices.deleteUsersByQuery({ email: em })
            })
        }
        res.json({ expiredUsers, result })
    } catch (error) {
        next(error)
    }
}
