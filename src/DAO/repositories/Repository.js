class Repository {
    constructor (DAO, model) {
        this.DAO = DAO
        this.Model = model
    }

    saveDtoInDB (element) {
        const response = this.DAO.createElement(element)
        return response
    }

    getRehydratedElement (id = null, element = null) {
        if (!id) return new this.Model(element)
        const elementAsDto = this.DAO.findElementById(id)
        const response = new this.Model(elementAsDto)
        return response
    }
}
export default Repository
