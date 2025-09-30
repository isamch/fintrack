export const profile = (req, res) => {
  const user = req.user;
  const emailVerified = Boolean(req.session && req.session.emailVerified);

  console.log(emailVerified);
  console.log(user);
  return res.render('pages/profile', {
    title: 'Profile page',
    user,
    emailVerified
  });
}; 