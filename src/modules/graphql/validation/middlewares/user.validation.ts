import { validateEmail, validatePassword, SignInValidation, checkIfUserExists } from './auth.validation';

export const middleware = {
    Mutation: {
        createUser: async (
            resolve: any,
            parent: any,
            { data }: any,
            context: any,
            info: any
        ) => {
            // Before
            const { email, password, confirm } = data;

            const emailError: string[] = validateEmail(email);
            const passwordError: string[] = validatePassword(password, confirm);

            SignInValidation(...emailError, ...passwordError);
            await checkIfUserExists(email);

            const result = await resolve(parent, { data }, context, info);
            // After
            return result;
        }
    },
}