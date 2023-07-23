import dotenv from 'dotenv'
import { Command } from 'commander'

const program = new Command()

program
    .option('PERSISTENCE <persistence>', 'metodo de persistencia de datos', 'MONGO')
    .option('NODE_ENV <environment>', 'entorno en el que queremos correr el programa', 'prod')
    .option('PORT <port>', 'puerto del servidor', 8080)
    .option('MONGO_CNX_STR <url>', 'URL de conexion a la base de datos', 'mongodb+srv://zoegiargei00:215133@clusterecommerce.lb7hufo.mongodb.net/ecommerce?retryWrites=true&w=majority')
    .option('JWT_PRIVATE_KEY <key>', 'Private key para autenticacion con JWT', 'jwtprivatekey')
    .option('SECRET_WORD <secret>', 'Secret word for signing cookie', 'SECRET_WORD_COOKIES')
    .option('USER_NODEMAILER <user>', 'zoegiargei00@gmail.com')
    .option('PASS_NODEMAILER <password>', 'cbbqbmvrwwfcsnzg')
    .option('ACCOUNT_SID_TWILIO <sid>', 'AC1a9acb3282cbf37e634830923e450650')
    .option('AUTH_TOKEN_TWILIO <token>', 'ee461bb9e1d7819585359b3fca5a96fd')
    .option('PHONE_NUMBER_TWILIO <phone>', '+12542496693')
    .option('LEVEL_LOG <number>', 'Level of errors we want to see', 0)
    .option('HARDCODED_EMAIL <email>', 'Email that will be used for default information cases', 'zoegiargei00@gmail.com')
program.parse()

dotenv.config({
    path:
        process.env.NODE_ENV === 'test'
        ? '.env.test'
        : '.env'
})

export default {
    NODE_ENV: process.env.NODE_ENV,
    PERSISTENCE: process.env.PERSISTENCE,
    PORT: process.env.PORT,
    MONGO_CNX_STR: process.env.MONGO_CNX_STR,
    JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY,
    SECRET_WORD: process.env.SECRET_WORD,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    USER_NODEMAILER: process.env.USER_NODEMAILER,
    PASS_NODEMAILER: process.env.PASS_NODEMAILER,
    ACCOUNT_SID_TWILIO: process.env.ACCOUNT_SID_TWILIO,
    AUTH_TOKEN_TWILIO: process.env.AUTH_TOKEN_TWILIO,
    PHONE_NUMBER_TWILIO: process.env.PHONE_NUMBER_TWILIO,
    HARDCODED_EMAIL: process.env.HARDCODED_EMAIL
}
