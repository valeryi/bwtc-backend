import express from 'express';
import { applyGraphQLMiddleware } from './modules/graphql';
import { applyExpressMiddleware, middlewareWrappers } from './middlewares/index';
import { applyRoutes, routerWrappers } from './routes';
import { applyErrorHandlers } from './errorHandlers';
import * as errorHandlers from './errorHandlers/handlers';
import { sysLog, logger } from './utils/winston';
import { env } from './environments';
import { database } from './db/mongoose';
import { googleAPI } from './utils/googleAPI';
import { initTelegramBot } from './modules/telegram_bot/bot';

process.on("uncaughtException", (e: Error) => { 
    logger.error(e);
    process.exit(1);
});

process.on("unhandledRejection", (e: any) => {
    logger.error(e);
    process.exit(1);
});

const app = express();
database.init();
googleAPI.connect();
initTelegramBot(app);

applyExpressMiddleware(app, middlewareWrappers);
applyRoutes(app, routerWrappers);
applyGraphQLMiddleware(app);
applyErrorHandlers(app, errorHandlers);

app.listen(env.port, () => {
    sysLog.info(`Server running at: http://localhost:${env.port}/graphql`)
});