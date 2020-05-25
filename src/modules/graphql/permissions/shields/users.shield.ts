import { isAuthorized } from '../rules';
import { allow } from 'graphql-shield';

export const permissions = {

    Query: {
        allUsers: isAuthorized,
        fetchUser: isAuthorized
    },

    Mutation: {
        createUser: allow,
        deleteUser: isAuthorized,
        updateUser: isAuthorized
    }

};