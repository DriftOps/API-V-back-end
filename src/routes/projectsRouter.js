import express from 'express'
import ProjectsController from '../controllers/projectsController.js'

const projectsRouter = express.Router()
const projectsController = new ProjectsController()

projectsRouter.get('/', async (req, res) => {
    const { body, success, statusCode } = await projectsController.getProjects()
    res.status(statusCode).send({ body, success, statusCode })
})

projectsRouter.get('/:id', async (req, res) => {
    const { body, success, statusCode } = await projectsController.getProjectsByUserId(req.params.id)
    res.status(statusCode).send({ body, success, statusCode })
})

projectsRouter.post('/', async (req, res) => {
    const { body, success, statusCode } = await projectsController.addProject(req.body)
    res.status(statusCode).send({ body, success, statusCode })
})

projectsRouter.delete('/:id', async (req, res) => {
    const { body, success, statusCode } = await projectsController.deleteProject(req.params.id)
    res.status(statusCode).send({ body, success, statusCode })
})

projectsRouter.put('/:id', async (req, res) => {
    const { body, success, statusCode } = await projectsController.updateProject(req.params.id, req.body)
    res.status(statusCode).send({ body, success, statusCode })
})

export default projectsRouter;
