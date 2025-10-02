import express from 'express';

// import helpers :
import * as viewHelpers from "./src/utils/viewHelpers.js";

// import routes :
import authRouter from './src/routes/web/authRoute.js';
import homeRouter from './src/routes/web/homeRouter.js';

// import db:
import connectDB, { sequelize } from './src/config/db.js';

// import middlewares:
import errorHandler from './src/middleware/errorHandler.js';

// others :
import cookieParser from "cookie-parser";
import session from 'express-session';
import connectSessionSequelize from 'connect-session-sequelize';
import { initSessionTable } from './src/models/SessionStore.js';
import './src/models/index.js';



const app = express(); // create instance app from express function factory

// set view helpers :
app.locals.helpers = viewHelpers;

// middleware: parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookies parser
app.use(cookieParser());

// expose session user and verification to all views
app.use((req, res, next) => {
  res.locals.user = (req.session && req.session.user) || null;
  res.locals.emailVerified = Boolean(req.session && req.session.emailVerified);
  next();
});

// Configure EJS view engine
app.set('view engine', 'ejs');
app.set('views', './src/view');


// connect db
await connectDB();

// optional: sync models via env flags (development only recommended)
if (String(process.env.DB_SYNC || '').toLowerCase() === 'true') {
  const alter = String(process.env.DB_SYNC_ALTER || '').toLowerCase() === 'true';
  await sequelize.sync({ alter });
}

// ensure sessions table exists
await initSessionTable();

// configure session to use the Sequelize sessions table
const SequelizeStore = connectSessionSequelize(session.Store);
const sessionStore = new SequelizeStore({
  db: sequelize,
  tableName: 'sessions',
  checkExpirationInterval: 15 * 60 * 1000,
  expiration: 7 * 24 * 60 * 60 * 1000
});

app.use(session({
  secret: process.env.SESSION_SECRET || 'change_me',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
}));


// web routers (EJS views)
app.use('/', authRouter);
app.use('/', homeRouter);




// finales middlewares:
app.use(errorHandler); 


export default app;