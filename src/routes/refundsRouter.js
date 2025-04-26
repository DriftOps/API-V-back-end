import express from 'express'
import RefundsController from '../controllers/refundsController.js'

const refundsRouter = express.Router()
const refundsController = new RefundsController()

refundsRouter.get('/', async (req, res) => {
    const { body, success, statusCode } = await refundsController.getRefunds()
    res.status(statusCode).send({ body, success, statusCode })
})

refundsRouter.get('/:id', async (req, res) => {
    const { body, success, statusCode } = await refundsController.getRefundsByUserId(req.params.id)
    res.status(statusCode).send({ body, success, statusCode })
})

refundsRouter.post('/', async (req, res) => {
    const { body, success, statusCode } = await refundsController.addRefund(req.body)
    res.status(statusCode).send({ body, success, statusCode })
})

refundsRouter.delete('/:id', async (req, res) => {
    const { body, success, statusCode } = await refundsController.deleteRefund(req.params.id)
    res.status(statusCode).send({ body, success, statusCode })
})

refundsRouter.put('/:id', async (req, res) => {
    const { body, success, statusCode } = await refundsController.updateRefund(req.params.id, req.body)
    res.status(statusCode).send({ body, success, statusCode })
})

export default refundsRouter
