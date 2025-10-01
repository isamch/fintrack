
export const emailVerified = async (req, res, next) => {

  if (!req.session?.emailVerified) {
    return res.redirect('/verify');
  }

  next();

};


// Redirect users who already verified their email away from verification pages
export const redirectIfVerified = (req, res, next) => {
  if (req.session?.emailVerified) {
    // Redirect to previous page if available, otherwise fallback to home
    const prevUrl = req.get('Referer') || '/';
    return res.redirect(prevUrl);
  }
  next();
};