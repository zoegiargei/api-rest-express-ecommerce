/* eslint-disable no-unneeded-ternary */
class DAODb {
    constructor (db) {
        this.db = db
    }

    async createElement (element) {
        return await this.db.create(element)
    }

    async findElements () {
        return await this.db.find().lean()
    }

    async findElementById (id) {
        return await this.db.findOne({ _id: id }).lean()
    }

    async findOneByQuery (query, selectOptions = null) {
        if (selectOptions !== null) {
            return await this.db.findOne(query).select(selectOptions).lean()
        } else {
            return await this.db.findOne(query).lean()
        }
    }

    async findElementByIdAndQuery (id, query) {
        return await this.db.findOne({ _id: id }, query)
    }

    async findTheLastOne () {
        return await this.db.find().limit(1).sort({ $natural: -1 }).lean()
    }

    async findElementsByQuery (_query) {
        return await this.db.find(_query).lean()
    }

    async findElementByProjection (p1, p2) {
        return await this.db.find(p1, p2).lean()
    }

    async updateElement (id, newValues) {
        return await this.db.updateOne({ _id: id }, newValues)
    }

    async updateFieldElement (id, updateQuery) {
        return await this.db.updateOne({ _id: id }, updateQuery)
    }

    async sortElements (value) {
        return await this.db.find().sort(value)
    }

    async deleteElement (id) {
        return await this.db.deleteOne({ _id: id })
    }

    async deleteManyElemByQuery (query) {
        return await this.db.deleteMany(query)
    }

    async reset () {
        return await this.db.deleteMany({})
    }
}
export default DAODb
