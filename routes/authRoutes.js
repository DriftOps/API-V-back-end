const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Rota de login
router.post('/login', (req, res) => {
  const { email, senha } = req.body;
  const sql = "SELECT * FROM usuarios WHERE email = ?";
  
  db.query(sql, [email], async (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    
    if (result.length === 0) return res.status(401).json({ message: "Usuário não encontrado" });

    const user = result[0];
    const senhaValida = await bcrypt.compare(senha, user.senha);

    if (senha !== user.senha) return res.status(401).json({ message: "Senha incorreta" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ token, nome: user.nome });
  });
});

// Rota de cadastro de usuário
router.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body;
  const senhaCriptografada = await bcrypt.hash(senha, 10);

  const sql = "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)";
  db.query(sql, [nome, email, senhaCriptografada], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
  });
});

module.exports = router;
