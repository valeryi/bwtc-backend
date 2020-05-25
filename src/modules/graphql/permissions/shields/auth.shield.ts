import { allow } from 'graphql-shield';
import { isAuthorized } from '../rules';

export const permissions = {

    Query: {
        authUser: isAuthorized,
    },

    Mutation: {
        signIn: allow,
        signUp: allow
    },

};