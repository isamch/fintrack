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

  const forceRebuild = String(process.env.SESSION_RESET_SESSIONS || '').toLowerCase() === 'true';
  await sessionStore.sync({ force: forceRebuild });
  synced = true;
  return true;
}; 