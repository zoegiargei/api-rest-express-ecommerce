import { faker } from '@faker-js/faker'
import { User } from '../src/models/User/User.js'
import { Product } from '../src/models/Product/Product.js'
import productsDaoMongo from '../src/DAO/mongo/products.dao.mongo.js'
import config from '../config.js'

const categories = ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5']

class GenerateMocks {
    async createUserMock () {
        const products = []
        for (let index = 0; index < faker.number.int({ min: 3, max: 6 }); index++) {
            const product = await this.createProductMock()
            products.push(product)
        }

        const newUser = new User({
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            age: faker.number.int({ min: 20, max: 60 }),
            password: faker.internet.password(),
            cart: [products],
            role: 'User'
        })

        return newUser.toDto()
    };

    async createProductMock (productsQuantity) {
        const products = []
        const randomIndex = Math.floor(Math.random() * categories.length)
        for (let i = 0; i < productsQuantity; i++) {
            const thumbnailArray = []
            const image = faker.image.url()
            thumbnailArray.push({ url: image })
            const newProduct = new Product({
                title: String(faker.commerce.product()),
                description: faker.commerce.productDescription(),
                code: String(faker.string.numeric(7)),
                price: faker.commerce.price({ min: 1000, max: 3000 }),
                status: Boolean(faker.datatype.boolean()),
                stock: Number(faker.number.int({ min: 10, max: 50 })),
                category: categories[randomIndex],
                thumbnail: thumbnailArray,
                owner: config.ADMIN_EMAIL
            })
            const prodDto = newProduct.toDto()
            products.push(prodDto)
        }

        await productsDaoMongo.createElement(products)
        return products
    }
}

const generateMocks = new GenerateMocks()
export default generateMocks
