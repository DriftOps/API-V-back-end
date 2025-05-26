import { ok, serverError } from "../helpers/httpResponses.js";
import UsersDataAccess from "../dataAccess/usersDataAccess.js";

export default class UsersControllers {
    constructor() {
        this.dataAccess = new UsersDataAccess();
    }

    async createUser(userData) {
        try {
            const newUser = await this.dataAccess.createUser(userData);
            return ok(newUser);
        } catch (error) {
            return serverError(error);
        }
    }

    async getUserById(userId) {
        // valida se userId é um ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(userId)) {
        return null; // ou lançar erro, depende da sua escolha
        }

        const user = await User.findById(userId).exec();
        return user;
    }


    async getUsers() {
        try {
            const users = await this.dataAccess.getUsers();
            return ok(users);
        } catch (error) {
            return serverError(error);
        }
    }

    async getUserById(userId) {
        try {
            const user = await this.dataAccess.getUserById(userId);

            if (!user) {
                return {
                    body: { message: "Usuário não encontrado" },
                    success: false,
                    statusCode: 404
                };
            }

            return ok(user);
        } catch (error) {
            return serverError(error);
        }
    }

    async deleteUser(userId) {
        try {
            const result = await this.dataAccess.deleteUser(userId);
            return ok(result);
        } catch (error) {
            return serverError(error);
        }
    }

    async updateUser(userId, userData) {
        try {
            const result = await this.dataAccess.updateUser(userId, userData);
            return ok(result);
        } catch (error) {
            return serverError(error);
        }
    }
}
