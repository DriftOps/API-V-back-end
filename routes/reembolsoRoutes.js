const express = require('express');
const db = require('../config/db');
const router = express.Router();

// Enviar reembolso
router.post('/solicitar', (req, res) => {
  const { usuario_id, tipo, valor, km, estabelecimento, data, imagem } = req.body;

  const sql = "INSERT INTO reembolsos (usuario_id, tipo, valor, km, estabelecimento, data, imagem) VALUES (?, ?, ?, ?, ?, ?, ?)";
  db.query(sql, [usuario_id, tipo, valor, km, estabelecimento, data, imagem], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Reembolso solicitado com sucesso!" });
  });
});

// Buscar histórico de reembolsos
router.get('/historico/:usuario_id', (req, res) => {
  const { usuario_id } = req.params;
  
  const sql = "SELECT * FROM reembolsos WHERE usuario_id = ?";
  db.query(sql, [usuario_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

module.exports = router;
