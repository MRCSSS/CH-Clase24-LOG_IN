/* ---------------------- MODULOS IMPORTADOS ------------------------ */
import { promises as fs } from 'fs';
import config from '../config.js';
import moment from 'moment';

/* ------------------------ CLASE CONTENEDOR ------------------------ */
class ContFile {
    constructor(path) {
        this.path = `${config.fileSystem.path}/${path}`;
    }

    async getAll() {
        try {
            const objs = await fs.readFile(this.path, 'utf8');
            return JSON.parse(objs);
        } catch (error) {
            console.log('ContFile.js at getAll() ', error);
            return [];
        }
    }

    async save(obj) {
        console.log("obj", obj)
        const objs = await this.getAll();
        // let newID;

        // if (objs.length === 0) {
        //     newID = 1;
        // } else {
        //     newID = objs[objs.length-1].id+1;
        // }

        // const newObj = { ...obj, timestamp: moment().format('DD/MM/YY HH:mm:ss'), id:newID };
        const newObj = { ...obj, timestamp: moment().format('DD/MM/YY HH:mm:ss') };
        objs.push(newObj);

        try {
            await fs.writeFile(this.path, JSON.stringify(objs, null, 2));
            return newID;
        } catch (error) {
            throw new Error({error:'Error al guardar: ', description: error})
        }
    }
}

/* ---------------------- MODULOS EXPORTADOS ------------------------ */
export default ContFile;