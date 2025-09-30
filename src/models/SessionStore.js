import session from 'express-session';
import connectSessionSequelize from 'connect-session-sequelize';
import { sequelize } from '../config/db.js';


const SequelizeStore = connectSessionSequelize(session.Store);

let synced = false;

export const initSessionTable = async () => {

  if (synced) return true;

  const sessionStore = new SequelizeStore({
    db: sequelize,
    tableName: 'sessions',
    checkExpirationInterval: 15 * 60 * 1000,
    expiration: 7 * 24 * 60 * 60 * 1000
  });

  await sessionStore.sync();
  synced = true;
  return true;
}; 