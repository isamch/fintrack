export const home = (req, res) => {
  const userName = req.user?.name || 'Guest';
  const emailVerified = Boolean(req.session && req.session.emailVerified);
  return res.render('pages/index', { title: 'Home', userName, emailVerified });
};

export const about = (req, res) => {
  return res.render('pages/about', { title: 'About', message: 'About page' });
}; 