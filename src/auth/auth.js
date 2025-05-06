import express from 'express';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import crypto from 'crypto';
import { Mongo } from '../database/mongo.js';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

const collectionName = 'users';

// Configurando o Passport para procurar pelo "user" e senha
passport.use(new LocalStrategy({ usernameField: 'user' }, async (user, password, callback) => {
    const existingUser = await Mongo.db
        .collection(collectionName)
        .findOne({ user: user });

    if (!existingUser) {
        return callback(null, false, { message: 'User not found' });
    }

    // Recupera o salt armazenado no banco
    const saltBuffer = existingUser.salt.buffer;

    // Compara a senha enviada com a senha criptografada
    crypto.pbkdf2(password, saltBuffer, 310000, 16, 'sha256', (err, hashedPassword) => {
        if (err) {
            return callback(err, false);
        }

        const userPasswordBuffer = Buffer.from(existingUser.password.buffer);

        if (!crypto.timingSafeEqual(userPasswordBuffer, hashedPassword)) {
            return callback(null, false, { message: 'Incorrect password' });
        }

        // Remover dados sensíveis antes de retornar o usuário
        const { password, salt, ...rest } = existingUser;

        return callback(null, rest); // Retorna o usuário com dados filtrados
    });
}));

// Rota
const authRouter = express.Router();

// Rota de Signup (Cadastro)
authRouter.post('/signup', async (req, res) => {
    const { user, password, fullname } = req.body;

    const checkUser = await Mongo.db
        .collection(collectionName)
        .findOne({ user }); // Alterado de "username" para "user"

    if (checkUser) {
        return res.status(500).send({
            success: false,
            statusCode: 500,
            body: {
                text: 'User already exists!'
            }
        });
    }

    // Caso contrário, realiza o cadastro
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(password, salt, 310000, 16, 'sha256', async (err, hashedPassword) => {
        if (err) {
            return res.status(500).send({
                success: false,
                statusCode: 500,
                body: {
                    text: 'Error on crypto password!',
                    err: err
                }
            });
        }

        const result = await Mongo.db
            .collection(collectionName)
            .insertOne({
                fullname,
                user, // Alterado de "username" para "user"
                password: hashedPassword,
                salt // Salvo junto com a senha criptografada
            });

        if (result.insertedId) {
            const registeredUser = await Mongo.db
                .collection(collectionName)
                .findOne({ _id: new ObjectId(result.insertedId) });

            const payload = {
                id: registeredUser._id,
                user: registeredUser.user // Alterado de "username" para "user"
            };

            const token = jwt.sign(payload, 'secret', { expiresIn: '1h' });

            return res.send({
                success: true,
                statusCode: 200,
                body: {
                    text: 'User registered correctly!',
                    token,
                    user: payload,
                    logged: true
                }
            });
        }
    });
});

// Rota de Login
authRouter.post('/login', (req, res) => {
    passport.authenticate('local', (error, user, info) => {
        if (error) {
            return res.status(500).send({
                success: false,
                statusCode: 500,
                body: {
                    text: "Error during authentication",
                    error
                }
            });
        }

        if (!user) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                body: {
                    text: info.message || "User not found",
                    error
                }
            });
        }

        // Payload do usuário
        const userPayload = {
            id: user._id, // ID do usuário
            user: user.user, // Nome de usuário
            fullName: user.fullname // Nome completo
        };

        // Gerando o token JWT
        const token = jwt.sign(userPayload, 'secret', { expiresIn: '1h' });

        return res.status(200).send({
            success: true,
            statusCode: 200,
            body: {
                text: "User logged in correctly",
                user: userPayload,
                token
            }
        });
    })(req, res);
});

export default authRouter;