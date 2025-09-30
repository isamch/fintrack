export const createUserSession = (req, user) => {
  if (!req || !req.session) return;
  req.session.user = { id: user.id, name: user.name, email: user.email };
  req.session.emailVerified = Boolean(user.emailVerifiedAt);
};

export const getUserFromSession = (req) => {
  if (!req || !req.session) return null;
  return req.session.user || null;
};

export const isEmailVerifiedSession = (req) => {
  if (!req || !req.session) return false;
  return Boolean(req.session.emailVerified);
};

export const setEmailVerifiedSession = (req, value = true) => {
  if (!req || !req.session) return;
  req.session.emailVerified = Boolean(value);
};

export const destroyUserSession = (req) => {
  return new Promise((resolve) => {
    if (!req || !req.session) return resolve();
    req.session.destroy(() => resolve());
  });
}; 


