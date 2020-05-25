import { SchemaDirectiveVisitor } from 'apollo-server-express';
import { defaultFieldResolver } from 'graphql';

class UpperCaseDirective extends SchemaDirectiveVisitor {
    visitFieldDefinition(field: any) {
        const { resolve = defaultFieldResolver } = field;
        // const params = this.args; // assigning directive arguments
        field.resolve = async function (...args: any) {
            const result = await resolve.apply(this, args);
            if (typeof result === 'string') {
                return result.toUpperCase();
            }

            // console.log(params);
            console.log(result);
            return result;
        };
    }
}


export const directive = {
    upper: UpperCaseDirective
}