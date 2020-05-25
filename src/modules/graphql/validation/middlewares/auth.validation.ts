import isEmail from 'validator/lib/isEmail';
import PasswordValidator from 'password-validator';
import { ValidationError } from 'apollo-server-express';
import { userService } from '../../../../services/user.service';

export function validateEmail(email: string): string[] {

    const errors: string[] = [];

    if (!isEmail(email)) {
        errors.push('Wrong email format');
    }

    return errors;

};

export function validatePassword(password: string, confirm: string): string[] {

    const passwordCheck = new PasswordValidator()
        .is().min(2)
        .is().max(20)
        .has().letters()
        .has().digits()
        .has().symbols()
        .has().not().spaces();

    const errors = <string[]>passwordCheck.validate(password, { list: true });

    if (password !== confirm) {
        errors.push(`Passwords don't match`);
    }

    return (errors as string[]);

}

export function SignInValidation(...errorWrappers: string[]) {

    const errorsAsStr = errorWrappers.join(', ');

    if (errorWrappers.length > 0) {


        throw new ValidationError(`Something went wrong with your input data: "${errorsAsStr}"`);

    }
}

export async function checkIfUserExists(email: string): Promise<void> {
    const user = await userService.findByEmail(email);

    if (user) {
        throw new ValidationError(`This user already exists in the database: "${email}"`);
    }

}

export const middleware = {
    Mutation: {

        signUp: async (
            resolve: any,
            parent: any,
            args: any,
            context: any,
            info: any
        ) => {
            // Before
            const { email, password, confirm } = args.SignUpInput;

            const emailError = validateEmail(email);
            const passwordError = validatePassword(password, confirm);

            SignInValidation(...emailError, ...passwordError);
            await checkIfUserExists(email);

            const result = await resolve(parent, args, context, info);
            // After
            return result;
        },
        signIn: async (
            resolve: any,
            parent: any,
            args: any,
            context: any,
            info: any
        ) => {
            // Before

            const { email } = args;

            const emailError = validateEmail(email);

            if (emailError.length > 0) {

                throw new ValidationError(`Wrong email format`);

            }


            const result = await resolve(parent, args, context, info);
            // After
            return result;
        },

    },
}