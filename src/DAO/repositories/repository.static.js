class Repository {
    static saveDtoInDB (element, dao) {
        const response = dao.createElement(element)
        return response
    }

    static getRehydratedElement (id = null, element = null, Model, dao) {
        if (!id) return new Model(element)
        const elementAsDto = dao.findElementById(id)
        const response = new Model(elementAsDto)
        return response
    }
}
export default Repository
