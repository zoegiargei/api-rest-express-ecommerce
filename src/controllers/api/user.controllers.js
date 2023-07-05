import errors from '../../lib/customErrors.js'
import userServices from '../../services/user.services.js'
import Document from '../../models/Document.js'
import encryptedJWT from '../../utils/jwt/encrypted.jwt.js'

const DocumentTypes = {
    IDENTIFICACION: 'identificacion',
    COMP_DOMICILIO: 'compDomicilio',
    COMP_ESTADO_CUENTA: 'compEstadoCuenta'
}

export async function handlerPostUser (req, res, next) {
    try {
        const dataUser = req.body
        const response = await userServices.saveUser(dataUser)
        res.status(201).json({ response })
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
        res.status(201).json({ message: 'Successfully registration', object: req.user })
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
            const userDocuments = user.documents
            const existingIndex = userDocuments.findIndex(doc => doc.typeDoc === newDocument.typeDoc)
            if (existingIndex >= 0) {
                user.documents.splice(existingIndex, 1, newDocument)
            } else {
                user.documents.push(newDocument)
            }
        })
        userServices.updateUser(uid, user)
        res.json({ user })
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
            res.json({ message: 'You are Premium user' })
        }

        res.json({ canBePremium, user })
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
        res.json({ image, user })
    } catch (error) {
        next(error)
    }
}

export async function handlerGetUser (req, res, next) {
    try {
        const uid = String(req.params.uid)
        const response = await userServices.getUserById(uid)
        res.json({ response })
    } catch (error) {
        next(error)
    }
}

export async function handlerPutLastConnection (req, res, next) {
    try {
        const uid = String(req.params.uid)
        const response = await userServices.updateLastConnection(uid)
        res.json({ response })
    } catch (error) {
        next(error)
    }
}

export async function handlerPutPassword (req, res, next) {
    try {
        const uid = String(req.params.uid)
        const { currentPassword, newPassword } = req.body
        const response = await userServices.updatePassword(uid, currentPassword, newPassword)
        res.json({ response })
    } catch (error) {
        next(error)
    }
}
