import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const prodCollection = 'products'

const prodSchema = new mongoose.Schema({

    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: Boolean, default: true },
    stock: { type: Number, required: true },
    category: {
        type: String,
        index: true,
        required: true
    },
    thumbnail: {
        type: [{ type: Object, required: true, cast: false }],
        validate: {
            validator: value => Array.isArray(value) && value.length > 0,
            message: 'Array cannot be empty'
        }
    },
    owner: { type: String, required: true }
}, { versionKey: false })

prodSchema.plugin(mongoosePaginate)

const productModel = mongoose.models.products || mongoose.model(prodCollection, prodSchema)
export default productModel
