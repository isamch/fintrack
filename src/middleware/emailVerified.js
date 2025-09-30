
export const emailVerified = async (req, res, next) => {

  if (!req.session?.emailVerified) {
    return res.redirect('/verify');
  }

  next();

}; 