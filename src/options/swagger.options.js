import swaggerJSDoc from 'swagger-jsdoc'

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Server Express API Documentation with Swagger',
            description: 'API documentation for an Express server'
        }
    },
    apis: ['./docs/**/*.yaml']
}
const swaggerSpecs = swaggerJSDoc(swaggerOptions)
export default swaggerSpecs

// http://localhost:8080/docs/#/Products/get_products_product__id_
