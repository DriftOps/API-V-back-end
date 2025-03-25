CREATE DATABASE API_Reembolso;

USE API_Reembolso;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL
);

CREATE TABLE reembolsos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  tipo ENUM('alimentacao', 'viagem') NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  km DECIMAL(10,2),
  estabelecimento VARCHAR(255),
  data DATE NOT NULL,
  imagem TEXT,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

INSERT INTO usuarios (nome, email, senha)
VALUES ('João Silva', 'joao@email.com', 'senha123');

INSERT INTO reembolsos (usuario_id, tipo, valor, km, estabelecimento, data, imagem) 
VALUES (1, 'Alimentação', 50.00, 0, 'Restaurante XYZ', '2025-02-28', 'base64-imagem');

