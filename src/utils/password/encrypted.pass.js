import bcrypt from 'bcrypt'

const saltRounds = 10
class EncryptedPass {
    createHash (password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(saltRounds))
    }

    isValidPassword (userPassword, password) {
        return bcrypt.compareSync(password, userPassword)
    }
}
const encryptedPass = new EncryptedPass()
export default encryptedPass
