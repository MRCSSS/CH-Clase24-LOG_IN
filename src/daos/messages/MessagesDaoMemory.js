/* ---------------------- MODULOS IMPORTADOS ------------------------ */
import ContMemory from '../../containers/ContMemory.js';

/* ------------------------ CLASE CONTENEDOR ------------------------ */
class MessagesDaoMemory extends ContMemory {
    constructor() {
        super('msgs');
    }
}

/* ---------------------- MODULOS EXPORTADOS ------------------------ */
export default MessagesDaoMemory;