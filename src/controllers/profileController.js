export const profile = (req, res) => {
  const user = req.user;
  return res.render('pages/profile', {
    title: 'Profile page',
    user
  });
}; 