import encryptedJWT from '../../utils/jwt/encrypted.jwt.js'

export async function handlerPostAuth (req, res, next) {
    try {
        const payload = req.user
        const ttl = '2h'
        res.cookie('jwt_authorization', encryptedJWT.encryptData(payload, ttl), {
            signed: true,
            httpOnly: true
        })
        const userToShow = req.user
        delete userToShow.password
        res.sendAccepted({ message: 'User successfully logged in', object: userToShow })
    } catch (error) {
        next(error)
    }
}

export async function handlerPostLogout (req, res, next) {
    try {
        res.clearCookie('jwt_authorization', {
            signed: true,
            httpOnly: true
        })
        res.sendOk({ message: 'Successfully Logout', object: req.user })
    } catch (error) {
        next(error)
    }
}
