import { Mongo } from "../database/mongo.js"
import { ObjectId } from 'mongodb'

const collectionName = 'refunds'

export default class RefundsDataAccess {
    async getRefunds() {
        return await Mongo.db
            .collection(collectionName)
            .find({})
            .toArray()
    }

    async getRefundsByUserId(userId) {
        return await Mongo.db
            .collection(collectionName)
            .find({ usuario_id: userId })
            .toArray()
    }

    async addRefund(refundData) {
        refundData.data = new Date(refundData.data)
        const result = await Mongo.db
            .collection(collectionName)
            .insertOne(refundData)

        return result
    }

    async deleteRefund(refundId) {
        return await Mongo.db
            .collection(collectionName)
            .deleteOne({ _id: new ObjectId(refundId) })
    }

    async updateRefund(refundId, refundData) {
        if (refundData.data) {
            refundData.data = new Date(refundData.data)
        }

        return await Mongo.db
            .collection(collectionName)
            .findOneAndUpdate(
                { _id: new ObjectId(refundId) },
                { $set: refundData },
                { returnDocument: 'after' }
            )
    }
}
