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

refundsRouter.put('/refunds/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const refund = await refundsCollection.findOne({ _id: new ObjectId(id) });
    if (!refund) return res.status(404).json({ message: 'Reembolso não encontrado' });

    const user = await usersCollection.findOne({ _id: new ObjectId(refund.usuario_id) });
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    // Calcular total dos itens
    const total = refund.refunds.reduce((acc, item) => {
      const valor = Number(item.valor) || 0;
      const custoDist = Number(item.custo_dist.replace('R$', '').replace(',', '.')) || 0;
      return acc + valor + custoDist;
    }, 0);

    // Definir qual campo atualizar no usuário
    const updateUser = {};
    if (status === 'Aprovado') {
      updateUser.reembolso = (user.reembolso || 0) + total;
    } else if (status === 'Reprovado') {
      updateUser.reprovado = (user.reprovado || 0) + total;
    }

    // Atualizar refund
    await refundsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status } }
    );

    // Atualizar usuário
    await usersCollection.updateOne(
      { _id: new ObjectId(refund.usuario_id) },
      { $set: updateUser }
    );

    res.status(200).json({ message: `Reembolso ${status.toLowerCase()} com sucesso!` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar reembolso' });
  }
});



export default refundsRouter;
