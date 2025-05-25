import { Mongo } from "../database/mongo.js"
import { ObjectId } from 'mongodb'

const collectionName = 'projects'

export default class ProjectsDataAccess {
    async getProjects() {
        return await Mongo.db
            .collection(collectionName)
            .find({})
            .toArray()
    }

    async getProjectsByUserId(userId) {
        return await Mongo.db
            .collection(collectionName)
            .find({ usuarios: { $in: [userId] } })
            .toArray()
    }

    async addProject(projectData) {
        projectData.criado_em = new Date()

        const result = await Mongo.db
            .collection(collectionName)
            .insertOne(projectData)

        return result
    }

    async deleteProject(projectId) {
        return await Mongo.db
            .collection(collectionName)
            .deleteOne({ _id: new ObjectId(projectId) })
    }

    async updateProject(projectId, projectData) {
        if (projectData.criado_em) {
            projectData.criado_em = new Date(projectData.criado_em)
        }

        return await Mongo.db
            .collection(collectionName)
            .findOneAndUpdate(
                { _id: new ObjectId(projectId) },
                { $set: projectData },
                { returnDocument: 'after' }
            )
    }
}
