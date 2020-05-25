import { Response, Request, NextFunction, Router } from 'express';
import { HTTP404Error, HTTPClientError } from './HTTPErrors/HTTPClientError';
import { logger } from '../utils/winston';

export const handle404Error = (router: Router) => {
    router.use((_req: Request, _res: Response, _next: NextFunction) => {
        throw new HTTP404Error("Method not found.");
    });
}

export const handleClientError = (router: Router) => {
    router.use((err: HTTPClientError, _req: Request, res: Response, next: NextFunction) => {

        switch (true) {

            case (err.group === 'HTTPClientError'):
                logger.error(err);
                res.status(err.statusCode).send(err.message);
                break;

            default:
                next(err);
                break;
        }

    })
};

