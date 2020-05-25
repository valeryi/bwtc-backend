import { userService } from "../../../services/user.service";
import { authService } from "../../../services/auth.service";

export const resolvers = {
    Query: {

        authUser: (_obj: any, _args: any, { authUser }: any, _info: any) => {
            return userService.findById(authUser.id)
                .then((user: any) => {
                    return user.user;
                });
        }
    },

    Mutation: {

        signIn: async (_obj: any, { email, password }: { email: string, password: string }, _context: any, _info: any) => {

            return await authService.signIn(email, password);

        },

        signUp: async (_obj: any, { SignUpInput }: any, _context: any, _info: any) => {

            return await authService.signUp(SignUpInput);

        },

        // updatePersonalInfo: (obj, { fistname }, { authUser }, info) => {
        //   console.log(authUser);
        //   return userService.updateUser(authUser.id, {
        //     fistname
        //   });
        // },

        // changePassword: (obj, { password, newPassword, reNewPassword }, { authUser }, info) => {
        //   return userService.changePassword(authUser.id, password, newPassword);
        // }
    }
}