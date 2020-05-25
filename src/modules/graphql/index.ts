import { makeExecutableSchema } from 'graphql-tools';
import { applyMiddleware } from 'graphql-middleware';
import { ApolloServer } from "apollo-server-express";
import { Application } from 'express';
import { contextHook } from '../../utils/jwt';
import { shield } from 'graphql-shield';

import { applyGeneralValidation } from './validation/general';
import { readySchema } from './schemas';
import { readyResolvers } from './resolvers';
import { customDirectives, schemaMiddlewares } from './validation';
import { readyShield } from './permissions';

const schemaMiddleware = makeExecutableSchema({
    typeDefs: readySchema,
    resolvers: readyResolvers,
    schemaDirectives: customDirectives
});

const schema = applyMiddleware(
    schemaMiddleware,
    shield(readyShield, { allowExternalErrors: true }), // FIXME: FallbackRule Option doesn't work here. Maybe because of the way I combine the file from partials
    schemaMiddlewares.middleware,
);

applyGeneralValidation(schemaMiddleware);

const apolloServer = new ApolloServer({
    schema: schema,
    debug: true,
    context: contextHook,
    formatError: (error: any) => {
        return error;
    },
})

export const applyGraphQLMiddleware = (app: Application) => {
    apolloServer.applyMiddleware({ app });
}


// CHALLENGE: Write my own solution of using partials of schema and resolvers as a library for npm - in place of deprecated "merge-graphql-schemas"