/* ---------------------- MODULOS IMPORTADOS ------------------------ */
import httpServer from './src/server.js'
import * as dotenv from 'dotenv';

/* ----------------- CONF DE VARIABLES DE ENTORNO ------------------- */
dotenv.config();

/* ---------------------------- SERVIDOR ---------------------------- */
const PORT = process.env.PORT;
const server = httpServer.listen(PORT, () => {
    console.log(`Server listening: http://localhost:${PORT}`);
})

server.on('error', err => {
    console.log(`Server error: ${err}`);
})
