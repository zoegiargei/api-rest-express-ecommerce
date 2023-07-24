import winston, { format } from 'winston'

let transports
// eslint-disable-next-line no-unused-vars
const levels = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    http: 4,
    debug: 5
}
const colors = {
    fatal: 'red',
    error: 'red',
    warn: 'magenta',
    info: 'green',
    http: 'cyan',
    debug: 'black'
}

winston.addColors(colors)

const myFormat = format.printf(({ level, message, timestamp }) => {
    timestamp = new Date().toLocaleTimeString()
    const newMessage = JSON.stringify(message)
    return `${timestamp} ${level}: ${newMessage}`
})

if (process.env.NODE_ENV === 'debug') {
    transports = [
        new winston.transports.Console({
            level: 'debug'
        })
    ]
} else if (process.env.NODE_ENV === 'dev') {
    transports = [
        new winston.transports.Console({
            level: 'warn'
        })
    ]
} else if (process.env.NODE_ENV === 'test') {
    transports = [
        new winston.transports.Console({
            level: 'error'
        }),
        new winston.transports.File({
            level: 'fatal',
            filename: 'error.log.envTest'
        })
    ]
} else if (process.env.NODE_ENV === 'prod') {
    transports = [
        new winston.transports.File({
            level: 'fatal',
            filename: 'fatal.log.envProd'
        }),
        new winston.transports.File({
            level: 'error',
            filename: 'error.log.envProd'
        })
    ]
}

export const winstonLogger = winston.createLogger({
    levels,
    format: format.combine(
        format.colorize(),
        format.timestamp(),
        myFormat
    ),
    transports
})

export const logger = (req, res, next) => {
    // winstonLogger.fatal(`${req.method} on ${req.url}`)
    console.dir((`${req.method} on ${req.url}`))
    req.logger = winstonLogger
    next()
}
