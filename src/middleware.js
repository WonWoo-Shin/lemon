export const middleware = (req, res, next) => {
  res.locals.siteName = "Lemon";
  res.locals.loggedIn = req.session.loggedIn;
  res.locals.loggedInUser = req.session.user || {};
  next();
};
