/* ---------------------- MODULOS IMPORTADOS ------------------------ */
import * as dotenv from 'dotenv';

/* ----------------- CONF DE VARIABLES DE ENTORNO ------------------- */
dotenv.config();

/* -------------------- DECLARACIÓN DE VARIABLES -------------------- */
let msgsDao;

/* ------------------- DECLARACIÓN DE DB ELEGIDA -------------------- */
switch (process.env.DB_TYPE) {
    case 'files':
        const { default: MessagesDaoFile } = await import('./messages/MessagesDaoFile.js');
        msgsDao = new MessagesDaoFile();

        break;

    case 'firebase':
        const { default: MessagesDaoFirebase } = await import('./messages/MessagesDaoFirebase.js');
        msgsDao = new MessagesDaoFirebase();
        
        break;

    case 'mongodb':
        const { default: MessagesDaoMongoDB } = await import('./messages/MessagesDaoMongoDB.js');
        msgsDao = new MessagesDaoMongoDB();
        
        break;

    default:
        const { default: MessagesDaoMemory } = await import('./messages/MessagesDaoMemory.js');
        msgsDao = new MessagesDaoMemory();
        
        break;
}

/* ---------------------- MODULOS EXPORTADOS ------------------------ */
export { msgsDao };
