/* ---------------------- MODULOS IMPORTADOS ------------------------ */
import ContFirebase from '../../containers/ContFirebase.js';

/* ------------------------ CLASE CONTENEDOR ------------------------ */
class MessagesDaoFirebase extends ContFirebase {
    constructor() {
        super('msgs');
    }
}

/* ---------------------- MODULOS EXPORTADOS ------------------------ */
export default MessagesDaoFirebase;