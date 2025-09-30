export const home = (req, res) => {
  return res.render('pages/index', { title: 'Home', message: `Welcome, ${req.user?.name || 'Guest'}!` });
};

export const about = (req, res) => {
  return res.render('pages/about', { title: 'About', message: 'About page' });
}; 