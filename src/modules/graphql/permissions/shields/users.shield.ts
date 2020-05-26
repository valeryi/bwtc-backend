import { isAuthorized } from '../rules';

export const permissions = {

    Query: {
        allUsers: isAuthorized,
        fetchUser: isAuthorized
    },

    Mutation: {
        createUser: isAuthorized,
        deleteUser: isAuthorized,
        updateUser: isAuthorized
    }

};