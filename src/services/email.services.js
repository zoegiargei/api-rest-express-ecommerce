import { createTransport } from 'nodemailer'
import config from '../../config.js'
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
console.log(config.USER_NODEMAILER)
console.log(config.PASS_NODEMAILER)
const emailService = new EmailsService(config.USER_NODEMAILER, config.PASS_NODEMAILER)
export default emailService
