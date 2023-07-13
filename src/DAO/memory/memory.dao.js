class DAOMemory {
    constructor () {
        this.memory = []
    }

    createElement (element) {
        this.memory.push(element)
        return this.memory
    }

    findElements () {
        return this.memory
    }

    findIndex (id) {
        return this.memory.findIndex(element => element._id === id)
    }

    findElementById (id) {
        return this.memory.find(element => element._id === id)
    }

    findTheLastOne () {
        const lastIndex = this.memory.length - 1
        return this.memory[lastIndex]
    }

    findElementsByQuery (_query) {
        const properties = Object.keys(_query)
        const values = Object.arguments(_query)
        const prop = properties[0]
        const val = values[0]
        console.log(prop)
        console.log(val)
        const newArray = this.memory.filter(elem => elem.prop === val)
        return newArray
    }

    async findElementByProjection () {
        return this.memory
    }

    async updateElement (id, newValues) {
        const index = this.findIndex(id)
        this.memory[index] = { ...this.memory[index], ...newValues }
        console.log(this.memory[index])
        return this.memory[index]
    }

    async sortElements (value) {
        this.memory.sort((a, b) => a[value] - b[value])
    }

    async deleteElement (id) {
        const index = this.findIndex(id)
        return this.memory.splice(index, 1)
    }

    async reset () {
        this.memory = []
        return this.memory
    }
}
export default DAOMemory
