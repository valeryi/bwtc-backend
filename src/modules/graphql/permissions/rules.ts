import { rule } from 'graphql-shield';

export const isAuthorized = rule()(
    async (_obj, _args, { authUser }, _info) => authUser && true
);

// export const isUserManager = rule()(
//   (obj, args, { authUser }, info) => authUser && authUser.role === 'USER_MANAGER'
// );
