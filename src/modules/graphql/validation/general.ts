import { addSchemaLevelResolveFunction } from 'graphql-tools';
import { GraphQLSchema } from 'graphql';

const rootLevelResolver = (
    _root: any,
    _args: any,
    _context: any,
    _info: any
) => {
    // General validation goes here ...

};

export const applyGeneralValidation = (schema: GraphQLSchema) => {
    addSchemaLevelResolveFunction(schema, rootLevelResolver);
}