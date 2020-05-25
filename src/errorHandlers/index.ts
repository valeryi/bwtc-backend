import { Router } from 'express';

export const applyErrorHandlers = (router: Router, handlers: any) => {
    for (const key in handlers) {
        if (handlers.hasOwnProperty(key)) {
            const errorHandler = handlers[key];

            errorHandler(router);

        }
    }
}