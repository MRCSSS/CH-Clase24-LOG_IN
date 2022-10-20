/* ---------------------------- MODULOS ----------------------------- */
import connectMongo from 'connect-mongo';
import * as dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import { createServer } from 'http';
import morgan from 'morgan';
import { normalize, schema } from 'normalizr';
import path from 'path';
import { Server } from 'socket.io';
import { msgsDao, productsDao } from './daos/index.js';
import { create } from 'express-handlebars';

dotenv.config();

/* ---------------------- INSTANCIA DE SERVER ----------------------- */
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const exphbs = create({
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    defaultLayout: null,
    extname: 'hbs'
})

/* ------------------ PERSISTENCIA DE SESION MONGO ------------------ */
const MongoStore = connectMongo.create({
    mongoUrl: process.env.MONGO_URL,
    ttl: 10 *60 // Minutos *60
})

/* ---------------------- MOTOR DE PLANTILLAS -----------------------*/
app.engine('hbs', exphbs.engine);
app.set('views', path.join(process.cwd(), 'views'));
app.set('view engine', 'hbs');

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
    saveUninitialized: true,
    rolling: true
}))

// Session Middleware
function auth(req, res, next) {
    if (req.session?.user && req.session?.admin) {
      return next()
    }
    return res.render('layouts/logout', { user: user });

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
    res.render('layouts/login');
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
    res.render('layouts/home', { user:req.session.user });
});

app.get('/logout', (req, res)=> {
    const user = req.session.user;

    req.session.destroy(err=>{
        if (err) {
            res.json({err});
        } else {
            res.render('layouts/logout', { user: user });
        }
    });

    setTimeout( res.redirect('/'), 2000 );

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