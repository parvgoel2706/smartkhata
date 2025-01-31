const User = require("../models/user");

module.exports.renderLoginForm = (req, res) => {
  res.render("./user/login.ejs");
};

module.exports.renderSignupForm = (req, res) => {
  res.render("./user/signup.ejs");
};

module.exports.login = (req, res) => {
  req.flash("success", "Welcome back to SmartKhata:)");
  res.redirect("/account/dashboard");
};

module.exports.signup = async (req, res) => {
  let user = req.body;
  try {
    let registeredUser = await User.register(user, `${user.password}`);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome To SmartKhata");
      res.redirect("/account/dashboard");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

module.exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      next(err);
    } else {
      req.flash("success", "Successfully logged out");
      res.redirect("/login");
    }
  });
};

