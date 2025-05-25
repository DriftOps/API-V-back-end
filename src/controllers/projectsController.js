import ProjectsDataAccess from "../dataAccess/projectsDataAccess.js"
import { ok, serverError } from "../helpers/httpResponses.js"

export default class ProjectsController {
    constructor() {
        this.dataAccess = new ProjectsDataAccess()
    }

    async getProjects() {
        try {
            const projects = await this.dataAccess.getProjects()
            return ok(projects)
        } catch (error) {
            return serverError(error)
        }
    }

    async getProjectsByUserId(userId) {
        try {
            const projects = await this.dataAccess.getProjectsByUserId(userId)
            return ok(projects)
        } catch (error) {
            return serverError(error)
        }
    }

    async addProject(projectData) {
        try {
            const result = await this.dataAccess.addProject(projectData)
            return ok(result)
        } catch (error) {
            return serverError(error)
        }
    }

    async deleteProject(projectId) {
        try {
            const result = await this.dataAccess.deleteProject(projectId)
            return ok(result)
        } catch (error) {
            return serverError(error)
        }
    }

    async updateProject(projectId, projectData) {
        try {
            const result = await this.dataAccess.updateProject(projectId, projectData)
            return ok(result)
        } catch (error) {
            return serverError(error)
        }
    }
}
