import express from 'express';

// import helpers :
import * as viewHelpers from "./src/utils/viewHelpers.js";

// import routes :
import authRouter from './src/routes/web/authRoute.js';
import homeRouter from './src/routes/web/homeRouter.js';

// import db:
import connectDB from './src/config/db.js';

// import middlewares:
import errorHandler from './src/middleware/errorHandler.js';

// others :
import cookieParser from "cookie-parser";
import session from 'express-session';



const app = express(); // create instance app from express function factory

// set view helpers :
app.locals.helpers = viewHelpers;

// middleware: parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookies parser
app.use(cookieParser());

// session (for web auth)
app.use(session({
  secret: process.env.SESSION_SECRET || 'change_me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
}));


// Configure EJS view engine
app.set('view engine', 'ejs');
app.set('views', './src/view');


// connect db
await connectDB();


// web routers (EJS views)
app.use('/', authRouter);
app.use('/', homeRouter);




// finales middlewares:
app.use(errorHandler); 


export default app;