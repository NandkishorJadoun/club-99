const CustomAuthError = require("../errors/CustomAuthError");

function isAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    throw new CustomAuthError("You are not Authenticated");
  }
}

module.exports = isAuth;
