/* ---------------------------- MODULOS ----------------------------- */
import express from 'express';
import { createServer } from 'http';
import morgan from 'morgan';
import { Server } from 'socket.io';
import { normalize, schema } from 'normalizr';
import { msgsDao, productsDao } from './daos/index.js';
import connectMongo from 'connect-mongo';
import session from 'express-session';
import * as dotenv from 'dotenv';
import path, {dirname} from 'path';
import { fileURLToPath } from 'url';
dotenv.config();

/* ---------------------- INSTANCIA DE SERVER ----------------------- */
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

/* ------------------ PERSISTENCIA DE SESION MONGO ------------------ */
const MongoStore = connectMongo.create({
    mongoUrl: process.env.MONGO_URL,
    ttl: 1 *60 // Minutos *60
})

/* -------------------------- MIDDLEWARES --------------------------- */
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(morgan('dev'));

//Session Setup
app.use(session({
    store: MongoStore,
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: true
}))

// Session Middleware
function auth(req, res, next) {
    if (req.session?.user && req.session?.admin) {
      return next()
    }
    return res.sendFile(path.join(process.cwd(), 'public', 'logout.html'));
}

/* ------------------------------ RUTAS ----------------------------- */
app.get('/', (req, res) => {
    if(!req.session.user) {
        res.redirect('/login');
    } else {
        res.redirect('/home');
    }
})

app.get('/login', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'login.html'));
});

app.get('/authentication', (req, res) => {
    const { loginName } = req.query

    if (loginName !== '' ) {
        req.session.user = loginName;
        req.session.admin = true;

        return res.redirect('/home');
    }
    res.send('login failed')
})

app.get('/home', auth, (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'home.html'));
});

app.get('/logout', (req, res)=> {
    req.session.destroy(err=>{
        if (err) {
            res.json({err});
        } else {
            res.sendFile(path.join(process.cwd(), 'public', 'logout.html'));
        }
    });
});

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
    socket.emit('serv-prods', await productsDao.getAll());

    socket.on('client-msg', async (msg) => {
        await msgsDao.save(msg);
        io.sockets.emit('serv-msgs', await getAllNormalized());
    })
    socket.on('client-prods', async (prod) => {
        await productsDao.save(prod);
        io.sockets.emit('serv-prods', await productsDao.getAll());
    })
})

/* ---------------------- MODULOS EXPORTADOS ------------------------ */
export default httpServer;