import db from '../database/mongo.js'

class RefundsDataAccess {
  constructor() {
    this.collection = db.collection('refunds')
  }

  async getAllRefunds() {
    return await this.collection.find({}).toArray()
  }

  async createRefund(refund) {
    const result = await this.collection.insertOne(refund)
    return result.ops?.[0] || refund
  }

  async deleteRefund(id) {
    const objectId = new db.ObjectId(id)
    await this.collection.deleteOne({ _id: objectId })
  }

  async updateRefund(id, data) {
    const objectId = new db.ObjectId(id)
    await this.collection.updateOne({ _id: objectId }, { $set: data })
    return { id, ...data }
  }
}

export default RefundsDataAccess
