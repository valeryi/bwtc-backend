import mongoose, { Connection } from 'mongoose';
import { env } from "../environments";
import { sysLog } from '../utils/winston';

class Database {
    private db: Connection = mongoose.connection;
    private _provider: string = 'MongoDB';
    private _username: string | undefined = env.db.username;
    private _password: string | undefined = env.db.password;
    private _dbName: string | undefined = env.db.name;
    private options: Object = {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true
    };

    constructor() { }

    init() {
        mongoose.Promise = global.Promise;

        const url = `mongodb+srv://${this._username}:${this._password}@cluster0-ltgs3.mongodb.net/${this._dbName}?retryWrites=true&w=majority`;

        this.db.on('connecting', () => {
            // sysLog.info('Connecting to MongoDB...');
        });

        this.db.on('error', (err: Error) => {
            sysLog.error(`Something went wrong trying to connect to the database: ${this._provider}: ` + err);
            mongoose.disconnect();
        });

        this.db.on('connected', () => {
            // sysLog.info('MongoDB connected!');
        });

        this.db.once('open', () => {
            sysLog.info(`MongoDB - Connection open`);
        });

        this.db.on('reconnected', () => {
            // sysLog.info('MongoDB reconnected!');
        });

        this.db.on('disconnected', () => {
            sysLog.error('MongoDB disconnected!');

            setTimeout(() => {
                this.connect(url);
            }, 5000);

        });

        this.connect(url);

    }

    connect(url: string) {
        mongoose.connect(url, this.options);
    }

}

export const database = new Database();

// TODO: Add monitoring of a connection state and informing certain people accordingly