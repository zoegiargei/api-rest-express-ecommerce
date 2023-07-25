import { createTransport } from 'nodemailer'
import errors from '../lib/customErrors.js'

class EmailsService {
    constructor (userNodemailer, passNodemailer) {
        this.clientNodemailer = createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: userNodemailer,
                pass: passNodemailer
            }
        })
    }

    async send (addressee, messsage, descriptionSubject = 'Inform') {
        const mailOptions = {
            from: 'server-app-zoegiargei',
            to: addressee,
            subject: descriptionSubject,
            html: messsage
        }

        try {
            const data = await this.clientNodemailer.sendMail(mailOptions)
            return (data)
        } catch (error) {
            console.log(error)
            throw errors.internal_error.withDetails('Something was wrong in nodemailer service')
        }
    }
}
const user = process.env.USER_NODEMAILER || 'zoegiargei00@gmail.com'
const pass = process.env.PASS_NODEMAILER || 'cbbqbmvrwwfcsnzg'
const emailService = new EmailsService(user, pass)
export default emailService
