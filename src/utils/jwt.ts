import * as jwt from 'jsonwebtoken';
import { env } from '../environments';
import { AuthenticationError } from 'apollo-server-express';

const secret = env.token_secret as string;
const options: jwt.SignOptions = {
    issuer: 'cocoon.finance',
    expiresIn: '1h',
    algorithm: 'HS256'
};

export function sign(payload: any) {
    return jwt.sign({ payload }, secret, options);
}

export function verify(req: any, res: any) {
    try {
        // extract token
        const parts = req.headers.authorization ? req.headers.authorization.split(' ') : [''];
        const token = parts.length === 2 && parts[0].toLowerCase() === 'bearer' ? parts[1] : undefined;

        if (!token) {
            return undefined;
        }

        // verify token
        const { payload, iat }: any = jwt.verify(token, secret);

        // generate new token in every 15 minutes
        const diff = Math.floor(Date.now() / 1000) - iat;
        if (diff >= 15 * 60) {
            const newToken = sign(payload);
            res.set('Authorization', `Bearer ${newToken}`);
        }

        return payload;

    } catch (err) {
        if (err.name !== 'TokenExpiredError') {
            throw new AuthenticationError('JWT token check failed');
        }
    }
}

export function contextHook(ctx: any) {
    const { req, res } = ctx;
    const context: any = [];

    // verify jwt token
    context.authUser = verify(req, res);

    return context;

}