const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Substitua pelo seu usuário do MySQL
  password: 'fatec',  // Substitua pela sua senha do MySQL
  database: 'API_Reembolso'  // Substitua pelo nome do seu banco
});

db.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao banco:', err.message);
    return;
  }
  console.log('Banco de dados conectado!');
});

module.exports = db;

