import { MongoClient } from 'mongodb';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config(); // Carrega as variáveis do .env

const mongoUrl = process.env.MONGO_CS;
const dbName = process.env.MONGO_DB_NAME;
const collectionName = 'users';

const user = {
  user: 'admin',
  email: 'admin@gmail.com',
  fullName: 'Administrador Central',
  password: 'admin'
};

(async () => {
  const client = new MongoClient(mongoUrl);
  try {
    await client.connect();
    console.log('Conectado ao MongoDB Atlas');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const existing = await collection.findOne({ user: user.user });
    if (existing) {
      console.log('Usuário já existe!');
      return;
    }

    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(user.password, salt, 310000, 16, 'sha256', async (err, hashedPassword) => {
      if (err) throw err;

      const newUser = {
        user: user.user,
        email: user.email,
        fullName: user.fullName,
        password: hashedPassword,
        salt: salt
      };

      const result = await collection.insertOne(newUser);
      console.log('Usuário inserido com sucesso:', result.insertedId);
    });

  } catch (err) {
    console.error('Erro:', err);
  } finally {
    setTimeout(() => client.close(), 1000);
  }
})();
