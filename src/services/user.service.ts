import { User } from "../models/users.model";
import BaseService from "./base.service";
import { hashSync } from "bcryptjs";
import { env } from "../environments";
import { InputUser, User as IUser } from "../models/users.model";
import { HTTP404Error } from '../errorHandlers/HTTPErrors/HTTPClientError';

const HASH_ROUNDS = parseInt((env.hash_rounds as string));

class UserService extends BaseService {

    constructor() {
        super(User);
    }

    async allUsers() {
        const users = await userService.findAll();

        users.forEach((user: IUser) => {

            // TODO: Remove password properties not just assign 'null'. - "delete user.password" doesn't work
            delete user.password;

        });

        return users;

    }

    async fetchUser(id: string) {
        const user = await userService.findById(id);

        if (!user) {
            throw new HTTP404Error(`No such user: ${id}`);
        }

        // TODO: Remove password properties not just assign 'null'. - "delete user.password" doesn't work
        delete user.password;
        return user;
    }

    async createUser(data: InputUser) {
        data.password = hashSync(data.password, HASH_ROUNDS);
        delete data.confirm;

        data.role = data.role || "USER";

        return await this.create(data);
    }

    async deleteUser(id: string) {
        const u = await this.findById(id);

        if (!u) {
            throw new HTTP404Error('No user with id: ' + id);
        }

        const user = await this.delete(id);

        return user;
    }

    async updateUser(id: string, data: object) {
        const u = await this.findById(id);

        if (!u) {
            throw new HTTP404Error('No user with id: ' + id);
        }

        const r = await this.update(id, data);
        return r;
    }
}

export const userService = new UserService();
