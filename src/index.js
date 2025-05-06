import { config } from 'dotenv';
config();

import express from 'express';
import cors from 'cors';
import { Mongo } from './database/mongo.js';
import authRouter from './auth/auth.js';
import usersRouter from './routes/usersRouter.js';
import refundsRouter from './routes/refundsRouter.js';

async function main() {
  const hostname = '0.0.0.0';
  const port = 3000;

  const app = express();

  const mongoConnection = await Mongo.connect({
    mongoConnectionString: process.env.MONGO_CS,
    mongoDbName: process.env.MONGO_DB_NAME
  });
  console.log('Mongo conectado:', mongoConnection);

  app.use(express.json());
  app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] }));

  app.get('/', (req, res) => {
    res.send({
      success: true,
      statusCode: 200,
      body: 'Welcome to Reembolso!'
    });
  });

  app.use('/auth', authRouter);
  app.use('/users', usersRouter);
  app.use('/refunds', refundsRouter);

  app.listen(port, hostname, () => {
    console.log(`Server running on: http://${hostname}:${port}`);
  });  
}

main().catch((err) => {
  console.log('CS:', process.env.MONGO_CS);
  console.error('Erro ao iniciar o servidor:', err);
});
