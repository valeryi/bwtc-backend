export abstract class HTTPClientError extends Error {
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
        this.group = 'HTTPClientError';
        Error.captureStackTrace(this, this.constructor);
    }
}

export class HTTP400Error extends HTTPClientError {
    readonly statusCode = 400;
    readonly name = 'HTTP400Error';

    constructor(message: string | object = "Bad Request") {
        super(message);
    }
}

export class HTTP404Error extends HTTPClientError {
    readonly statusCode = 404;
    readonly name = 'HTTP404Error';

    constructor(message: string | object = "Not found") {
        super(message);
    }
}