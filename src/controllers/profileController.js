import { User } from "../models/index.js";

export const profile = (req, res) => {
  const user = req.user;
  const emailVerified = Boolean(req.session && req.session.emailVerified);

  return res.render('pages/profile', {
    title: 'Profile',
    user,
    emailVerified
  });
};

export const updateName = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;

    // Find the user and update their name
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).render('pages/profile', {
        title: 'Profile',
        user: req.user,
        emailVerified: Boolean(req.session && req.session.emailVerified),
        error: 'User not found'
      });
    }

    await user.update({ name });

    // Update the session user data
    req.session.user = {
      ...req.session.user,
      name: name
    };

    return res.render('pages/profile', {
      title: 'Profile',
      user: { ...req.user, name },
      emailVerified: Boolean(req.session && req.session.emailVerified),
      success: 'Name updated successfully'
    });
  } catch (err) {
    return next(err);
  }
}; 