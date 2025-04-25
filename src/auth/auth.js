import express from 'express';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import crypto from 'crypto';
import { Mongo } from '../database/mongo.js';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import cors from 'cors';



const collectionName = 'users'


passport.use(new LocalStrategy({ usernameField: 'user' }, async (username, password, callback) => {
    const user = await Mongo.db
    .collection(collectionName)
    // findOne ({}) = ache um com os parâmetros nas chaves
    .findOne({ user: username })

    // com "!" é caso não tenha o usuário
    if (!user) {
        return callback(null, false)
    }

    // campo p/ salvar junto com os dados da password criptada + a chave p/ descriptar
    const saltBuffer = user.salt.buffer

    crypto.pbkdf2(password, saltBuffer, 310000, 16, 'sha256', (err, hashedPassword) => {
        if (err) {
            return callback(err, false)
        }

        const userPasswordBuffer = Buffer.from(user.password.buffer)

        // Caso as senhas não se equivalerem
        if(!crypto.timingSafeEqual(userPasswordBuffer, hashedPassword)) {
            return callback(null, false)
        }

        const { password, salt, ...rest } = user

        return callback(null, rest)
    })
} ))

// Rota
const authRouter = express.Router()

authRouter.post('/signup', async (req, res) => {
    const checkUser = await Mongo.db
    .collection(collectionName)
    .findOne({ user: username })

    if(checkUser) {
        return res.status(500).send({
            sucess: false,
            statusCode: 500,
            body: {
                text: 'User already exists!'
            }
        })
    }
    // Caso contrário:
    const salt = crypto.randomBytes(16)
    crypto.pbkdf2(req.body.password, salt, 310000, 16, 'sha256', async (err, hashedPassword) => {
        if(err) {
            return res.status(500).send({
                sucess: false,
                statusCode: 500,
                body: {
                    text: 'Error on crypto password!',
                    err: err
                }
            })
        }

        const result = await Mongo.db
        .collection(collectionName)
        .insertOne({
            fullname: req.body.fullname,
            user: req.body.user,
            password: hashedPassword,
            salt // chave para criptografia
        })

        if (result.insertedId) {
            const user = await Mongo.db
                .collection(collectionName)
                .findOne({ _id: new ObjectId(result.insertedId) })
        
            // Payload simples, apenas com os dados essenciais do usuário
            const payload = {
                id: user._id,
                user: req.body.user,
            }

            // Gerando o token JWT
            const token = jwt.sign(payload, 'secret', { expiresIn: '1h' })

            return res.status(200).send({
                token,
                user,
                message: "User logged in correctly"
              })
        }
    })
})

authRouter.post('/login', (req, res) => {
    passport.authenticate('local',(error, user) => {
        if(error) {
            return res.status(500).send({
                sucess: false,
                statusCode: 500,
                body: {
                    text: "Error during authentication",
                    error
                }
            })
        }

        if(!user) {
            return res.status(400).send({
                sucess: false,
                statusCode: 400,
                body: {
                    text: "User not found",
                    error
                }
            })
        }

        const token = jwt.sign(user, 'secret')
        console.log(user)
            return res.status(200).send({
                sucess: true,
                statusCode: 200,
                body: {
                    text: "User logged in correctly",
                    user,
                    token
                }
            })
    })(req, res);
})

export default authRouter