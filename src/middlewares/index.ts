import { fileLoader } from "merge-graphql-schemas";
import path from 'path';
import { Router } from "express";

export type Middleware = (router: Router) => void;

export const middlewareWrappers = fileLoader(path.join(__dirname, '*.js'));

export function applyExpressMiddleware(router: Router, wrappers: any): void {

    // looping through all wrappers 
    for (const key in wrappers) {
        if (wrappers.hasOwnProperty(key)) {
            const wrapper = wrappers[key]; // TODO: Add type for middleware wrappers { name: handler } *

            // looping through handlers
            for (const key in wrapper) {
                if (wrapper.hasOwnProperty(key)) {
                    const handler: Middleware = wrapper[key];

                    handler(router);
                }
            }

        }
    }
}