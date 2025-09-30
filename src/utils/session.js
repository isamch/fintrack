export const createUserSession = (req, user) => {
  if (!req || !req.session) return;
  req.session.user = { id: user.id, name: user.name, email: user.email };
};

export const getUserFromSession = (req) => {
  if (!req || !req.session) return null;
  return req.session.user || null;
};

export const destroyUserSession = (req) => {
  return new Promise((resolve) => {
    if (!req || !req.session) return resolve();
    req.session.destroy(() => resolve());
  });
}; 