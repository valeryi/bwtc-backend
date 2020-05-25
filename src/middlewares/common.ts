import { Router } from 'express';
import compression from 'compression';
import cors from 'cors';
import parser from 'body-parser';
import { Middleware } from '.';

export const handleCors: Middleware = (router: Router) => {
    router.use(cors({ credentials: true, origin: true })); // LEARN: Learn all options of cors library
}

export const handleComporession: Middleware = (router: Router) => {
    router.use(compression());
}

export const handleBodyRequestParsing: Middleware = (router: Router) => { // LEARN: Learn all options of bodyParser library
    router.use(parser.urlencoded({ extended: true }));
    router.use(parser.json());
};