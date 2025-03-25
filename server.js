require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const reembolsoRoutes = require('./routes/reembolsoRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// app.get('/api/teste', (req, res) => {
//     res.json({ message: 'API está rodando!' });
// });

// Rotas
app.use('/api/reembolso', reembolsoRoutes);
app.use('/api/auth', authRoutes);

// Porta do servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
