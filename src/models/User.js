import User from '../models/User.js';

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Busca o usuário pelo _id no MongoDB
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Retorna os dados do usuário (pode ajustar o que quer retornar)
    res.json({ body: user });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};