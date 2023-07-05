import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
// import errors from '../../lib/customErrors.js'
import fs from 'fs'

class ConfigMulter {
    constructor () {
        this.storage = multer.diskStorage({
            destination: this.configDestination,
            filename: (req, file, cb) => {
                const newName = `${uuidv4()}-${file.originalname}`
                cb(null, newName)
            }
        })
    }

    async configDestination (req, file, cb) {
        const directory = file.fieldname
        await fs.promises.mkdir(`./public/${directory}`, { recursive: true })
        cb(null, `./public/${directory}`)
    }

    configUpload () {
        const upload = multer({
           storage: this.storage,
           fileFilter: function (req, file, cb) {
               const filetypes = /jpeg|jpg|png|gif/
               const mimetype = filetypes.test(file.mimetype)
               const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
               if (mimetype && extname) {
                   return cb(null, true)
               }
               // eslint-disable-next-line n/no-callback-literal
               cb('Error: File upload only supports the following filetypes - ' + filetypes, null)
           },
           limits: { fileSize: 1000000 }
       })

       return upload
    }
}

export default ConfigMulter
