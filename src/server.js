/* ---------------------------- MODULOS ----------------------------- */
import express from 'express';
import { createServer } from 'http';
import morgan from 'morgan';
import mockRouter from './routes/test.routes.js';
import { Server } from 'socket.io';
import { normalize, schema } from 'normalizr';
import { msgsDao } from './daos/index.js';

/* ---------------------- INSTANCIA DE SERVER ----------------------- */
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

/* -------------------------- MIDDLEWARES --------------------------- */
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(morgan('dev'));

/* ------------------------------ RUTAS ----------------------------- */
app.use('/api/productos-test', mockRouter);

app.get('*', async (request, response) => {
    response.status(404).send('404 - Page not found!!');
});

/* --------------------- NORMALIZANDO MENSAJES ----------------------*/
const authorSchema = new schema.Entity('author', {}, { idAttribute: 'email' });
const messageSchema = new schema.Entity('post', { author: authorSchema }, { idAttribute: 'id' });
const msgsSchema = new schema.Entity('posts', { messages: [messageSchema] }, { idAttribute: 'id' });

const normalizing = (fullMsgs) => normalize(fullMsgs, msgsSchema);

async function getAllNormalized() {
    const msgs = await msgsDao.getAll();
    const normalized = normalizing({ id: 'messages', msgs})

    return normalized;
}

/* ---------------------------- WEBSOCKET ---------------------------*/
io.on('connection', async (socket) => {
    console.log(`Client conected: ${socket.id}`);

    socket.emit('serv-msgs', await getAllNormalized());
    socket.emit('serv-prods', []);

    socket.on('client-msg', async (msg) => {
        await msgsDao.save(msg);
        io.sockets.emit('serv-msgs', await getAllNormalized());
    })
})    

/* ---------------------- MODULOS EXPORTADOS ------------------------ */
export default httpServer;