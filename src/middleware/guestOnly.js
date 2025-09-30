import { getUserFromSession } from "../utils/session.js";


export const guestOnly = (req, res, next) => {

  const user = getUserFromSession(req);

  if (user) {
    return res.redirect('/');
  }

  next();

}; 