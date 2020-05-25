import { Response, Request } from 'express';
import { authService } from '../../services/auth.service';
import SimpleCrypto from 'simple-crypto-js';
import { env } from '../../environments';

export const confirm = async (req: Request, res: Response) => {

    const code = req.params[0];
    const crypter = new SimpleCrypto((env.token_secret as string));
    const decrypt = crypter.decrypt(code).toString();
    const id = decrypt.slice(1, decrypt.length - 1);

    return authService.confirm(id)
        .then(response => {
            res.status(200).json(response)
        }).catch((err: Error) => {
            throw new Error(err.message);
        });
};