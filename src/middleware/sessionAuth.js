import { getUserFromSession } from "../utils/session.js";


export const sessionAuth = (req, res, next) => {

  const user = getUserFromSession(req);

  if (!user) {
    return res.redirect('/auth/login');
  }

  req.user = user;
  next();

}; 