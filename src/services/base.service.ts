import { logger } from "../utils/winston";
import { DB_Error } from '../errorHandlers/HTTPErrors/ServerError';

export default class BaseService {

    constructor(private model: any) {
        this.model = model;
    }

    findById(id: string) {

        return this.model.findById(id)
            .then((data: any) => data)
            .catch((err: DB_Error) => {
                if (err) {
                    throw new DB_Error(err.message);
                }
            })

    }

    findByEmail(email: string) {
        return this.model.findOne({ email })
            .then((user: any) => user)
            .catch((err: DB_Error) => {
                throw new DB_Error(err.message);
            })
    }

    findAll() {
        return this.model.find()
            .then((data: any) => data)
            .catch((err: DB_Error) => {
                throw new DB_Error(err.message);
            })
    }

    findManyBy(param: object) {
        return this.model.find(param)
            .then((data: any) => data)
            .catch((err: DB_Error) => {
                if (err) {
                    throw new DB_Error(err.message);
                }
            })
    }

    update(id: string, data: object) {
        return this.model.findByIdAndUpdate(id, data)
            .then((updated: any) => Object.assign(updated._doc, data)) // TODO: check type and apply - updated 
            .catch((err: DB_Error) => {
                throw new DB_Error(err.message);
            })
    }

    delete(id: string) {
        return this.model.findByIdAndDelete(id)
            .then((deleted: any) => deleted)
            .catch((err: DB_Error) => {
                logger.error(`Error occured trying to delete: ${id}: ${err.message}`);
                throw new DB_Error(err.message);
            })
    }

    create(data: any) {

        return this.model.create(data)
            .then((created: any) => created)
            .catch((err: DB_Error) => {
                if (err) {
                    // throw new DB_Error(`Couldn't created new record to a database`)
                    throw new DB_Error(err.message)
                }
            })

    }

}
