import { readdirSync } from 'fs';
import path from 'path';
import { Router, NextFunction } from 'express';

export type Handler = (
    req: Request,
    res: Response,
    next?: NextFunction
) => Promise<void> | void;

export type Route = {
    path: string;
    method: string;
    handler: Handler | Handler[];
};

const routes = readdirSync(path.join(__dirname), { encoding: 'utf-8' }).filter(route => !(/(\.)/g.test(route)));
export const routerWrappers: any = routes.map(route => require(path.join(__dirname, route))[route]);

export const applyRoutes = (router: Router, wrappers: [Route[]], ) => {

    for (const wrapper of wrappers) {

        for (const route of wrapper) {
            const { method, path, handler } = route;
            (router as any)[method](path, handler);
        }
    }
};