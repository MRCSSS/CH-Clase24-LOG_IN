/* ---------------------- MODULOS IMPORTADOS ------------------------ */
import httpServer from './src/server.js'

/* ---------------------------- SERVIDOR ---------------------------- */
const PORT = 8080;
const server = httpServer.listen(PORT, () => {
    console.log(`Server listening: http://localhost:${PORT}`);
})

server.on('error', err => {
    console.log(`Server error: ${err}`);
})
