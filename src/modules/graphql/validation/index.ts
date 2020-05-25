import { fileLoader, mergeResolvers } from "merge-graphql-schemas"
import path from 'path';

// loading directive files
const directiveFiles = fileLoader(path.join(__dirname, 'directives'));
export const customDirectives = directiveFiles.reduce(
    (acc: any, current: any) =>
        Object.assign(acc, current.directive),
    {});

// loading middleware files
const middlewareFiles = fileLoader(path.join(__dirname, 'middlewares'));
export const schemaMiddlewares = mergeResolvers(middlewareFiles);