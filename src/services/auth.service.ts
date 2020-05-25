import BaseService from "./base.service";
import { compareSync } from "bcryptjs";
import { User } from "../models/users.model";
import { userService } from '../services/user.service';
import { sign } from "../utils/jwt";
import { DB_Error } from "../errorHandlers/HTTPErrors/ServerError";
import SimpleCrypto from 'simple-crypto-js';
import { mailService } from '../services/mail.service';
import { env } from "../environments";
import { AuthenticationError } from "apollo-server-express";
import {User as IUser} from '../models/users.model';

class AuthService extends BaseService {

    constructor() {
        super(User);
    }

    async signIn(email: string, password: string) {
        const user = await this.findByEmail(email);

        if (!user) {
            throw new AuthenticationError(`User with this email doesn't exist: ${email}`); // TODO: Proper Error 
        }

        if (!compareSync(password, user.password)) {
            throw new AuthenticationError(`Wrong creadentials`);
        }

        if (!user.confirmed) {
            throw new AuthenticationError(`Email address is not confirmed yet. First, confirm your email address!`);
        }

        // TODO: Remove 'password' property from the object. delete user.password - doesn't work 
        delete user.password;

        const token = sign({ userData: user });

        return {
            success: true, message: 'Logged in successfully!', token
        };

    }

    async signUp(params: any) {

        const created = await userService.createUser(params);

        this.sendConfirmLetter(created);

        return {
            success: true,
            message: 'User created successfully',
            created
        };
    }

    sendConfirmLetter(user: IUser) {

        const crypter = new SimpleCrypto((env.token_secret as string));
        const encrypt = crypter.encrypt(user._id);

        const template = {
            name: 'SignUp',
            data: {
                encrypt
            }
        }

        mailService.sendEmail({
            to: user.email,
            subject: "Confirmation"
        }, template);
    }

    async confirm(id: string) {

        const user = await this.findById(id);

        if (!user) {
            //   throw new ValidationError(`Broken confirmation link: ${user.id}`);
            throw new Error(`Broken confirmation link: ${user.id}`);
        };

        if (user.confirmed) {
            // throw new ValidationError(`Email address had already been confirmed`);
            throw new Error(`Email address had already been confirmed`);
        }

        return await this.update(id, { confirmed: true })
            .then((updated: any) => {
                // TODO: Set redirect after email confirmation
                return { message: `User with id "${updated._id}" is successfully updated`, success: true, updated };
            })
            .catch((err: Error) => {
                if (err) {
                    throw new DB_Error(`Couldn't update ${{ confirmed: true }} for a user with id: ${id}`);
                }
            })
    }
}

export const authService = new AuthService();
