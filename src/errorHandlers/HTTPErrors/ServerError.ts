export abstract class ServerError extends Error {
    readonly statusCode!: number;
    readonly name!: string;
    readonly group: string

    constructor(message: object | string) {
        if (message instanceof Object) {
            super(JSON.stringify(message));
        } else {
            super(message);
        }
        this.name = this.constructor.name;
        this.group = 'ServerError';
        Error.captureStackTrace(this, this.constructor);
    }
}

export class DB_Error extends ServerError {
    readonly statusCode: any;
    readonly name = 'DB_Error';

    constructor(message: string | object = "Something went wrong with DataBase", code: string | number = 500) {
        super(message);
        this.statusCode = code
    }
}