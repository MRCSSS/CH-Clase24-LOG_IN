/* ---------------------- MODULOS IMPORTADOS ------------------------ */
import mongoose from 'mongoose';
import config from '../config.js';
import moment from 'moment';

await mongoose.connect(config.mongodb.cnxStr);

/* ------------------------ CLASE CONTENEDOR ------------------------ */
class ContMongoDB {
    constructor(collectionName, squema) {
        this.collection = mongoose.model(collectionName, squema);
    }

    async getAll() {
        try {
            let docs = await this.collection.find({});
            return docs;
        } catch (error) {
            throw new Error(`getAll() error: ${error}`);
        }
    }

    async save(obj) {
        try {
            let newObj = await this.collection.create({ ...obj, timestamp: moment().format('DD/MM/YY HH:mm:ss') });
            return newObj._id;
        } catch (error) {
            throw new Error(`save(obj) error: ${error}`);
        }
    }
}

/* ---------------------- MODULOS EXPORTADOS ------------------------ */
export default ContMongoDB;