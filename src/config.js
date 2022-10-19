/* ---------------------------- MODULOS -----------------------------*/
import * as dotenv from 'dotenv';

dotenv.config();

/* ------------------- OBJETO CONFIGURADOR DE DB -------------------- */
export default {
    fileSystem: {
        path: './db'
    },
    mongodb: {
        cnxStr: `mongodb+srv://admin:adminpw@cluster0.vfrm3.mongodb.net/sessions?retryWrites=true&w=majority`
    },
    
}
