const User = require("./models/user.js");

module.exports.isRegistered = async (req, res, next) => {
  let { username } = req.body;
  let user = await User.findOne({ username });
  if (!user) {
    req.flash(
      "error",
      "You are not a registered user . First Sign up on platform"
    );
    return res.redirect("/signup");
  }
  next();
};

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in");
    return res.redirect("/login");
  }
  next();
};
