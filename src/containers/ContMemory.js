/* ---------------------- MODULOS IMPORTADOS ------------------------ */
import { promises as fs } from 'fs';
import moment from 'moment';

/* ------------------------ CLASE CONTENEDOR ------------------------ */
class ContMemory {
    constructor(containerType, container) {
        this.contType = containerType;
        this.container = container;
    }

    async getAll() {
        contType = this.contType;
        
        return this.contType;
    }

    async save(prod) {
        console.log(prod)

        const prods = await this.getAll();
        let newID;

        // if (prods.length === 0) {
        //     newID = 1;
        // } else {
        //     newID = prods[prods.length-1].id+1;
        // }

        // const newObj = { ...prod, timestamp: moment().format('DD/MM/YY HH:mm:ss'), id:newID };
        const newObj = { ...prod, timestamp: moment().format('DD/MM/YY HH:mm:ss') };
        prods.push(newObj);

        try {
            await fs.writeFile(this.path, JSON.stringify(prods, null, 2));
            return newID;
        } catch (error) {
            throw new Error({error:'Error al guardar: ', description: error})
        }
    }
}

/* ---------------------- MODULOS EXPORTADOS ------------------------ */
export default ContMemory;