import { fileLoader, mergeResolvers } from "merge-graphql-schemas";
import path from 'path';

const resolverFiles = fileLoader(path.join(__dirname, '**/*.resolvers.js'));
export const readyResolvers = mergeResolvers(resolverFiles);