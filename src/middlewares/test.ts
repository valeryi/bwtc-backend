import { Router, Request } from 'express';
import { Middleware } from '.';
// import { logger } from '../utils/winston';

export const test: Middleware = (router: Router) => {
    router.use((_req: Request, _res: any, next: any) => {
        // logger.info('middleware is active');
        next();
    });
}