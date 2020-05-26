import { userService } from "../../../services/user.service";

export const resolvers = {
    Query: {

        allUsers: async (_obj: any, _args: any, _context: any, _info: any) => {
            return await userService.allUsers();
        },
        fetchUser: async (_obj: any, { id }: { id: string }, _context: any, _info: any) => {
            return await userService.fetchUser(id);
        }
    },

    Mutation: {

        createUser: async (_obj: any, { data }: any, _context: any, _info: any) => {

            data.confirmed = true;

            return userService.createUser(data).then(created => {
                return created;
            });
        },

        deleteUser: async (_obj: any, { id }: any, _context: any, _info: any) => {
            return await userService.deleteUser(id);
        },

        updateUser: async (_obj: any, { id, data }: any, _context: any, _info: any) => {
            return await userService.updateUser(id, data);
        }
    }
}